import { observable, action, decorate } from 'mobx';
import StakerStore from './StakerStore';
import HistoryStore from './HistoryStore';
import PolicyStore from './PolicyStore';
import WorkLockStore from './WorkLockStore';
import Web3Initilizer from '../web3Initializer';

class AppStore {
  web3Initilized = false;
  currentPeriod = null;
  minAllowableLockedTokens = null;
  maxAllowableLockedTokens: null;
  minWorkerPeriods = null;
  maxSubStakes = null;

  constructor() {
    this.stakerStore = new StakerStore();
    this.historyStore = new HistoryStore();
    this.policyStore = new PolicyStore();
    this.workLockStore = new WorkLockStore();


    this.initWeb3();
  }

  async initWeb3() {
    this.web3Initilized = await Web3Initilizer.initialize();
    if (this.web3Initilized) {
      this.currentPeriod = await this.getCurrentPeriod();
    }
  }

  async getEscrowConstants() {
    const contract = Web3Initilizer.getContractInstance();
    const minAllowableLockedTokens = await contract.methods.minAllowableLockedTokens().call();
    const maxAllowableLockedTokens = await contract.methods.maxAllowableLockedTokens().call();
    const minWorkerPeriods = await contract.methods.minWorkerPeriods().call();
    const maxSubStakes = await contract.methods.MAX_SUB_STAKES().call();
    return { minAllowableLockedTokens, maxAllowableLockedTokens, minWorkerPeriods, maxSubStakes };
  }

  async getCurrentPeriod() {
    const contract = Web3Initilizer.getContractInstance();
    return await contract.methods.getCurrentPeriod().call();
  }
}

export default decorate(AppStore, {
  web3Initilized: observable,
  initWeb3: action
});
