// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title IVault
 * @notice Interface for the Vault contract in the StuCredi system
 * @dev Manages USDC deposits and fund distribution for students
 */
interface IVault is IAccessControl {
    /* ------------------------------------------------------------------ */
    /*                              Structs                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Represents a sponsor's funding stream
     * @param remaining Total remaining USDC in micro-units (6 decimals)
     * @param perRound Maximum USDC that can be unlocked per 15-minute round
     */
    struct Stream {
        uint256 remaining;
        uint256 perRound;
    }

    /* ------------------------------------------------------------------ */
    /*                               Events                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Emitted when a sponsor funds their stream
     * @param sponsor The address of the sponsor
     * @param total Total USDC amount deposited (micro-units)
     * @param perRound Maximum USDC per round for this sponsor
     */
    event StreamFunded(address indexed sponsor, uint256 total, uint256 perRound);
    
    /**
     * @notice Emitted when a new round begins
     * @param newStart Timestamp of the new round start
     */
    event RoundAdvanced(uint256 newStart);
    
    /**
     * @notice Emitted during emergency withdrawal
     * @param to Address that received the emergency withdrawal
     * @param amount Amount of USDC withdrawn (micro-units)
     */
    event EmergencyWithdraw(address indexed to, uint256 amount);
    
    /**
     * @notice Emitted when funds are pulled from a sponsor's stream
     * @param sponsor The sponsor whose stream was accessed
     * @param amount Amount of USDC pulled (micro-units)
     * @param recipient Address that will receive the funds
     */
    event FundsPulled(address indexed sponsor, uint256 amount, address indexed recipient);

    /* ------------------------------------------------------------------ */
    /*                             Constants                              */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Role identifier for sponsors who can fund streams
     * @return The keccak256 hash of "SPONSOR_ROLE"
     */
    function SPONSOR_ROLE() external view returns (bytes32);
    
    /**
     * @notice Duration of each funding round in seconds (15 minutes)
     * @return The round duration in seconds
     */
    function ROUND_DURATION() external view returns (uint256);
    
    /**
     * @notice Maximum USDC per round per student (0.0015 USDC = 1500 micro-units)
     * @return The maximum USDC per round
     */
    function MAX_PER_ROUND() external view returns (uint256);

    /* ------------------------------------------------------------------ */
    /*                         External Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Set the address of the RateMe contract that can pull funds
     * @param _rateTokenContract Address of the RateMe contract
     */
    function setRateTokenContract(address _rateTokenContract) external;

    /**
     * @notice Emergency withdrawal function for admin
     * @param amount Amount of USDC to withdraw (micro-units)
     */
    function emergencyWithdraw(uint256 amount) external;

    /**
     * @notice Fund a sponsor's stream with USDC
     * @param _total Total USDC amount to deposit (6-decimal units)
     * @param _perRound Maximum USDC that can be unlocked per round
     */
    function fundStream(uint256 _total, uint256 _perRound) external;

    /**
     * @notice Advance to the next round if enough time has passed
     */
    function advanceRound() external;

    /**
     * @notice Pull funds from a sponsor's stream (only callable by RateMe contract)
     * @param _sponsor Address of the sponsor whose stream to access
     * @param _usdcUnits Amount of USDC to pull (micro-units)
     */
    function pullAllowance(address _sponsor, uint256 _usdcUnits) external;

    /* ------------------------------------------------------------------ */
    /*                           View Functions                           */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Get the USDC token contract address
     * @return Address of the USDC token contract
     */
    function usdc() external view returns (address);
    
    /**
     * @notice Get sponsor's stream information
     * @param _sponsor Address of the sponsor
     * @return remaining Total USDC remaining in sponsor's stream
     * @return perRound Maximum USDC per round for this sponsor
     */
    function getStream(address _sponsor) external view returns (uint256 remaining, uint256 perRound);
    
    /**
     * @notice Get the timestamp when the current round started
     * @return Timestamp of current round start
     */
    function currentRoundStart() external view returns (uint256);
    
    /**
     * @notice Check if a new round can be started
     * @return True if enough time has passed for a new round
     */
    function canAdvanceRound() external view returns (bool);
    
    /**
     * @notice Get the time remaining in the current round
     * @return Seconds remaining in current round, 0 if round can be advanced
     */
    function timeUntilNextRound() external view returns (uint256);
    
    /**
     * @notice Get the current round number (rounds since deployment)
     * @return Current round number
     */
    function getCurrentRound() external view returns (uint256);
    
    /**
     * @notice Get total USDC balance held by the vault
     * @return Total USDC balance (micro-units)
     */
    function totalBalance() external view returns (uint256);
} 