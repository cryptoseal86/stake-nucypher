import { observable, action, decorate } from 'mobx';
import Staker from '../models/Staker';
import SubStake from '../models/SubStake';
import { isHexNil } from '../utils/utils';
import Web3Initilizer from '../web3Initializer';
import BN from 'bignumber.js';

class StakerStore {
  staker = null;
  completedWork = null;

  async getStakerInfo(address) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = address || (await web3.eth.getAccounts())[0];
    const staker = new Staker(await contract.methods.stakerInfo(account).call());
    staker.lockedTokens = await contract.methods.getLockedTokens(account, 1).call();
    staker.availableForWithdraw = (new web3.utils.BN(staker.value)).sub(new web3.utils.BN(staker.lockedTokens)).toString();
    if (!isHexNil(staker.worker)) {
      staker.lastActivePeriod = await contract.methods.getLastCommittedPeriod(account).call();
    }
    staker.address = account;
    this.staker = staker;
    await this.getSubStakes(account);
    await this.getFlagsForStaker(account);
  }

  async getSubStakes(address) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = address || (await web3.eth.getAccounts())[0];
    const substakesCount = await contract.methods.getSubStakesLength(account).call();
    const substakes = [];
    for (let currentSubStakeIndex = 0; currentSubStakeIndex < substakesCount; currentSubStakeIndex++) {
      const subStake = await contract.methods.getSubStakeInfo(account, currentSubStakeIndex).call();
      const firstPeriod = new Date(1000 * 60 * 60 * 24 * subStake.firstPeriod);
      let lastPeriod;
      if (subStake.lastPeriod === '0') {
        lastPeriod = new Date();
        lastPeriod.setTime(lastPeriod.getTime() + ((+subStake.periods + 1) * 24 * 60 * 60 * 1000));
        lastPeriod.setHours(0, 0, 0, 0);
      } else {
        lastPeriod = new Date(1000 * 60 * 60 * 24 * (+subStake.lastPeriod + 1));
        lastPeriod.setHours(0, 0, 0, 0);
      }
      substakes.push(new SubStake({
        index: currentSubStakeIndex,
        firstPeriod,
        lastPeriod,
        value: subStake.lockedValue,
        remainingDuration: (+subStake.periods) + 1
      }));
    }
    this.staker.substakes = substakes;
  }

  async getFlagsForStaker(address) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = address || (await web3.eth.getAccounts())[0];
    const flags = await contract.methods.getFlags(account).call();
    this.staker.flags = flags;
  }

  async setReStake(value) {
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    const contract = Web3Initilizer.getContractInstance();
    await contract.methods.setReStake(value).send({
      from: account
    });
    this.staker.flags.reStake = !value;
  }

  async addStake(newStake) {
    const contract = Web3Initilizer.getContractInstance();
    const token = Web3Initilizer.getTokenInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      const allowance = await token.methods.allowance(account, contract._address).call();
      const stakeValue = web3.utils.toWei(newStake.stakeValue.toString());
      if (allowance === '0') {
        await token.methods.approve(contract._address, newStake.infiniteApproval ? -1 : stakeValue).send({
          from: account
        });
      } else if (BN(stakeValue).gt(allowance)) {
        await token.methods.increaseAllowance(contract._address, BN(stakeValue).minus(allowance)).send({
          from: account
        });
      }
      await contract.methods.deposit(account, stakeValue, newStake.stakeDuration.toString()).send({
        from: account
      });
      await this.getStakerInfo();
    } catch(e) {
      console.error(e);
    }
  }

  async bondWorker(newWorker) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    if (web3.utils.isAddress(newWorker.workerAddress)) {
      try {
        await contract.methods.bondWorker(newWorker.workerAddress).send({
          from: account
        });
        this.staker.worker = newWorker.workerAddress;
      } catch(e) {
        console.error(e);
      }
    }
  }

  async getCompletedWork() {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    this.completedWork = await contract.methods.getCompletedWork(address).call();
  }

  async detachWorker() {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      await contract.methods.bondWorker('0x0000000000000000000000000000000000000000').send({
        from: account
      });
      this.staker.worker = '0x0000000000000000000000000000000000000000';
    } catch(e) {
      console.error(e);
    }
  }

  async setWindDown(value) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      await contract.methods.setWindDown(value).send({
        from: account
      });
      this.staker.flags.windDown = value;
    } catch(e) {
      console.error(e);
    }
  }

  async divideStake(index, newValue, newDuration) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      await contract.methods.divideStake(index, newValue, newDuration).send({
        from: account
      });
      await this.getSubStakes(account);
    } catch(e) {
      console.error(e);
    }
  }

  async prolongStake(index, extendDuration) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      await contract.methods.prolongStake(index, extendDuration).send({
        from: account
      });
      await this.getSubStakes(account);
    } catch(e) {
      console.error(e);
    }
  }

  async mergeSubStake(index, mergeWithIndex) {
    const contract = Web3Initilizer.getContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const account = (await web3.eth.getAccounts())[0];
    try {
      const firstStake = this.staker.substakes[index];
      const secondStake = this.staker.substakes[mergeWithIndex];

      if (firstStake.remainingDuration !== secondStake.remainingDuration) {
        const [minDurationStake, maxDurationStake] = firstStake.remainingDuration > secondStake.remainingDuration ? [secondStake, firstStake] : [firstStake, secondStake];
        await this.prolongStake(minDurationStake.index, maxDurationStake.remainingDuration - minDurationStake.remainingDuration);
      }

      await contract.methods.mergeStake(index, mergeWithIndex).send({
        from: account
      });
      await this.getSubStakes(account);
    } catch(e) {
      console.error(e);
    }
  }

  async withdraw(withdrawValue) {
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    const contract = Web3Initilizer.getContractInstance();
    await contract.methods.withdraw(withdrawValue).send({
      from: address
    });
  }
}

export default decorate(StakerStore, {
  staker: observable,
  getStakeInfo: action,
  getSubStakes: action
});
