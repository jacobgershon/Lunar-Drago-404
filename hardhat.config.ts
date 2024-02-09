import {config as dotEnvConfig} from 'dotenv';

dotEnvConfig();
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-ethers';
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';
import '@matterlabs/hardhat-zksync-verify';

import './tasks';
import {ZkSyncConfig} from './hardhat-configs/interfaces';
import {path_configs} from './hardhat-configs/paths';
import {namedAccounts} from './hardhat-configs/named-accounts';
import {solidity_configs} from './hardhat-configs/solidity';
import {zksolc_configs} from './hardhat-configs/solidity.zksolc';
import {mainnets} from './hardhat-configs/network.mainnet';
import {testnets} from './hardhat-configs/network.testnet';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;

const config: HardhatUserConfig & ZkSyncConfig = {
  defaultNetwork: 'hardhat',
  zksolc: zksolc_configs,
  namedAccounts: namedAccounts,
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: solidity_configs,
  networks: {
    ...mainnets,
    ...testnets,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  paths: path_configs,
  mocha: {
    timeout: 200000,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
