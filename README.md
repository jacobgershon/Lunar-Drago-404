# KyberSwap DEX Aggregator

KyberSwap is a decentralized exchange (DEX) aggregator. We provide our traders with superior token prices by analyzing rates across thousands of exchanges instantly!

# Usage
The following assumes the use of `node@>=18` and `foundry`.

## Setup
Create a .env file following .env.example pattern:
  ```
  cp .env.example .env
  ```

## Install Dependencies
Install node dependencies:
```
yarn install
```
Install foundry libs:
```
forge install
```

## Compile Contracts

```
forge compile
```

## Test Contracts

```
forge test
```

Run a benchmark test:
```
FOUNDRY_PROFILE=gas_benchmark NETWORK=mainnet forge test --mc=BenchmarkKeepDust
```


## How to encode swapSequences
data: encode follow struct defined in ExecutorHelper.sol

- functionSelectors:

| Dex | ExecuteSwap function | functionSelector |
| --- | --- | --- |
| uni | executeUniswap(bytes,uint256) | 59361199
| univ3, elastic | executeUniV3KSElastic(bytes,uint256) | 63407a49
| classic | executeKSClassic(bytes,uint256) | a3722546
| rfq |  executeRfq(bytes,uint256) | ca6182da
| velodrome | executeVelodrome(bytes,uint256) | 55fad2fb
| camelot | executeCamelot(bytes,uint256) | 8df4a16b
| kyber lo |  executeKyberLimitOrder(bytes,uint256) | d6984a6d
| muteswitch |  executeMuteSwitchSwap(bytes,uint256) | 5c7c041e
| syncswap |  executeSyncSwap(bytes,uint256) | e756cac1
| maverick |  executeMaverick(bytes,uint256) | 27c0cd18

## Deployment using Hardhat
`yarn deploy --tags {deployment tag} [--network ...]`

## How to deploy on zkSync
- Update ZK_FLAGS env to 1 then use contracts folder, 0 to use contracts-zk folder
- Update FEE_SHARE env to get positive slippage token, and run
- yarn hardhat compile --network zkSync_mainnet
- yarn hardhat deployZkSync --network zkSync_mainnet


### How to deploy Meta aggregation
- For meta aggregation, just deploy new router `MetaAggregationRouter`, also whitelist 1inch router address.
=======
## Contract Architecture
`MetaAggregationRouterV2`: 

Contract for user to interact with. Responsible for do external call and ensure callee to do right behaviour.

`AggregationExecutor`: 

Main contract for handling aggregation logic.

`ExecutorHelpers`: 

Contracts for interacting with pool contracts and executing swap transactions.

## Deployment using Hardhat
```
yarn deploy --tags {deployment tag} [--network chainName ...]
```

Note: Get the `chainName` list from `hardhat.config.ts`: `config.networks`.

### How to deploy Meta aggregation
- For meta aggregation, just deploy new router `MetaAggregationRouter`, also whitelist 1inch router address.

    ```
    yarn deploy --tags router-l1 --network {chainName}
    yarn deploy --tags router-optimistic --network {chainName}
    ```

### How to deploy the AggregationExecutor and ExecutorHelpers
- For the ExecutorHelpers contracts:

    ```
    yarn deploy --tags helpers-l1 --network {chainName}
    yarn deploy --tags helpers-optimistic --network {chainName}
    ```

- For the main AggregationExecutor contract:

    ```
    yarn deploy --tags executor-l1 --network {chainName}
    yarn deploy --tags executor-optimistic --network {chainName}
    ```

  This script will auto whitelist the meta-router address, and update executeFunctions' selectors accordingly.

## Deployment using Foundry
set `PRIVATE_KEY` to `.env`

- `source .env`
- `forge script --private-key $PRIVATE_KEY --broadcast -vvvv <soldity script file>:<script contract> --rpc-url <rpc alias or url>`

For more information
  `forge script --help`

### Deploy MetaAggregationRouterV2 using Foundry
The addresses configs are set correspond to chainId, so just specify `--rpc-url` by using http url or using alias from `foundry.toml`.

Examples:
- `source .env`
- with verifying contract: `forge script --private-key $PRIVATE_KEY --broadcast -vvvv script/DeployRouterV2.sol:DeployRouterV2 --slow --rpc-url bsc_mainnet -g 110 --watch --verify --chain 56`

- without verifying contract: `forge script --private-key $PRIVATE_KEY --broadcast -vvvv script/DeployRouterV2.sol:DeployRouterV2 --slow --rpc-url bsc_mainnet -g 110`

- We can also verify with another verifier, ie `sourcify`, `blockscout` in case `etherscan` not supported: `forge script --private-key $PRIVATE_KEY --broadcast -vvvv script/DeployRouterV2.sol:DeployRouterV2 --slow --rpc-url bsc_mainnet -g 110 --watch --verify --chain 56 --verifier sourcify`

To whitelist external contracts:
- Set `ROUTER_ADDRESS` to `.env`
- Set external contract names `WHITELIST` to `.env` (names retrieved from `./configs/whitelist.json`), separated by `,`
- `source .env`
- `forge script --private-key $PRIVATE_KEY --broadcast -vvvv script/RouterV2.updateWhitelist.sol:RouterV2Whitelist --slow --rpc-url bsc_mainnet -g 100`

There are networks that we should use flag `--legacy` when it does not support EIP-1559.

Also, there are explorers that does not support Etherscan verifier. For this cases, we could `forge verify-contract` with `--verifier` other than `etherscan`.

## Audits
Following practices, only need audit and verify source for [`AggregationRouter`](https://github.com/1inch/1inch-v2-audits), `AggregationExecutor` don't need to be verified, can be changed depending on requirements