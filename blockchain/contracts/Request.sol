// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;

    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Mumbai Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0x40193c8518BB267228Fc409a613bDbD8eC5a97b3 (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    AggregatorV3Interface internal dataFeed;

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
        dataFeed = AggregatorV3Interface(
            0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada // polygon
        );
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    int public ans;

    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        // Set the URL to perform the GET request on
        ans = getLatestData();

        string memory amount = Strings.toString(ans);
        string memory url = string(
            abi.encodePacked(
                "https://api.api-ninjas.com/v1/convertcurrency?want=INR",
                "&have=USD",
                "&amount=",
                amount
            )
        );

        req.add("get", url);

        req.add("path", "new_amount"); // Chainlink nodes 1.0.0 and later support this format

        req.add("X-Api-Key", "rEAsrWsBXFRiqXLWQM9C5w==HX6ULpUlpQXYd5YM");

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);

        // Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        // request.add("get", 'https://api.api-ninjas.com/v1/convertcurrency?want=INR&have=USD&amount=5000');
        // request.add("path", "new_amount");

        // // Set the request headers
        // request.add("X-Api-Key", 'rEAsrWsBXFRiqXLWQM9C5w==HX6ULpUlpQXYd5YM');

        // int256 timesAmount = 10 ** 18;
        // request.addInt("times", timesAmount);

        // // Sends the request
        // return sendChainlinkRequestTo(request, fee);
    }

    bool public dataReceived;

    function getEquivalent() public view returns (uint256) {
        return volume;
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _volume
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
        dataReceived = true;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function viewConversion() public view returns (uint256) {
        // requestVolumeData();
        return volume;
    }

    function getLatestData() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
