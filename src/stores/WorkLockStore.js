import { observable, decorate } from 'mobx';
import BN from 'bignumber.js';
import Web3Initilizer from '../web3Initializer';

class WorkLockStore {

  startBidDate = null;
  endBidDate = null;
  endCancellationDate = null;
  stakingPeriods = null;
  tokenSupply = null;
  workInfo = null;
  inited = false;
  unlockedEth = null;
  minAllowedBid = null;
  biddersLength = null;
  bonusEthSupply = null;
  claimingAvailable = null;
  biddersNumber = null;
  availableCompensation = null;
  stakingPeriods = null;

  async init() {
    await this.getWorkInfo();
    await this.getStartBidDate();
    await this.getEndBidDate();
    await this.getEndCancellationDate();
    await this.getBonusEthSupply();
    await this.getTokenSupply();
    await this.getBiddersLength();
    await this.getMinAllowedBid();
    await this.isClaimingAvailable();
    await this.getBiddersNumber();
    await this.getAvailableCompensation();
    await this.getStakingPeriods();
    this.claimAmount = await this.ethToTokens(this.workInfo.depositedETH);
    this.ethSupply = BN(this.biddersLength).times(this.minAllowedBid).plus(this.bonusEthSupply).toFixed(0);
    this.inited = true;
  }

  async getWorkInfo() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    this.workInfo = await workLockContract.methods.workInfo(address).call();
  }

  async getStartBidDate() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.startBidDate = await workLockContract.methods.startBidDate().call();
  }

  async getEndBidDate() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.endBidDate = await workLockContract.methods.endBidDate().call();
  }

  async getEndCancellationDate() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.endCancellationDate = await workLockContract.methods.endCancellationDate().call();
  }

  async workToEth(workAmount) {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    return await workLockContract.methods.workToETH(workAmount).call();
  }

  async ethToTokens(ethAmount) {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    return await workLockContract.methods.ethToTokens(ethAmount).call();
  }

  async getStakingPeriods() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    return await workLockContract.methods.stakingPeriods().call();
  }

  async getUnlockedEth() {
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.unlockedEth = await workLockContract.methods.getAvailableRefund(address).call();
  }

  // for testing purpose
  // async tokenDeposit() {
  //   const workLockContract = Web3Initilizer.getWorkLockContractInstance();
  // }

  async getRemainingWork() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.getRemainingWork(address).call();
  }

  async bid(value) {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.bid().send({
      from: address,
      value: value
    });
  }

  async getAvailableCompensation() {
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.availableCompensation = await workLockContract.methods.compensation(address).call();
  }

  async cancelBid() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    const result = await workLockContract.methods.cancelBid().send({
      from: address
    });
    return result;
  }

  async claim() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.claim().send({
      from: address
    });
  }

  async withdrawCompensation() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.withdrawCompensation().send({
      from: address
    });
  }

  async refund() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.refund().send({
      from: address
    });
  }

  async getTokenSupply() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.tokenSupply = await workLockContract.methods.tokenSupply().call();
  }

  async getBonusEthSupply() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.bonusEthSupply = await workLockContract.methods.bonusETHSupply().call();
  }

  async getBiddersLength() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.biddersLength = await workLockContract.methods.getBiddersLength().call();
  }

  async getMinAllowedBid() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.minAllowedBid = await workLockContract.methods.minAllowedBid().call();
  }

  async isClaimingAvailable() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.claimingAvailable = await workLockContract.methods.isClaimingAvailable().call();
  }

  async getBiddersNumber() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.biddersNumber = await workLockContract.methods.getBiddersLength().call();
  }

  workLockStatus() {
    const currentTimestamp = (new Date().getTime() / 1000).toFixed(0);
    if (this.startBidDate > currentTimestamp) {
      return 'not_started';
    } else if (this.endBidDate < currentTimestamp && this.startBidDate < currentTimestamp) {
      return 'finished';
    } else if (this.endBidDate > currentTimestamp && this.startBidDate < currentTimestamp) {
      return 'in_progress';
    }
  }

  cancelationBidStatus() {
    const currentTimestamp = (new Date().getTime() / 1000).toFixed(0);
    if (this.endCancellationDate >= currentTimestamp) {
      return 'in_progress';
    } else if (this.endCancellationDate < currentTimestamp) {
      return 'finished';
    }
  }
}

export default decorate(WorkLockStore, {
  bonusEthSupply: observable,
  workInfo: observable,
  claimAmount: observable,
  unlockedEth: observable
});
