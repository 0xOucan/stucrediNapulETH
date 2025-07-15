// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title IRateMe
 * @notice Interface for the RateMe contract in the StuCredi system
 * @dev Extends IERC20 and IAccessControl for full ERC20 token functionality with access control
 */
interface IRateMe is IERC20, IAccessControl {
    /* ------------------------------------------------------------------ */
    /*                               Events                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Emitted when a student successfully claims RATE tokens
     * @param student Address of the student who claimed
     * @param grade Academic grade submitted (1-100)
     * @param nftCount Number of CustomNFTs owned
     * @param totalPoints Total points calculated (grade + NFT points)
     * @param rateAmount Amount of RATE tokens minted (in wei)
     */
    event RateClaimed(
        address indexed student,
        uint8 grade,
        uint256 nftCount,
        uint256 totalPoints,
        uint256 rateAmount
    );
    
    /**
     * @notice Emitted when a student redeems RATE tokens for USDC
     * @param student Address of the student who redeemed
     * @param sponsor Address of the sponsor whose stream was used
     * @param rateAmount Amount of RATE tokens burned (in wei)
     * @param usdcAmount Amount of USDC received (micro-units)
     */
    event RateRedeemed(
        address indexed student,
        address indexed sponsor,
        uint256 rateAmount,
        uint256 usdcAmount
    );

    /* ------------------------------------------------------------------ */
    /*                             Constants                              */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Maximum grade value (1-100 scale)
     * @return The maximum grade value
     */
    function MAX_GRADE() external view returns (uint8);
    
    /**
     * @notice Points awarded per CustomNFT owned
     * @return The points per NFT
     */
    function POINTS_PER_NFT() external view returns (uint8);
    
    /**
     * @notice Maximum points a student can earn per round
     * @return The maximum points
     */
    function POINTS_MAX() external view returns (uint16);
    
    /**
     * @notice Minimum points required to claim RATE tokens
     * @return The minimum points
     */
    function POINTS_MIN() external view returns (uint16);
    
    /**
     * @notice Conversion rate: 1 RATE token (18 decimals) = 10 micro-USDC (0.000010 USDC)
     * @return The USDC units per RATE token
     */
    function USDC_UNITS_PER_RATE() external view returns (uint256);
    
    /**
     * @notice Role identifier for students who can claim RATE tokens
     * @return The keccak256 hash of "STUDENT_ROLE"
     */
    function STUDENT_ROLE() external view returns (bytes32);

    /* ------------------------------------------------------------------ */
    /*                         External Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Claim RATE tokens based on academic grade and NFT ownership
     * @param grade Academic grade on a 1-100 scale
     */
    function claim(uint8 grade) external;

    /**
     * @notice Redeem RATE tokens for USDC from a sponsor's stream
     * @param rateAmount Amount of RATE tokens to burn (must be whole tokens)
     * @param sponsor Address of the sponsor whose stream to access
     */
    function redeem(uint256 rateAmount, address sponsor) external;

    /* ------------------------------------------------------------------ */
    /*                           View Functions                           */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Get the CustomNFT contract address
     * @return Address of the CustomNFT contract
     */
    function nft() external view returns (address);
    
    /**
     * @notice Get the Vault contract address
     * @return Address of the Vault contract
     */
    function vault() external view returns (address);
    
    /**
     * @notice Get the USDC token contract address
     * @return Address of the USDC token contract
     */
    function usdc() external view returns (address);
    
    /**
     * @notice Check if a student has claimed RATE tokens for a specific round
     * @param student Address of the student
     * @param round Round timestamp to check
     * @return True if student has claimed for that round
     */
    function claimed(address student, uint256 round) external view returns (bool);
    
    /**
     * @notice Calculate how many RATE tokens a student can claim based on current state
     * @param student Address of the student
     * @param grade Academic grade to use for calculation
     * @return points Total points the student would earn
     * @return rateAmount Amount of RATE tokens that would be minted
     * @return canClaim Whether the student can claim in the current round
     */
    function calculateClaimAmount(address student, uint8 grade)
        external
        view
        returns (uint256 points, uint256 rateAmount, bool canClaim);
    
    /**
     * @notice Check if a student has claimed RATE tokens in the current round
     * @param student Address of the student
     * @return True if student has already claimed in current round
     */
    function hasClaimedThisRound(address student) external view returns (bool);
    
    /**
     * @notice Get the USDC value of a given amount of RATE tokens
     * @param rateAmount Amount of RATE tokens (in wei)
     * @return USDC value in micro-units (6 decimals)
     */
    function getUSDCValue(uint256 rateAmount) external pure returns (uint256);
    
    /**
     * @notice Get the current round information from the vault
     * @return currentRoundStart Timestamp when current round started
     * @return timeUntilNext Seconds until next round can begin
     */
    function getCurrentRoundInfo() 
        external 
        view 
        returns (uint256 currentRoundStart, uint256 timeUntilNext);
} 