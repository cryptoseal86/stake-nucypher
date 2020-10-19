import StakerStore from '../StakerStore';
import Web3Initilizer from '../../web3Initializer';
import Web3 from 'web3';
import BN from 'bignumber.js';
jest.mock('../../web3Initializer');

describe('StakerStore', () => {

  let escrowContract;
  let stakerStore;
  let web3;
  let account;
  beforeAll(async () => {
    await Web3Initilizer.initialize();
    web3 = Web3Initilizer.getWeb3();
    account = (await web3.eth.getAccounts())[0];
    escrowContract = Web3Initilizer.getContractInstance();
    stakerStore = new StakerStore();
    await stakerStore.getStakerInfo();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get staker info', async () => {
    await stakerStore.getStakerInfo();
    expect(stakerStore.staker).not.toBeNull();
  });

  it('should be able to toggle restaking', async () => {
    await stakerStore.setReStake(true);
    expect(escrowContract.methods.setReStake).toBeCalledWith(true);
    expect(stakerStore.staker.reStakeDisabled).not.toBeTruthy();

    await stakerStore.setReStake(false);
    expect(escrowContract.methods.setReStake).toBeCalledWith(false);
    expect(stakerStore.staker.reStakeDisabled).toBeTruthy();
  });

  it('should be able to add stake', async () => {
    const tokenContract = Web3Initilizer.getTokenInstance();

    // adding first stake
    await stakerStore.addStake({ stakeValue: '15000', stakeDuration: 365 });
    expect(tokenContract.methods.allowance).toBeCalledWith(account, escrowContract._address);
    expect(tokenContract.methods.approve).toBeCalledWith(escrowContract._address, Web3.utils.toWei('15000'));
    expect(escrowContract.methods.deposit).toBeCalledWith('0x62DB5DE64644B4EcbB971f0CaCE5aB938951dAd9', Web3.utils.toWei('15000'), '365');
  });

  it('should be able to change/detach worker', async () => {
    const workerAddress = '0x25F764929A7D84d04Bb7C9C7AE9e7D6FBdE99C78';
    await stakerStore.changeWorker({ workerAddress });
    expect(escrowContract.methods.bondWorker).toBeCalledWith(workerAddress);
    expect(stakerStore.staker.worker).toBe(workerAddress);

    const zeroAddress = '0x0000000000000000000000000000000000000000';
    await stakerStore.detachWorker();
    expect(escrowContract.methods.bondWorker).toBeCalledWith(zeroAddress);
    expect(stakerStore.staker.worker).toBe(zeroAddress);
  });

  it('should be able to set wind down', async () => {
    await stakerStore.setWindDown(true);
    expect(escrowContract.methods.setWindDown).toBeCalledWith(true);
    expect(stakerStore.staker.windDown).toBe(true);

    await stakerStore.setWindDown(false);
    expect(escrowContract.methods.setWindDown).toBeCalledWith(false);
    expect(stakerStore.staker.windDown).toBe(false);
  });

  it('should be able to divide stake', async () => {
    const divideStakeIndex = 0;
    const subStakesBefore = stakerStore.staker.substakes;
    await stakerStore.divideStake(divideStakeIndex, Web3.utils.toWei('15000'), 365);
    const subStakesAfter = stakerStore.staker.substakes;

    expect(escrowContract.methods.divideStake).toBeCalledWith(divideStakeIndex, Web3.utils.toWei('15000'), 365);
    expect(subStakesAfter.length).toBe(subStakesBefore.length + 1);
    expect(subStakesAfter[0].value).toBe(BN(subStakesBefore[divideStakeIndex].value).minus(Web3.utils.toWei('15000')).toFixed());
    expect(subStakesAfter[subStakesAfter.length - 1].value).toBe(Web3.utils.toWei('15000'));
  });

  it('should be able to prolong stake', async () => {
    const prolongStakeIndex = 0;
    const extendDuration = 2;
    const beforeDuration = stakerStore.staker.substakes[prolongStakeIndex].remainingDuration;
    await stakerStore.prolongStake(prolongStakeIndex, extendDuration);
    const afterDuration = stakerStore.staker.substakes[prolongStakeIndex].remainingDuration;

    expect(escrowContract.methods.prolongStake).toBeCalledWith(prolongStakeIndex, extendDuration);
    expect(afterDuration).toBe(beforeDuration + extendDuration);
  });

  it('should be able to withdraw', async () => {
    await stakerStore.withdraw(Web3.utils.toWei('15000'));

    expect(escrowContract.methods.withdraw).toBeCalledWith(Web3.utils.toWei('15000'));
  });

});
