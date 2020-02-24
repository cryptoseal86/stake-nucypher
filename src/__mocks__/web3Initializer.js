import Web3 from 'web3';
import EscrowContract from './EscrowContract';
import TokenContract from './TokenContract';
import PolicyContract from './PolicyContract';
import WorkLockContract from './WorkLockContract';

class Web3Initilizer {

  static #web3 = null;
  static #contractInstance = null;
  static #tokenInstance = null;
  static #policyContract = null;
  static #workLockContract = null;

  static async initialize() {
    this.#web3 = {
      ...Web3,
      eth: {
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            resolve(['0x62DB5DE64644B4EcbB971f0CaCE5aB938951dAd9'])
          });
        }
      }
    };

    this.#contractInstance = EscrowContract;
    this.#tokenInstance = TokenContract;
    this.#policyContract = PolicyContract;
    this.#workLockContract = WorkLockContract;

    return true;
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
