//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {ERC20Capped} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract LunarDrago is ERC20, ERC20Capped {
  constructor() ERC20Capped(10000 * 10 ** 18) ERC20('Lunar Drago 404', 'LD404') {
    _mint(msg.sender, 10000*10**18);
  }

  /**
   * @dev See {ERC20-_mint}.
   */
  function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Capped) {
    require(ERC20.totalSupply() + amount <= cap(), 'ERC20Capped: cap exceeded');
    super._mint(account, amount);
  }
}
