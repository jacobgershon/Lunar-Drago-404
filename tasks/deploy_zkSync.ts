import {Deployer} from '@matterlabs/hardhat-zksync-deploy';
import {ZkSyncArtifact} from '@matterlabs/hardhat-zksync-deploy/dist/types';
import {Provider, Wallet} from 'zksync-web3';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import * as ethers from 'ethers';
import * as dotenv from 'dotenv';
import {readFileSync} from 'fs';
import {task} from 'hardhat/config';

import {supportedPools, IPoolInfo, IPools} from '../deploy/l1/helpers/poolMapping';
import {supportedCallbacks, ICallbackInfo, ICallbacks} from '../deploy/l1/helpers/callbackMapping';

dotenv.config();

let WETHAddr: any;
let CallbackHelperAddr: any;
let MetaAggregationRouterV2: ZkSyncArtifact;
let AggregationExecutor: ZkSyncArtifact;
let CallbackHelper: ZkSyncArtifact;
let ExecutorHelper1: ZkSyncArtifact;
let ExecutorHelper2: ZkSyncArtifact;
let ExecutorHelper3: ZkSyncArtifact;
let ExecutorHelper4: ZkSyncArtifact;
let KyberFormula: ZkSyncArtifact;
let deployer: Deployer;
let wallet;
let configZkSync: {
  WETH: any;
  ExecutorHelper1: any;
  ExecutorHelper2: any;
  ExecutorHelper3: any;
  ExecutorHelper4: any;
  CallbackHelper: string;
  MetaAggregationRouterV2: string;
  Admin: any;
  AggregationExecutor: string;
};
let feeS: string | undefined;
let linkProv;
let provider: Provider | undefined;

const loadConfig = async (hre: HardhatRuntimeEnvironment) => {
  configZkSync = JSON.parse(readFileSync('configs/zkSync.json', 'utf-8'));
  wallet = new Wallet(process.env.PRIVATE_KEY as string);
  deployer = new Deployer(hre, wallet);
  WETHAddr = configZkSync.WETH;
  CallbackHelperAddr = configZkSync.CallbackHelper;
  // load artifact
  KyberFormula = await deployer.loadArtifact('KyberFormula');
  MetaAggregationRouterV2 = await deployer.loadArtifact('MetaAggregationRouterV2');
  AggregationExecutor = await deployer.loadArtifact('AggregationExecutor');
  CallbackHelper = await deployer.loadArtifact('CallbackHelper');
  ExecutorHelper1 = await deployer.loadArtifact('ExecutorHelper1');
  ExecutorHelper2 = await deployer.loadArtifact('ExecutorHelper2');
  ExecutorHelper3 = await deployer.loadArtifact('ExecutorHelper3');
  ExecutorHelper4 = await deployer.loadArtifact('ExecutorHelper4');
  feeS = process.env?.FEE_SHARING_ADDRESS;
  linkProv = process.env?.ZK_FLAGS == '0' ? process.env?.ZKSYNC_NODE_URL : process.env?.ZKSYNC_TESTNET_NODE_URL;
  provider = new Provider(linkProv);
};

const loadRouter = async (hre: HardhatRuntimeEnvironment, scAddr: string, wallet: Wallet) => {
  const MetaAggregationRouterV2 = await hre.artifacts.readArtifactSync('MetaAggregationRouterV2');
  return new ethers.Contract(scAddr, MetaAggregationRouterV2.abi, wallet);
};

const loadExe = async (hre: HardhatRuntimeEnvironment, scAddr: string, wallet: Wallet) => {
  const AggregationExecutor = await hre.artifacts.readArtifactSync('AggregationExecutor');
  return new ethers.Contract(scAddr, AggregationExecutor.abi, wallet);
};

const getFunctionSelectors = () => {
  let selectorFuncs: (string | undefined)[] = [];
  let helperAddresses: any[] = [];

  let poolInfos: IPools = {};

  Object.entries(supportedPools).map(([poolName, poolInfo]) => {
    let newDexInfo: IPoolInfo = {
      function: poolInfo.function,
      functionSelector: ethers.utils.id(poolInfo.function).substring(0, 10),
      executorHelperNumber: poolInfo.executorHelperNumber,
    };
    poolInfos[poolName] = newDexInfo;
  });

  (Object.keys(poolInfos) as (keyof typeof poolInfos)[]).forEach((key, index) => {
    selectorFuncs.push(poolInfos[key].functionSelector);
    if (poolInfos[key].executorHelperNumber == 1) {
      helperAddresses.push(configZkSync.ExecutorHelper1);
    } else if (poolInfos[key].executorHelperNumber == 2) {
      helperAddresses.push(configZkSync.ExecutorHelper2);
    } else if (poolInfos[key].executorHelperNumber == 3) {
      helperAddresses.push(configZkSync.ExecutorHelper3);
    } else {
      helperAddresses.push(configZkSync.ExecutorHelper4);
    }
  });
  return [selectorFuncs, helperAddresses];
};

const getCallbackSelectors = () => {
  let selectorFuncs: (string | undefined)[] = [];
  let callbackHelperAddresses: string[] = [];

  let callbackInfos: ICallbacks = {};

  Object.entries(supportedCallbacks).map(([callbackName, callbackInfo]) => {
    let newCallbackInfo: ICallbackInfo = {
      function: callbackInfo.function,
      functionSelector: ethers.utils.id(callbackInfo.function).substring(0, 10),
      callbackHelperNumber: callbackInfo.callbackHelperNumber,
    };
    callbackInfos[callbackName] = newCallbackInfo;
  });

  console.log(CallbackHelperAddr);

  (Object.keys(callbackInfos) as (keyof typeof callbackInfos)[]).forEach((key, index) => {
    selectorFuncs.push(callbackInfos[key].functionSelector);
    if (callbackInfos[key].callbackHelperNumber == 0) {
      callbackHelperAddresses.push(CallbackHelperAddr);
    } else {
      callbackHelperAddresses.push('0x0000000000000000000000000000000000000000');
    }
  });
  return [selectorFuncs, callbackHelperAddresses];
};

// ==================== script task =====================

task('deployZkSync', 'deploy zkSync contract').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);
  let fml = await deployer.deploy(KyberFormula, []);
  let sc = await deployer.deploy(MetaAggregationRouterV2, [WETHAddr]);
  let ex = await deployer.deploy(AggregationExecutor, [WETHAddr, feeS]);
  let callbackHp = await deployer.deploy(CallbackHelper, []);
  let hp1 = await deployer.deploy(ExecutorHelper1, [fml.address, WETHAddr]);
  let hp2 = await deployer.deploy(ExecutorHelper2, [WETHAddr]);
  let hp3 = await deployer.deploy(ExecutorHelper3, [WETHAddr]);
  let hp4 = await deployer.deploy(ExecutorHelper4, [WETHAddr]);

  console.log(`KyberFormula was deployed at ${fml.address}`);
  console.log(`MetaAggregationRouterV2 was deployed at ${sc.address}`);
  console.log(`AggregationExecutor was deployed at ${ex.address}`);
  console.log(`CallbackHelper was deployed at ${callbackHp.address}`);
  console.log(`ExecutorHelper1 was deployed at ${hp1.address}`);
  console.log(`ExecutorHelper2 was deployed at ${hp2.address}`);
  console.log(`ExecutorHelper3 was deployed at ${hp3.address}`);
  console.log(`ExecutorHelper4 was deployed at ${hp4.address}`);
});

task('transferRouterOwnership', '').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
  const rt = await loadRouter(hre, configZkSync.MetaAggregationRouterV2, wallet);
  const tx = await rt.transferOwnership(configZkSync.Admin);
  console.log('Tx hash at: ', tx.hash);
});

task('transferExecutorOwnership', '').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
  const ex = await loadExe(hre, configZkSync.AggregationExecutor, wallet);
  const tx = await ex.transferOwnership(configZkSync.Admin);
  console.log('Tx hash at: ', tx.hash);
});

task('updateBatchExecutors', '').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);

  const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
  const ex = await loadExe(hre, configZkSync.AggregationExecutor, wallet);
  let selectorFuncs;
  let helperAddresses;
  [selectorFuncs, helperAddresses] = getFunctionSelectors();
  console.log('selectorFuncs :>> ', selectorFuncs);
  console.log('helperAddresses :>> ', helperAddresses);

  const tx = await ex.updateBatchExecutors(selectorFuncs, helperAddresses);
  console.log('Tx hash at: ', tx.hash);
});

task('updateBatchCallbacks', '').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
  const ex = await loadExe(hre, configZkSync.AggregationExecutor, wallet);
  let selectorFuncs;
  let callbackHelperAddresses;
  [selectorFuncs, callbackHelperAddresses] = getCallbackSelectors();
  console.log('selectorFuncs :>> ', selectorFuncs);
  console.log('callbackHelperAddresses :>> ', callbackHelperAddresses);
  const tx = await ex.updateBatchCallbacks(selectorFuncs, callbackHelperAddresses);
  console.log('Tx hash at: ', tx.hash);
});

task('updateWhitelist', '').setAction(async (taskArgs: any, hre: any) => {
  await loadConfig(hre);
  const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
  const ex = await loadExe(hre, configZkSync.AggregationExecutor, wallet);
  const tx = await ex.updateWhitelist([configZkSync.MetaAggregationRouterV2], ['true']);
  console.log('Tx hash at: ', tx.hash);
});
