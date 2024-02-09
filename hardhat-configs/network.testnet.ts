const MNEMONIC = process.env.MNEMONIC as string;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY as string;
let accounts;

if (PRIVATE_KEY != '') {
  accounts = [PRIVATE_KEY];
} else {
  accounts = {
    mnemonic: MNEMONIC ?? 'test test test test test test test test test test test junk',
  };
}

export const testnets = {
  hardhat: {
    tags: process.env.DEFAULT_TAG ? process.env.DEFAULT_TAG.split(',') : ['local'],
    live: false,
    saveDeployments: false,
    allowUnlimitedContractSize: true,
    chainId: 1,
    accounts: {
      mnemonic: process.env.MNEMONIC ?? 'test test test test test test test test test test test junk',
    },
  },
  ethereum_goerli: {
    url: process.env?.ETH_GOERLI_NODE_URL,
    accounts,
    timeout: 20000,
    blockGasLimit: 30000000,
  },
  zkSync_testnet: {
    url: process.env?.ZKSYNC_TESTNET_NODE_URL,
    ethNetwork: process.env?.ETH_GOERLI_NODE_URL,
    zksync: true,
    verifyURL: process.env?.ZKSYNC_TESTNET_SCAN_API,
  },
};
