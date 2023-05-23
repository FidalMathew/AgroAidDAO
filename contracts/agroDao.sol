// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Token.sol";

contract AgroDAO {
    Token private immutable agriToken;
    uint256 private constant INITIAL_TOKEN_AMOUNT = 10000000;
    address private immutable maintainer;
    uint256 private constant INITIAL_USER_AMOUNT = 1000;
    receive() external payable {}

    constructor () payable{
        agriToken = new Token(
            INITIAL_TOKEN_AMOUNT,
            address(this)
        );
        maintainer = msg.sender;

        // mint the tokens first

        
        // Transfer tokens to the smart contract // already done

        // Transfer INITIAL_USER_AMOUNT tokens to msg.sender from the smart contract


        //agriToken.transfer(msg.sender, INITIAL_TOKEN_AMOUNT);
    }

    function get_agriTokenBalance() public view returns (uint256) {
        return agriToken.balanceOf(address(this));

    }

    // common dao pool amount (? will the member joining the dao pays for it)
    uint256 public DAOBalance = 0;

    function getDAOBalance() public view returns (uint256) {
        return DAOBalance;
    }

    // make a farmers details struct and map it
    struct Farmers {
        address farmerAddress;
        // more details can be added
    }

    // join the dao
    mapping(address => Farmers) private members;

    function joinDAO(
        address user // more details can be added
    ) public {
        // check if membership already exists, if not append in mapping
        //require(members[user].farmerAddress != address(0), "Already exist");

        members[user] = Farmers(user);
        // give DAO tokens to joining members
        agriToken.transfer(msg.sender, INITIAL_USER_AMOUNT);
    }

    // TODO: Find ways to fund the DAO

    function fundDAO(address payable user) public payable{
        // check if the person is a member of the DAO 

        require(members[user].farmerAddress!=address(0),"Please join the DAO before funding !!");
        require(msg.value>0,"Enter an amount greater than 0");

        payable(address(this)).transfer(msg.value);
        DAOBalance+=msg.value;
       
    }
      
    

    // create proposals asking for certain eth

    // proposal will be accepted in two ways:
    // 1. check eligibility using chainlink api
    // 2. voting from all the members

    // vote for the proposals for all the members except the one asking for it

    // execute the proposal
}