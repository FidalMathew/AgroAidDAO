// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        uint256 initalCoins,
        address _initialUser
    ) ERC20("AgroCoin", "AGRO") {
        _mint(_initialUser, initalCoins);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}
