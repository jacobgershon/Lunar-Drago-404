export const solidity_optimistic_configs = {
  compilers: [
    {
      version: '0.4.11',
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    },
    {
      version: '0.5.16',
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    },
    {
      version: '0.6.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    },
    {
      version: '0.7.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    },
    {
      version: '0.8.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
          details: {
            constantOptimizer: true,
            yul: false,
          },
        },
      },
    },
  ],
};
