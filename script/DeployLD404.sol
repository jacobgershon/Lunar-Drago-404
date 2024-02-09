// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Script.sol';
import {LunarDrago404} from "src/LunarDrago404.sol";

contract DeployLD404 is Script {

  function run() external {
    vm.startBroadcast();

    new LunarDrago404();

    vm.stopBroadcast();
  }
}

// forge script script/DeployLD404.sol:DeployLD404 --rpc-url=bsc_mainnet --broadcast --private-key=${PRIVATE_KEY} --verify --etherscan-api-key=${BSC_SCAN_API_KEY}

// 