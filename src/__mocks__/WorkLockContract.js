import Web3 from 'web3';

const workInfo = {
  depositedETH: Web3.utils.toWei('20')
};
const contract = {
  startBidDate: 1582387602,
  endBidDate: 1585000000,
  cancelationBidDate: 1585000000,
  methods: {
    bid: jest.fn((value) => {
      return {
        send: jest.fn(() => {
          return Promise.resolve(true);
        })
      };
    }),
    cancelBid: jest.fn((value) => {
      return {
        send: jest.fn(() => {
          return Promise.resolve(true);
        })
      };
    }),
    claim: jest.fn((value) => {
      return {
        send: jest.fn(() => {
          return Promise.resolve(true);
        })
      };
    }),
    refund: jest.fn((value) => {
      return {
        send: jest.fn(() => {
          return Promise.resolve(true);
        })
      };
    }),
    workInfo: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(workInfo);
        })
      };
    }),
    startBidDate: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(getStartBidDate());
        })
      };
    }),
    endBidDate: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(getEndBidDate());
        })
      };
    }),
    endCancellationDate: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(getCancelationBidDate());
        })
      };
    }),
    tokenSupply: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000000'));
        })
      };
    }),
    workToETH: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        })
      };
    }),
    ethToWork: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        })
      };
    }),
    getRemainingWork: jest.fn((value) => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        })
      };
    }),
    getAvailableRefund: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        })
      };
    }),
    ethToTokens: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('20000'));
        })
      };
    }),
    bonusETHSupply: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('200'));
        })
      };
    }),
    getBiddersLength: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(200);
        })
      };
    }),
    minAllowedBid: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(Web3.utils.toWei('0.04'));
        })
      };
    }),
    isClaimingAvailable: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve(false);
        })
      };
    }),
    compensation: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve('0');
        })
      };
    }),
    stakingPeriods: jest.fn(value => {
      return {
        call: jest.fn(() => {
          return Promise.resolve('30');
        })
      };
    })
  }
};

function getStartBidDate() {
  return contract.startBidDate;
}

function getEndBidDate() {
  return contract.endBidDate;
}

function getCancelationBidDate() {
  return contract.cancelationBidDate;
}

export default contract;
