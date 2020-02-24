import PolicyStore from '../PolicyStore';
import Web3Initilizer from '../../web3Initializer';
import Web3 from 'web3';
import BN from 'bignumber.js';
jest.mock('../../web3Initializer');

describe('PolicyStore', () => {

  let policyContract;
  let policyStore;
  let web3;
  let account;
  beforeAll(async () => {
    await Web3Initilizer.initialize();
    web3 = Web3Initilizer.getWeb3();
    account = (await web3.eth.getAccounts())[0];
    policyContract = Web3Initilizer.getPolicyContractInstance();
    policyStore = new PolicyStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to withdraw policy rewards', async () => {
    await policyStore.withdraw();
    expect(policyContract.methods.withdraw).toBeCalled();
  });

  it('should be able to get amount of policy rewards', async () => {
    const escrowContract = Web3Initilizer.getContractInstance();
    const stakerInfo = await escrowContract.methods.stakerInfo(account).call();
    await policyStore.getNodeReward();
    expect(escrowContract.methods.getWorkerFromStaker).toBeCalledWith(account);
    expect(policyContract.methods.nodes).toBeCalledWith(stakerInfo.worker);
    expect(policyStore.nodeReward).not.toBeNull();
  });
});
