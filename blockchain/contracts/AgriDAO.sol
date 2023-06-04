// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "./Token.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

// import "./ChainRequest.sol";

contract AgroDAO {
    Token private immutable agriToken;
    // APIConsumer private immutable chainC;
    uint256 private constant INITIAL_TOKEN_AMOUNT = 1000000000;
    address private immutable maintainer;
    uint256 private constant INITIAL_USER_AMOUNT = 1000;
    uint256 private constant LOAN_TIME = 20 seconds;
    address public agriTokenAddress;

    // address public chainLinkAddress;
    receive() external payable {}

    // make a farmers details struct and map it
    struct Farmer {
        address farmerAddress;
        // more details can be added
        uint256 loan;
        string longitude;
        string latitude;
        uint256 reputation;
        string name;
        uint256 timestamp;
    }

    // join the dao
    mapping(address => Farmer) public members;
    mapping(string => string[]) public plantDataSet;
    address[] public daoMembers;

    function getMemberAddresses() public view returns (address[] memory) {
        return daoMembers;
    }

    constructor() payable {
        agriToken = new Token(INITIAL_TOKEN_AMOUNT, address(this));
        maintainer = msg.sender;

        agriTokenAddress = address(agriToken);
    }

    function contractTokenBalance() public view returns (uint256) {
        return agriToken.balanceOf(address(this));
    }

    function getTokenAddress() public view returns (address) {
        return agriTokenAddress;
    }

    // common dao pool amount (? will the member joining the dao pays for it)
    uint256 public DAOBalance = 0;

    function getDAOBalance() public view returns (uint256) {
        return DAOBalance;
    }

    function getUserBalance(address user) public view returns (uint256) {
        return agriToken.balanceOf(user);
    }

    function joinDAO(
        string memory _longitude,
        string memory _latitude,
        string memory name
    ) public payable {
        // check if membership already exists, if not append in mapping
        address user = payable(msg.sender);
        require(
            members[user].farmerAddress == address(0),
            "Already part of the DAO"
        );

        require(msg.value >= 0.01 ether, "Please send exactly 0.01 ETH");

        members[user] = Farmer(
            user,
            0,
            _longitude,
            _latitude,
            0,
            name,
            block.timestamp
        );
        daoMembers.push(msg.sender);

        payable(address(this)).transfer(msg.value);
        DAOBalance += msg.value;
        // give DAO tokens to joining members
        agriToken.transfer(msg.sender, INITIAL_USER_AMOUNT);
    }

    // transfer token on funding the dao
    // transfer token to funder
    function transfer(
        address receiver,
        uint256 numTokens
    ) public returns (bool) {
        uint256 contractCurrTokenBalance = contractTokenBalance();
        require(
            numTokens <= contractCurrTokenBalance,
            "Insufficient number of tokens"
        );
        agriToken.transfer(receiver, numTokens);
        return true;
    }

    // TODO: Find ways to fund the DAO
    function fundDAO() public payable {
        // check if the person is a member of the DAO
        address user = payable(msg.sender);
        require(
            members[user].farmerAddress != address(0),
            "Please join the DAO before funding !!"
        );
        require(msg.value > 0, "Enter an amount greater than 0");

        payable(address(this)).transfer(msg.value);
        DAOBalance += msg.value;
        uint256 tokenSent = msg.value / 10000000000000;
        transfer(msg.sender, tokenSent);

        // increase the reputatation of the farmer after funding to dao
        members[msg.sender].reputation++;
    }

    struct proposal {
        string description;
        address owner;
        uint256 amount;
        bool isExecuted;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        address[] voters;
    }

    proposal[] public proposals;

    function TotalProposals() public view returns (uint256) {
        return proposals.length;
    }

    function TotalMembers() public view returns (uint256) {
        return daoMembers.length;
    }

    function getAllProposals() public view returns (proposal[] memory) {
        return proposals;
    }

    // chainlink weather functions
    uint256 public tempChainlink;
    uint256 _duration = 300 seconds;

    mapping(address => uint256) public loanTimer;
    event ProposalCreated(
        string description,
        address owner,
        uint256 amount,
        bool isExecuted,
        uint256 startTime,
        uint256 endTime,
        uint256 votesFor,
        uint256 votesAgainst,
        address[] voters
    );

    function createProposal(
        string memory _description,
        uint256 _amount
    ) public {
        // reduce agroToken
        require(getUserBalance(msg.sender) >= 900, "Insufficient tokens");
        require(
            members[msg.sender].loan == 0,
            "You already have a existing loan"
        );

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _duration;

        proposal memory newProposal;
        newProposal.description = _description;
        newProposal.owner = msg.sender;
        newProposal.amount = _amount;
        newProposal.isExecuted = false;
        newProposal.startTime = startTime;
        newProposal.endTime = endTime;
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;
        proposals.push(newProposal);

        emit ProposalCreated(
            newProposal.description,
            newProposal.owner,
            newProposal.amount,
            newProposal.isExecuted,
            newProposal.startTime,
            newProposal.endTime,
            newProposal.votesFor,
            newProposal.votesAgainst,
            newProposal.voters
        );
    }

    function isProposalActive(
        uint256 _proposalIndex
    ) public view returns (bool) {
        if (
            proposals[_proposalIndex].votesFor <=
            proposals[_proposalIndex].votesAgainst
        ) return false;

        if (block.timestamp < proposals[_proposalIndex].endTime) return false;

        return true;
    }

    function executeProposal(uint256 _proposalIndex) public {
        require(_proposalIndex < proposals.length, "Invalid proposal index");
        require(
            block.timestamp > proposals[_proposalIndex].endTime,
            "Voting has not ended"
        );
        require(
            proposals[_proposalIndex].isExecuted == false,
            "Proposal already executed"
        );
        require(
            proposals[_proposalIndex].votesFor >
                proposals[_proposalIndex].votesAgainst,
            "Votes for is less than votes against"
        );
        require(
            proposals[_proposalIndex].amount < DAOBalance,
            "DAO balance insufficient"
        );

        // transfer money to proposal owner
        payable(proposals[_proposalIndex].owner).transfer(
            proposals[_proposalIndex].amount
        );

        // add loan to farmer
        Farmer storage fac = members[proposals[_proposalIndex].owner];

        // mark the loan taken field  and loan repayment field
        members[proposals[_proposalIndex].owner].loan = proposals[
            _proposalIndex
        ].amount;

        fac.loan = proposals[_proposalIndex].amount; // add interest too
        loanTimer[msg.sender] = block.timestamp + LOAN_TIME;
        proposals[_proposalIndex].isExecuted = true;
    }

    function getVotingResults(
        uint256 _proposalIndex
    ) public view returns (uint256 votesFor, uint256 votesAgainst) {
        require(_proposalIndex < proposals.length, "Invalid proposal index");

        votesFor = proposals[_proposalIndex].votesFor;
        votesAgainst = proposals[_proposalIndex].votesAgainst;

        return (votesFor, votesAgainst);
    }

    function castVote(uint256 _proposalIndex, bool _isVoteFor) public {
        require(_proposalIndex < proposals.length, "Invalid proposal index");
        require(
            block.timestamp >= proposals[_proposalIndex].startTime,
            "Voting has not started yet"
        );
        require(
            block.timestamp <= proposals[_proposalIndex].endTime,
            "Voting has ended"
        );
        require(
            proposals[_proposalIndex].amount < DAOBalance,
            "DAO balance insufficient"
        );
        require(
            !proposals[_proposalIndex].isExecuted,
            "Proposal has already been executed"
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
        members[msg.sender].reputation = members[msg.sender].reputation + 5;
    }

    function loanPayBack() public payable {
        address user = payable(msg.sender);

        // check if user has taken a loan
        require(members[user].loan >= 0, "No loan taken or already repaid");

        // repay the loan amount
        require(
            msg.value == members[user].loan,
            "Please transact exact loan amount"
        );
        payable(address(this)).transfer(msg.value);
        members[user].loan = 0;

        // if the loan is repaid in time , increase the reputation of the user
        if (loanTimer[msg.sender] <= block.timestamp) {
            members[user].reputation++;
            loanTimer[msg.sender] = 0;
        } else members[user].reputation--;
    }

    address[] topContributorsOfMonth;

    function getTopContributors() public view returns (address[] memory) {
        return topContributorsOfMonth;
    }

    event topContributorsEmitter(address winner, uint256 time, uint256 amount);

    // function to be called every month
    function topContributorReset() public {
        uint256 daoLength = daoMembers.length;
        uint256 maxReputations = 0;

        for (uint256 i = 0; i < daoLength; i++) {
            address user = daoMembers[i];
            uint256 reputation = members[user].reputation;
            if (reputation > maxReputations) maxReputations = reputation;
        }

        for (uint256 i = 0; i < daoLength; i++) {
            address user = daoMembers[i];

            uint256 reputation = members[user].reputation;

            if (reputation == maxReputations) {
                agriToken.transfer(user, 1000);
                topContributorsOfMonth.push(user);
                emit topContributorsEmitter(user, block.timestamp, 1000);
            }

            members[user].reputation = 0; // reset reputation
        }
    }

    function contibuteDataset(string memory url, string memory name) public {
        // check if the image is valid
        plantDataSet[name].push(url);

        // give tokens to the user
        address user = payable(msg.sender);
        transfer(user, 100);
    }

    function paymentDue(address addr) private view returns (bool) {
        return (members[addr].loan > 0 &&
            loanTimer[addr] > 0 &&
            block.timestamp - loanTimer[addr] > 0);
    }

    event PaymentDone(address recipient, uint256 amount);

    function checkPayment() public {
        for (uint256 i = 0; i < daoMembers.length; ++i) {
            if (paymentDue(daoMembers[i])) {
                emit PaymentDone(daoMembers[i], loanTimer[daoMembers[i]]);
            }
        }
    }
}
