import BN from 'bignumber.js';

let allowance = {};

export default {
  methods: {
    allowance: jest.fn((account, spender) => {
      return {
        call: () => {
          return !allowance[spender] ? '0' : allowance[spender];
        }
      }
    }),
    approve: jest.fn((spender, value) => {
      return {
        send: () => {
          if (!allowance[spender]) {
            allowance[spender] = value;
          } else {
            throw new Error('already approved');
          }
        }
      }
    }),
    increaseAllowance: jest.fn((spender, value) => {
      return {
        send: () => {
          if (!allowance[spender]) {
            throw new Error('not approved');
          } else {
            allowance[spender] = BN(allowance[spender]).plus(value).toFixed();
          }
        }
      };
    }),
    decreaseAllowance: jest.fn((spender, value) => {
      return {
        send: () => {
          if (!allowance[spender]) {
            throw new Error('not approved');
          } else {
            allowance[spender] = BN(allowance[spender]).minus(value).toFixed();
          }
        }
      };
    }),
  }
};
