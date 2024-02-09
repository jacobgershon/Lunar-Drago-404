import {NetworksUserConfig} from 'hardhat/types';

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

export const mainnets: NetworksUserConfig = {
  mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.ETH_NODE_URL,
  },
  bsc_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.BSC_NODE_URL,
  },
  polygon_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.POLYGON_NODE_URL,
  },
  avalanche_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.AVAX_NODE_URL,
  },
  avalanche_fuji: {
    tags: ['dev'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.AVAX_FUJI_NODE_URL,
  },
  fantom_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.FTM_NODE_URL,
  },
  cronos_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.CRONOS_NODE_URL,
  },
  aurora_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.AURORA_NODE_URL,
  },
  arbitrum_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.ARBITRUM_NODE_URL,
  },
  optimism_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.OP_NODE_URL,
  },
  velas_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.VELAS_NODE_URL,
  },
  oasis_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.OASIS_NODE_URL,
  },
  bttc_mainnet: {
    tags: ['production'],
    live: true,
    saveDeployments: true,
    accounts,
    loggingEnabled: true,
    url: process.env?.BTTC_NODE_URL,
  },
  linea_mainnet: {
    url: process.env?.LINEA_NODE_URL,
    accounts,
    timeout: 20000,
    blockGasLimit: 30000000,
  },
  polygon_zkevm_mainnet: {
    url: process.env?.POLYGON_ZKEVM_NODE_URL,
    accounts,
    timeout: 20000,
    blockGasLimit: 30000000,
  },
  zkSync_mainnet: {
    url: process.env?.ZKSYNC_NODE_URL,
    ethNetwork: process.env?.ETH_NODE_URL,
    zksync: true,
    verifyURL: process.env?.ZKSYNC_SCAN_API,
  },
  base_mainnet: {
    url: process.env?.BASE_NODE_URL,
    accounts,
    timeout: 20000,
    blockGasLimit: 30000000,
  },
  scroll_mainnet: {
    url: process.env?.SCROLL_NODE_URL,
    accounts,
    timeout: 20000,
    blockGasLimit: 30000000,
  },
};
