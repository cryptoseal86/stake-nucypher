import AppStore from '../AppStore';
jest.mock('../../web3Initializer');

describe('AppStore', () => {

  it('should call initWeb3 on constructor', () => {
    jest.spyOn(AppStore.prototype, 'initWeb3');
    const appStore = new AppStore();
    expect(AppStore.prototype.initWeb3).toBeCalled();
  });

  it('should init other stores', () => {
    const appStore = new AppStore();
    expect(appStore.stakerStore).not.toBeNull();
    expect(appStore.historyStore).not.toBeNull();
    expect(appStore.policyStore).not.toBeNull();
    expect(appStore.workLockStore).not.toBeNull();
  });

  it('should be able to get contract constants', async () => {
    const appStore = new AppStore();
    const contractConstants = await appStore.getEscrowConstants();
    const expectedConstants = {
      minAllowableLockedTokens: '10000',
      maxAllowableLockedTokens: '1000000',
      minWorkerPeriods: '30',
      maxSubStakes: '20'
    };
    expect(contractConstants).toEqual(expectedConstants)
  });

  it('should be able to receive current period', async () => {
    const appStore = new AppStore();
    const currentPeriod = await appStore.getCurrentPeriod();
    expect(currentPeriod).toBe('18945');
  });

  it('should set current period on initWeb3', async () => {
    const appStore = new AppStore();
    await appStore.initWeb3();
    expect(appStore.currentPeriod).toBe('18945');
  });
});
