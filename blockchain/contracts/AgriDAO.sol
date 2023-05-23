// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Token.sol";
import "./Request.sol";

contract AgroDAO {
    Token private immutable agriToken;
    APIConsumer private immutable chainC;
    uint256 private constant INITIAL_TOKEN_AMOUNT = 10000000;
    address private immutable maintainer;
    uint256 private constant INITIAL_USER_AMOUNT = 1000;
    address public agriTokenAddress;
    address public chainLinkAddress;

    receive() external payable {}

    constructor () payable{
        agriToken = new Token(INITIAL_TOKEN_AMOUNT, address(this));
        maintainer = msg.sender;
        chainC = new APIConsumer();
        // mint the tokens first
        agriTokenAddress = address(agriToken);
        chainLinkAddress = address(chainC);
        // Transfer tokens to the smart contract // already done

        // Transfer INITIAL_USER_AMOUNT tokens to msg.sender from the smart contract

        //agriToken.transfer(msg.sender, INITIAL_TOKEN_AMOUNT);
    }

struct proposal {
        string description;
        address owner;
        bool isExecuted;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        address[] voters;
    }

    proposal[] proposals;

    function createProposal(string memory _description, uint256 _duration)
        public
    {
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _duration;

        proposal memory newProposal;
        newProposal.description = _description;
        newProposal.owner = msg.sender;
        newProposal.isExecuted = false;
        newProposal.startTime = startTime;
        newProposal.endTime = endTime;
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;

        proposals.push(newProposal);
    }

    function getVotingResults(uint256 _proposalIndex)
        public
        view
        returns (uint256 votesFor, uint256 votesAgainst)
    {
        require(_proposalIndex < proposals.length, "Invalid proposal index");

        votesFor = proposals[_proposalIndex].votesFor;
        votesAgainst = proposals[_proposalIndex].votesAgainst;
    }

    function castVote(uint256 _proposalIndex, bool _isVoteFor) public {
        require(_proposalIndex < proposals.length, "Invalid proposal index");
        require(
            !proposals[_proposalIndex].isExecuted,
            "Proposal has already been executed"
        );
        require(
            block.timestamp >= proposals[_proposalIndex].startTime,
            "Voting has not started yet"
        );
        require(
            block.timestamp <= proposals[_proposalIndex].endTime,
            "Voting has ended"
        );

        proposal storage selectedProposal = proposals[_proposalIndex];

        // Check if the user has already voted
        for (uint256 i = 0; i < selectedProposal.voters.length; i++) {
            require(
                selectedProposal.voters[i] != msg.sender,
                "You have already voted"
            );
        }
        uint256 votingPower = getUserBalance(msg.sender);

        if (_isVoteFor) {
            selectedProposal.votesFor = selectedProposal.votesFor + votingPower;
        } else {
            selectedProposal.votesAgainst =
                selectedProposal.votesAgainst +
                votingPower;
        }

        // Add the user to the voters list
        selectedProposal.voters.push(msg.sender);
    }


    function contractTokenBalance() public view returns (uint256) {
        return agriToken.balanceOf(address(this));
    }

    function getTokenAddress() public view returns(address){
        return agriTokenAddress;
    }

    function getChainlinkAPIAddress() public view returns(address){
        return chainLinkAddress;
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

    function getUserBalance(address user) public view returns (uint256) {
        return agriToken.balanceOf(user);
    }

    function joinDAO(
        address payable user // more details can be added
    ) public payable{
        // check if membership already exists, if not append in mapping
        require(members[user].farmerAddress==address(0),"Already part of the DAO");
        require(msg.value == 0.01 ether, "Please send exactly 0.01 ETH");

        members[user] = Farmers(user);
        // give DAO tokens to joining members
        agriToken.transfer(msg.sender, INITIAL_USER_AMOUNT);


        payable(address(this)).transfer(msg.value);
        DAOBalance+=msg.value;
    }

    // TODO: Find ways to fund the DAO
    function fundDAO(address payable user) public payable{
        // check if the person is a member of the DAO 
        require(members[user].farmerAddress==address(0),"Please join the DAO before funding !!");
        require(msg.value>0,"Enter an amount greater than 0");

        payable(address(this)).transfer(msg.value);
        DAOBalance+=msg.value;
    }

    uint256 public tempChainlink;

    function requestLoanChainlink() public returns (bool){

        chainC.requestVolumeData();
        tempChainlink = chainC.viewTemperature();

        if(tempChainlink > 40 * 1000000000000000000){
            return true;
        }
        // 19000000000000000000
        // 40000000000000000000

        return false;
    }
}
