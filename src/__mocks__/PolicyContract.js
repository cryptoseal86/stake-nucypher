let node = {
  reward: "7000",
  rewardRate: "0",
  lastMinedPeriod: "18310",
  minRewardRate: "0"
};

export default {
  methods: {
    withdraw: jest.fn(() => {
      return {
        send: () => {
          return Promise.resolve(true);
        }
      };
    }),
    nodes: jest.fn(() => {
      return {
        call: () => {
          return Promise.resolve(node);
        }
      };
    })
  },
  getPastEvents: jest.fn((value) => {
    return [{
      blockNumber: 12,
      returnValues: {

      }
    }];
  })
};
