import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { NuCypherToken, StakingEscrow, PolicyManager, WorkLock } from './contract-registry.js'
import config from './config.json';

class Web3Initilizer {

  static #web3 = null;
  static #contractInstance = null;
  static #tokenInstance = null;
  static #policyContract = null;
  static #workLockContract = null;

  static async initialize() {
    if (!this.#web3) {
      const providerOptions = {
      };
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
      });

      const provider = await web3Modal.connect();
      provider.on('accountsChanged', (accounts) => {
        window.location.reload();
      });

      provider.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      this.#web3 = new Web3(provider);

      let networkConfig = null;
      if ((await this.#web3.eth.net.getId()) === 1) { // mainnet
        networkConfig = config.mainnet;
      } else if ((await this.#web3.eth.net.getId()) === 4) { // ibex
        networkConfig = config.ibex;
      }

      if (networkConfig) {
        this.#contractInstance = new this.#web3.eth.Contract(StakingEscrow, networkConfig.stakingEscrowAddress);
        this.#tokenInstance = new this.#web3.eth.Contract(NuCypherToken, networkConfig.tokenAddress);
        this.#policyContract = new this.#web3.eth.Contract(PolicyManager, networkConfig.policyManagerAddress);
        this.#workLockContract = new this.#web3.eth.Contract(WorkLock, networkConfig.workLockAddress);

        return true;
      } else {
        alert('Network is not supported');
        return false;
      }
    }
  }

  static getWeb3() {
    return this.#web3;
  }

  static getContractInstance() {
    return this.#contractInstance;
  }

  static getTokenInstance() {
    return this.#tokenInstance;
  }

  static getPolicyContractInstance() {
    return this.#policyContract;
  }

  static getWorkLockContractInstance() {
    return this.#workLockContract;
  }
}

export default Web3Initilizer;
