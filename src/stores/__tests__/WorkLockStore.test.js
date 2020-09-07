import WorkLockStore from '../WorkLockStore';
import Web3Initilizer from '../../web3Initializer';
import Web3 from 'web3';
jest.mock('../../web3Initializer');

describe('WorkLockStore', () => {

  let workLockStore;
  let workLockContract;

  beforeAll(async () => {
    await Web3Initilizer.initialize();
    workLockContract = Web3Initilizer.getWorkLockContractInstance();
    workLockStore = new WorkLockStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to make a bid', async () => {
    await workLockStore.bid(Web3.utils.toWei('5'));
    expect(workLockContract.methods.bid).toBeCalled();
  });

  it('should be able to cancel bid', async () => {
    await workLockStore.cancelBid();
    expect(workLockContract.methods.cancelBid).toBeCalled();
  });

  it('should be able to claim', async () => {
    await workLockStore.claim();
    expect(workLockContract.methods.claim).toBeCalled();
  });

  it('should be able to refund', async () => {
    await workLockStore.refund();
    expect(workLockContract.methods.refund).toBeCalled();
  });

  it('should set init flag on init', async () => {
    await workLockStore.init();
    expect(workLockStore.inited).toBe(true);
  });

  it('should get unlocked ETH', async () => {
    await workLockStore.getUnlockedEth();
    expect(workLockStore.unlockedEth).not.toBeNull();
  });

  it('should be able to get worklock status correctly', async () => {
    const origGetTime = Date.prototype.getTime;
    Date.prototype.getTime = () => 1583000000000; // eslint-disable-line
    // in progress
    await workLockStore.init();
    expect(workLockStore.workLockStatus()).toBe('in_progress');

    // finished
    workLockContract.startBidDate = 502387602;
    workLockContract.endBidDate = 512387602;
    await workLockStore.init();
    expect(workLockStore.workLockStatus()).toBe('finished');

    // not started
    workLockContract.startBidDate = 2502387602;
    workLockContract.endBidDate = 2512387602;
    await workLockStore.init();
    expect(workLockStore.workLockStatus()).toBe('not_started');
    Date.prototype.getTime = origGetTime; // eslint-disable-line
  });

  it('should be able to get bid cancelabtion status correctly', async () => {
    const origGetTime = Date.prototype.getTime;
    Date.prototype.getTime = () => 1583000000000; // eslint-disable-line
    // in progress
    await workLockStore.init();
    expect(workLockStore.cancelationBidStatus()).toBe('in_progress');

    // finished
    workLockContract.cancelationBidDate = 502387602;
    await workLockStore.init();
    expect(workLockStore.cancelationBidStatus()).toBe('finished');
    Date.prototype.getTime = origGetTime; // eslint-disable-line
  });

  it('should be able to get remaining work', async () => {
    await workLockStore.getRemainingWork();
    expect(workLockContract.methods.getRemainingWork).toBeCalled();
  });
});
