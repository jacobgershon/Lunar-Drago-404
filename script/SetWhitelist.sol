// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Script.sol';
import {ERC404} from "src/ERC404/ERC404.sol";

contract SetWhitelist is Script {

  function run() external {
    vm.startBroadcast();

    ERC404 doge = ERC404(0xeca26C7deD618D893f40017907fC3B20233BD0D9); // DOGE404

    // doge.setWhitelist(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, true);  // UniswapRouter
    doge.setWhitelist(0xf081470f5C6FBCCF48cC4e5B82Dd926409DcdD67, true);  // Kyber Executor
    doge.setWhitelist(0x6131B5fae19EA4f9D964eAc0408E4408b66337b5, true);  // Kyber Router

    vm.stopBroadcast();
  }
}


// forge script script/SetWhitelistDoge.sol:SetWhitelist --rpc-url=polygon_mainnet --broadcast --private-key=${PRIVATE_KEY} --legacy