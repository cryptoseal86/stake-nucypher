import HistoryStore from '../HistoryStore';
import Web3Initilizer from '../../web3Initializer';
import Web3 from 'web3';
import BN from 'bignumber.js';
jest.mock('../../web3Initializer');

describe('HistoryStore', () => {

  let escrowContract;
  let historyStore;
  let web3;
  let account;
  beforeAll(async () => {
    await Web3Initilizer.initialize();
    web3 = Web3Initilizer.getWeb3();
    account = (await web3.eth.getAccounts())[0];
    escrowContract = Web3Initilizer.getContractInstance();
    historyStore = new HistoryStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get history', async () => {
    await historyStore.getHistory();
    expect(historyStore.events).not.toBeNull();
    expect(escrowContract.getPastEvents).toBeCalled();
  });

  it('should be able to get rewards', async () => {
    const rewards = historyStore.getTotalRewards([{
      type: 'mined',
      value: '1'
    },
    {
      type: 'mined',
      value: '2'
    }]);
    expect(rewards).toBe('3');
  })
});
