// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title BuilderTreasury — Season 1 of BuilderVault
/// @notice Builders deposit on-chain as proof of commitment to their project

contract BuilderTreasury {

    // Store deposit amount per wallet
    mapping(address => uint256) public deposits;

    // Store project name per builder
    mapping(address => string) public projectName;

    // Store timestamp when builder deposited
    mapping(address => uint256) public depositedAt;

    // Total funds locked in contract
    uint256 public totalDeposited;

    // Number of unique builders who have deposited
    uint256 public totalBuilders;

    // Blockchain event logs
    event Deposited(address indexed builder, uint256 amount, string project, uint256 timestamp);
    event Withdrawn(address indexed builder, uint256 amount);

    /// @notice Deposit tokens and register your project name
    function deposit(string calldata _projectName) external payable {
        require(msg.value > 0, "BuilderVault: deposit amount must be greater than 0");
        require(bytes(_projectName).length > 0, "BuilderVault: project name cannot be empty");

        if (deposits[msg.sender] == 0) {
            totalBuilders++;
        }

        deposits[msg.sender] += msg.value;
        projectName[msg.sender] = _projectName;
        depositedAt[msg.sender] = block.timestamp;
        totalDeposited += msg.value;

        emit Deposited(msg.sender, msg.value, _projectName, block.timestamp);
    }

    /// @notice Withdraw all your deposited funds
    function withdraw() external {
        uint256 amount = deposits[msg.sender];
        require(amount > 0, "BuilderVault: no funds to withdraw");

        deposits[msg.sender] = 0;
        totalDeposited -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "BuilderVault: transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Get full info of a builder
    function getBuilderInfo(address _builder)
        external
        view
        returns (
            uint256 amount,
            string memory project,
            uint256 since
        )
    {
        return (
            deposits[_builder],
            projectName[_builder],
            depositedAt[_builder]
        );
    }

    /// @notice Get overall contract stats
    function getStats()
        external
        view
        returns (uint256 builders, uint256 totalFunds)
    {
        return (totalBuilders, totalDeposited);
    }
}