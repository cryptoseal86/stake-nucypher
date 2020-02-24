import { observable, action, decorate, computed } from 'mobx';
import { fromPromise } from 'mobx-utils';
import BN from 'bignumber.js';
import Web3Initilizer from '../web3Initializer';

class WorkLockStore {

  #ethSupplyListener = null;
  startBidDate = null;
  endBidDate = null;
  stakingPeriods = null;
  tokenSupply = null;
  ethSupply = null;
  workInfo = null;
  inited = false;
  unlockedEth = null;

  constructor() {
  }

  async init() {
    await this.getWorkInfo();
    await this.getStartBidDate();
    await this.getEndBidDate();
    await this.getEthSupply();
    await this.getTokenSupply();
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

  async workToEth(workAmount) {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    return await workLockContract.methods.workToETH(workAmount).call();
  }

  async ethToTokens(ethAmount) {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    return await workLockContract.methods.ethToTokens(ethAmount).call();
  }

  async getUnlockedEth(completedWork) {
    this.unlockedEth = await this.workToEth(BN(completedWork).minus(this.workInfo ? this.workInfo.completedWork : 0).toFixed());
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

  async refund() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    return await workLockContract.methods.refund().send({
      from: address
    });
  }

  async getEthSupply() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    const web3 = Web3Initilizer.getWeb3();
    this.ethSupply = await workLockContract.methods.ethSupply().call();
  }

  async getTokenSupply() {
    const workLockContract = Web3Initilizer.getWorkLockContractInstance();
    this.tokenSupply = await workLockContract.methods.tokenSupply().call();
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
    return 'unknown';
  }
}

export default decorate(WorkLockStore, {
  ethSupply: observable,
  workInfo: observable,
  unlockedEth: observable
});
