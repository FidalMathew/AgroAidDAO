// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./Request.sol";
import "./Token.sol";

contract AgroDAO is AutomationCompatibleInterface {
    Token private immutable agriToken;
    APIConsumer private immutable chainC;

    uint256 private constant INITIAL_TOKEN_AMOUNT = 10000000;
    uint256 private constant INITIAL_USER_AMOUNT = 1000;

    address public agriTokenAddress;
    address public chainLinkAddress;

    uint256 public DAOBalance = 0;

    address[] public addresses;
    mapping(address => bool[]) weather;

    struct Farmer {
        address farmerAddress;
        // more details can be added
        uint256 loan;
        string longitude;
        string latitude;
    }

    mapping(address => Farmer) private members;

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

    proposal[] proposals;

    uint256 public tempChainlink;

    uint public immutable interval;
    uint public lastTimeStamp;

    constructor(uint updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        // counter = 0;

        // mint the tokens first
        agriToken = new Token(INITIAL_TOKEN_AMOUNT, address(this));
        agriTokenAddress = address(agriToken);

        chainC = new APIConsumer();
        chainLinkAddress = address(chainC);
    }

    function addAddress(address _newAddress) public {
        addresses.push(_newAddress);
    }

    function getDAOBalance() public view returns (uint256) {
        return DAOBalance;
    }

    function getUserBalance(address user) public view returns (uint256) {
        return agriToken.balanceOf(user);
    }

    function joinDAO(
        address payable user,
        string memory _longitude,
        string memory _latitude
    ) public payable {
        // check if membership already exists, if not append in mapping
        require(
            members[user].farmerAddress == address(0),
            "Already part of the DAO"
        );
        require(msg.value == 0.01 ether, "Please send exactly 0.01 ETH");

        members[user] = Farmer(user, 0, _longitude, _latitude);

        payable(address(this)).transfer(msg.value);
        DAOBalance += msg.value;
        // give DAO tokens to joining members
        agriToken.transfer(msg.sender, INITIAL_USER_AMOUNT);
    }

    function fundDAO(address payable user) public payable {
        // check if the person is a member of the DAO
        require(
            members[user].farmerAddress == address(0),
            "Please join the DAO before funding !!"
        );
        require(msg.value > 0, "Enter an amount greater than 0");

        payable(address(this)).transfer(msg.value);
        DAOBalance += msg.value;
    }

    function createProposal(
        string memory _description,
        uint256 _amount,
        uint256 _duration
    ) public {
        // reduce agroToken

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

        fac.loan = proposals[_proposalIndex].amount; // add interest too
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
    }

    // chainlink automation

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            // returns (bool upkeepNeeded, bytes memory /* performData */)
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function requestLoanChainlink(address _add) public returns (bool) {
        chainC.requestVolumeData(
            members[_add].longitude,
            members[_add].latitude
        );
        tempChainlink = chainC.viewTemperature();

        if (tempChainlink > 40 * 1000000000000000000)
            // 19000000000000000000
            // 40000000000000000000
            return true;

        return false;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;

            // update farmers array
            for (uint256 i = 0; i < addresses.length; i++) {
                bool res = requestLoanChainlink(addresses[i]);
                weather[addresses[i]].push(res);
            }
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }
}
