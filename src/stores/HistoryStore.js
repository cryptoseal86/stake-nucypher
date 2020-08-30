import { observable, action, decorate } from 'mobx';
import Web3Initilizer from '../web3Initializer';
import Web3 from 'web3';

class HistoryStore {

  constructor() {
    this.events = null;
    this.totalRewards = null;
  }

  async getHistory() {
    const web3 = Web3Initilizer.getWeb3();
    const address = (await web3.eth.getAccounts())[0];
    const contract = Web3Initilizer.getContractInstance();
    const policyContract = Web3Initilizer.getPolicyContractInstance();
    const activityConfirmedEvents = (await contract.getPastEvents('CommitmentMade', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'commitmentMade', block: a.blockNumber, ...a.returnValues } });
    const depositedEvents = (await contract.getPastEvents('Deposited', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'deposit', block: a.blockNumber, ...a.returnValues } });
    const withdrawEvents = (await contract.getPastEvents('Withdrawn', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'withdraw', block: a.blockNumber, ...a.returnValues } });
    const reStakeSetEvents = (await contract.getPastEvents('ReStakeSet', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'restakeEnable', block: a.blockNumber, ...a.returnValues } });
    const slashedEvents = (await contract.getPastEvents('Slashed', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'slashed', block: a.blockNumber, ...a.returnValues } });
    const windDownEvents = (await contract.getPastEvents('WindDownSet', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'windDown', block: a.blockNumber, ...a.returnValues } });
    const divideEvents = (await contract.getPastEvents('Divided', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'divide', block: a.blockNumber, ...a.returnValues } });
    const workerEvents = (await contract.getPastEvents('WorkerBonded', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'workerBonded', block: a.blockNumber, ...a.returnValues } });
    //const prolongEvents = (await contract.getPastEvents('Prolonged', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'prolong', block: a.blockNumber, ...a.returnValues } });
    const minedEvents = (await contract.getPastEvents('Minted', { filter: { staker: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'minted', block: a.blockNumber, ...a.returnValues } });
    const policyWithdrawEvents = (await policyContract.getPastEvents('Withdrawn', { filter: { node: address }, fromBlock: 0, toBlock: 'latest' })).map(a => { return { type: 'policyWithdraw', block: a.blockNumber, ...a.returnValues } });
    const events = [
      ...activityConfirmedEvents,
      ...depositedEvents,
      ...withdrawEvents,
      ...reStakeSetEvents,
      ...slashedEvents,
      ...windDownEvents,
      ...divideEvents,
      ...workerEvents,
      ...minedEvents,
      //...prolongEvents,
      ...policyWithdrawEvents
    ];

    events.sort((a, b) => b.block - a.block);
    this.totalRewards = this.getTotalRewards(minedEvents);
    this.events = events;
    return events;
  }

  getTotalRewards(events) {
    let reward = new Web3.utils.BN(0);
    events.forEach(e => {
      if (e.type === 'mined' && e.value) {
        reward = reward.add(new Web3.utils.BN(e.value));
      }
    });
    return reward.toString();
  }
}

export default decorate(HistoryStore, {
  events: observable
});
