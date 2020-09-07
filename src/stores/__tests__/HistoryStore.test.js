import HistoryStore from '../HistoryStore';
import Web3Initilizer from '../../web3Initializer';
jest.mock('../../web3Initializer');

describe('HistoryStore', () => {

  let escrowContract;
  let historyStore;
  beforeAll(async () => {
    await Web3Initilizer.initialize();
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
