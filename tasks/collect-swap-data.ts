import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';
import {dirname} from 'path';

import {ISwapTx} from './interface';

task('collect-swap-data', 'Crawl swap transactions on production', async function (_taskArgs, hre) {
  let metaRouterAddresses = JSON.parse(readFileSync('configs/ks-meta-router.json', 'utf-8'));
  const chainId = await hre.getChainId();
  const metaRouterAddress = metaRouterAddresses[chainId];
  const provider = new hre.ethers.providers.JsonRpcProvider((hre.network.config as any).url);

  const currentBlock = await provider.getBlockNumber();

  const blockRange = hre.network.name != 'oasis_mainnet' ? 2000 : 100;

  let rawTxLogs = await provider.getLogs({
    address: metaRouterAddress,
    topics: ['0xddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48'],
    fromBlock: currentBlock - blockRange,
    toBlock: currentBlock,
  });

  rawTxLogs = rawTxLogs.slice(rawTxLogs.length - 100);
  const swapTxs = new Array<ISwapTx>();
  const promises = [];

  for (let i in rawTxLogs) {
    promises.push(provider.getTransaction(rawTxLogs[i].transactionHash));
  }

  const swapTxResults = await Promise.all(promises);

  for (let i in rawTxLogs) {
    const tx = swapTxResults[i];
    const swapTx: ISwapTx = {
      txHash: tx.hash,
      blockNumber: tx.blockNumber as number,
      data: tx.data,
      value: tx.value.toString(),
      sender: tx.from,
    };
    swapTxs.push(swapTx);
  }

  const filePath = `benchmarks/onchain-data/${chainId}.json`;

  // Create the directory if it doesn't exist
  const directory = dirname(filePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, {recursive: true});
  }

  writeFileSync(filePath, JSON.stringify(swapTxs, null, 2) + '\n');
});
