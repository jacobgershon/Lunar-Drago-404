// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import './ERC404/ERC404.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract LunarDrago404 is ERC404 {
  string public dataURI;
  string public baseTokenURI;

  constructor() ERC404('Lunar Drago 404', 'LD404', 18, 10000, msg.sender) {
    balanceOf[msg.sender] = 10000 * 10 ** 18;
    setWhitelist(msg.sender, true);
  }

  function setDataURI(string memory _dataURI) public onlyOwner {
    dataURI = _dataURI;
  }

  function setTokenURI(string memory _tokenURI) public onlyOwner {
    baseTokenURI = _tokenURI;
  }

  function setNameSymbol(string memory _name, string memory _symbol) public onlyOwner {
    _setNameSymbol(_name, _symbol);
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    if (bytes(baseTokenURI).length > 0) {
      return string.concat(baseTokenURI, Strings.toString(id));
    } else {
      uint8 seed = uint8(bytes1(keccak256(abi.encodePacked(id))));
      string memory image;
      string memory color;

      if (seed <= 102) {
        // ~40%
        image = 'https://i.ibb.co/VvmS1Qb/dragon6.png';
        color = 'Baby Dragon';
      } else if (seed <= 179) {
        // ~30%
        image = 'https://i.ibb.co/sRN7CRv/dragon5.png';
        color = 'Cute Dragon';
      } else if (seed <= 217) {
        // ~15%
        image = 'https://i.ibb.co/fxFMhYL/dragon7.png';
        color = 'Singer Dragon';
      } else if (seed <= 242) {
        // ~10%
        image = 'https://i.ibb.co/Pg9zc5d/dragon9.png';
        color = 'Jump Dragon';
      } else if (seed <= 255) {
        // ~5%
        image = 'https://i.ibb.co/84YTbJ9/dragon8.png';
        color = '2024 Dragon';
      }

      string memory jsonPreImage = string.concat(
        string.concat(
          string.concat('{"name": "Doge404 #', Strings.toString(id)),
          '","description":"A collection of 10,000 Replicants enabled by ERC404, an experimental token standard.","external_url":"","image":"'
        ),
        string.concat(dataURI, image)
      );
      string memory jsonPostImage = string.concat('","attributes":[{"trait_type":"Color","value":"', color);
      string memory jsonPostTraits = '"}]}';

      return
        string.concat(
          'data:application/json;utf8,',
          string.concat(string.concat(jsonPreImage, jsonPostImage), jsonPostTraits)
        );
    }
  }
}