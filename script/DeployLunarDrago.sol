// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Script.sol';
import {LunarDrago} from "src/LunarDrago.sol";

contract DeployLD404 is Script {

  function run() external {
    vm.startBroadcast();

    new LunarDrago();

    vm.stopBroadcast();
  }
}


// forge script script/DeployLunarDrago.sol:DeployLD404 --rpc-url=bsc_mainnet --broadcast --private-key=${PRIVATE_KEY} --verify --etherscan-api-key=${BSC_SCAN_API_KEY}

// 0x16972Fb608f9797b4B3c342bea0285259a5233Cd