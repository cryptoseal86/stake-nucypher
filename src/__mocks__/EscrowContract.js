import TokenContract from './TokenContract';
import BN from 'bignumber.js';
import Web3 from 'web3';

const staker = {
  value: "179272623458863595894258",
  confirmedPeriod1: "18309",
  confirmedPeriod2: "18308",
  lockReStakeUntilPeriod: "0",
  worker: "0x62DB5DE64644B4EcbB971f0CaCE5aB938951dAd9",
  workerStartPeriod: "18305",
  lastActivePeriod: "0",
  completedWork: "0",
  reservedSlot2: "0",
  reservedSlot3: "0",
  reservedSlot4: "0",
};
const subStakes = [{
  firstPeriod: "18285",
  lastPeriod: "0",
  periods: "365",
  lockedValue: "64369154825672790088479",
}];
const flags = {
  windDown: true,
  reStake: false
};
const contractAddress = '0x522910eA010a8cd51C8E8C7cd5821e100dd2385D';
const fakeEvent = {
  value: Web3.utils.toWei('20'),
  worker: '0xb1d0429B20B2A6Daca884e0892Dfb87A6E519332'
};

export default {
  _address: contractAddress,
  methods: {
    minAllowableLockedTokens: () => {
      return {
        call: () => {
          return Promise.resolve('10000');
        }
      };
    },
    maxAllowableLockedTokens: () => {
      return {
        call: () => {
          return Promise.resolve('1000000');
        }
      };
    },
    minWorkerPeriods: () => {
      return {
        call: () => {
          return Promise.resolve('30');
        }
      };
    },
    MAX_SUB_STAKES: () => {
      return {
        call: () => {
          return Promise.resolve('20');
        }
      };
    },
    getCurrentPeriod: () => {
      return {
        call: () => {
          return Promise.resolve('18945');
        }
      };
    },
    stakerInfo: () => {
      return {
        call: () => {
          return Promise.resolve(staker);
        }
      };
    },
    getLockedTokens: () => {
      return {
        call: () => {
          return Promise.resolve('10000');
        }
      };
    },
    getSubStakesLength: () => {
      return {
        call: () => {
          return Promise.resolve(subStakes.length);
        }
      };
    },
    getSubStakeInfo: (account, index) => {
      return {
        call: () => {
          return Promise.resolve(subStakes[index]);
        }
      };
    },
    getLastCommittedPeriod: () => {
      return {
        call: () => {
          return Promise.resolve('0');
        }
      };
    },
    setReStake: jest.fn((value) => {
      return {
        send: () => {
          return Promise.resolve(!value);
        }
      };
    }),
    deposit: jest.fn((value) => {
      return {
        send: () => {
          return new Promise((resolve, reject) => {
            TokenContract.methods.decreaseAllowance(contractAddress, value)
            subStakes.push({
              firstPeriod: "18285",
              lastPeriod: "0",
              periods: "365",
              lockedValue: "64369154825672790088479",
            });
            resolve(true);
          });
        }
      };
    }),
    bondWorker: jest.fn((value) => {
      return {
        send: () => {
          return Promise.resolve(true);
        }
      };
    }),
    setWindDown: jest.fn((value) => {
      return {
        send: () => {
          return Promise.resolve(true);
        }
      };
    }),
    divideStake: jest.fn((index, newValue, newDuration) => {
      return {
        send: () => {
          return new Promise((resolve, reject) => {
            subStakes.push(
              {
                firstPeriod: "18285",
                lastPeriod: "0",
                periods: (+subStakes[index].periods) + (+newDuration),
                lockedValue: newValue,
              }
            );
            subStakes[index].lockedValue = BN(subStakes[index].lockedValue).minus(newValue).toFixed()
            resolve(true);
          });
        }
      };
    }),
    prolongStake: jest.fn((index, extendDuration) => {
      return {
        send: () => {
          return new Promise((resolve, reject) => {
            subStakes[index].periods = (+subStakes[index].periods) + (+extendDuration);
            resolve(true);
          });
        }
      };
    }),
    withdraw: jest.fn((value) => {
      return {
        send: () => {
          return Promise.resolve(true);
        }
      };
    }),
    getWorkerFromStaker: jest.fn((value) => {
      return {
        call: () => {
          return Promise.resolve(staker.worker);
        }
      };
    }),
    getCompletedWork: jest.fn((value) => {
      return {
        call: () => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        }
      };
    }),
    getFlags: jest.fn((value) => {
      return {
        call: () => {
          return Promise.resolve(flags);
        }
      };
    }),
  },
  getPastEvents: jest.fn((value) => {
    return new Promise((resolve, reject) => {
      resolve([{
        blockNumber: 12,
        returnValues: {
          ...fakeEvent
        }
      }]);
    });
  }),
};
