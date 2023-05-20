// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    mapping(address => uint256) _balances;
    uint256 public _totalSupply;
    constructor(
        uint256 initalCoins,
        address _initialUser
    ) ERC20("AgroCoin", "AGRO"){
        _mint(_initialUser, initalCoins);
    }
}