import Web3Initilizer from '../web3Initializer';
import Web3 from 'web3';
jest.mock('web3', () => {
  return jest.fn().mockImplementation(function() {
    this.id = 5;
    return {
      eth: {
        net: {
          setId: (id) => this.id = id,
          getId: () => this.id
        },
        Contract: jest.fn()
      }
    };
  });
});

describe('web3Initializer', () => {

  let originalAlert;
  beforeEach(async () => {
    originalAlert = window.alert;
    window.alert = jest.fn();
    window.ethereum = {
      enable: jest.fn(),
      on: jest.fn()
    };
  });

  afterEach(() => {
    window.alert = originalAlert;
    jest.clearAllMocks();
  });

  it('should alert when metamask is not installed', async () => {
    window.ethereum = null;
    await Web3Initilizer.initialize();
    expect(window.alert).toBeCalledWith('Please install Metamask!');
  });

  it('should init on initialize', async () => {
    await Web3Initilizer.initialize();
    expect(window.ethereum.enable).toBeCalled();
    expect(window.ethereum.on).toBeCalledWith('accountsChanged', expect.any(Function));
  });

  it('should return instances', async () => {
    await Web3Initilizer.initialize();
    expect(Web3Initilizer.getWeb3()).not.toBeNull();
    expect(Web3Initilizer.getContractInstance()).not.toBeNull();
    expect(Web3Initilizer.getTokenInstance()).not.toBeNull();
    expect(Web3Initilizer.getPolicyContractInstance()).not.toBeNull();
    expect(Web3Initilizer.getWorkLockContractInstance()).not.toBeNull();
  });
});
