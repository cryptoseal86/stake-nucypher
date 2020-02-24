import Web3 from 'web3';
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
      if (window.ethereum) {
        await window.ethereum.enable();
        this.#web3 = new Web3(window.ethereum);
        if ((await this.#web3.eth.net.getId()) === 5) {
          this.#contractInstance = new this.#web3.eth.Contract(StakingEscrow, config.stakingEscrowAddress);
          this.#tokenInstance = new this.#web3.eth.Contract(NuCypherToken, config.tokenAddress);
          this.#policyContract = new this.#web3.eth.Contract(PolicyManager, config.policyManagerAddress);
          this.#workLockContract = new this.#web3.eth.Contract(WorkLock, config.workLockAddress);

          window.ethereum.on('accountsChanged', (accounts) => {
            window.location.reload();
          });

          return true;
        } else {
          alert('Only goerli etherium network is supported by the moment');
        }
      } else {
        alert('Please install Metamask!');
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
