import { decorate } from 'mobx';
import Web3Initilizer from '../web3Initializer';

class PolicyStore {

  constructor() {
    this.nodeReward = null;
  }

  async withdraw() {
    const web3 = Web3Initilizer.getWeb3();
    const policyContract = Web3Initilizer.getPolicyContractInstance();
    const address = (await web3.eth.getAccounts())[0];
    await policyContract.methods.withdraw().send({
      from: address
    });
  }

  async getNodeReward(staker) {
    const web3 = Web3Initilizer.getWeb3();
    const policyContract = Web3Initilizer.getPolicyContractInstance();
    const escrowContract = Web3Initilizer.getContractInstance();
    const address = (await web3.eth.getAccounts())[0];
    const workerAddress = await escrowContract.methods.getWorkerFromStaker(address).call();
    const nodeInfo = await policyContract.methods.nodes(workerAddress).call();
    this.nodeReward = nodeInfo.reward;
  }
}

export default decorate(PolicyStore, {
});
