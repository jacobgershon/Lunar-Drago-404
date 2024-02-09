import {ZkSolcConfig} from '@matterlabs/hardhat-zksync-solc/dist/src/types';

export const zksolc_configs: Partial<ZkSolcConfig> & {version: string; compilerSource: string; settings: {}} = {
  version: '1.3.17',
  compilerSource: 'binary',
  settings: {},
};
