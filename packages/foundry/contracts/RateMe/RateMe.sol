// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../CustomNFT/CustomNFT.sol";
import "../Vault/Vault.sol";
import "../interfaces/ICustomNFT.sol";
import "../interfaces/IVault.sol";

/**
 * @title RateMe
 * @notice ERC20 token contract for the StuCredi system that allows students to mint RATE tokens
 *         based on their academic grades and NFT ownership, then redeem them for USDC funding.
 * @dev Students mint RATE tokens once per round based on:
 *      - Academic grade (1-100 points)
 *      - Number of CustomNFTs owned (5 points each)
 *      - Total points: 50-150 (minimum-maximum funding range)
 *      - Conversion: 1 RATE = 1 point = 0.000010 USDC
 */
contract RateMe is ERC20Burnable, AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /* ------------------------------------------------------------------ */
    /*                              Constants                             */
    /* ------------------------------------------------------------------ */
    
    /// @notice Maximum grade value (1-100 scale)
    uint8 public constant MAX_GRADE = 100;
    
    /// @notice Points awarded per CustomNFT owned
    uint8 public constant POINTS_PER_NFT = 5;
    
    /// @notice Maximum points a student can earn per round
    uint16 public constant POINTS_MAX = 150;
    
    /// @notice Minimum points required to claim RATE tokens
    uint16 public constant POINTS_MIN = 50;
    
    /// @notice Conversion rate: 1 RATE token (18 decimals) = 10 micro-USDC (0.000010 USDC)
    uint256 public constant USDC_UNITS_PER_RATE = 10;
    
    /// @notice Wei amount of RATE tokens per point (1 RATE = 1e18 wei)
    uint256 private constant RATE_PER_POINT_WEI = 1e18;

    /* ------------------------------------------------------------------ */
    /*                               Roles                                */
    /* ------------------------------------------------------------------ */
    
    /// @notice Role identifier for students who can claim RATE tokens
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    /* ------------------------------------------------------------------ */
    /*                              Storage                               */
    /* ------------------------------------------------------------------ */
    
    /// @notice Reference to the CustomNFT contract for point calculation
    CustomNFT public immutable nft;
    
    /// @notice Reference to the Vault contract for USDC redemption
    Vault public immutable vault;
    
    /// @notice Reference to the USDC token contract
    IERC20 public immutable usdc;
    
    /// @notice Tracks if a student has claimed RATE tokens for a specific round
    /// @dev Mapping: student address => round start timestamp => claimed status
    mapping(address => mapping(uint256 => bool)) public claimed;

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
    /*                            Constructor                             */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Initializes the RateMe contract
     * @param _nft Address of the CustomNFT contract
     * @param _vault Address of the Vault contract
     * @param _usdc Address of the USDC token contract
     * @dev Grants DEFAULT_ADMIN_ROLE to deployer and sets up contract references
     */
    constructor(
        CustomNFT _nft,
        Vault _vault,
        IERC20 _usdc
    ) ERC20("RateToken", "RATE") {
        require(address(_nft) != address(0), "RateMe: Invalid NFT address");
        require(address(_vault) != address(0), "RateMe: Invalid Vault address");
        require(address(_usdc) != address(0), "RateMe: Invalid USDC address");
        
        nft = _nft;
        vault = _vault;
        usdc = _usdc;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* ------------------------------------------------------------------ */
    /*                         Claim Functions                            */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Claim RATE tokens based on academic grade and NFT ownership
     * @param grade Academic grade on a 1-100 scale
     * @dev Students can only claim once per round. Points are calculated as:
     *      Total Points = Grade + (NFT Count × 5)
     *      Must be between 50-150 points to qualify for funding
     * @custom:requirements Grade must be between 1-100
     * @custom:requirements Student must not have claimed in current round
     * @custom:requirements Total points must be between 50-150
     */
    function claim(uint8 grade) external nonReentrant {
        require(grade > 0 && grade <= MAX_GRADE, "RateMe: Invalid grade range");
        
        // Get current round from vault
        uint256 currentRound = vault.currentRoundStart();
        require(!claimed[msg.sender][currentRound], "RateMe: Already claimed this round");
        
        // Mark as claimed for this round
        claimed[msg.sender][currentRound] = true;
        
        // Calculate total points
        uint256 nftCount = nft.balanceOf(msg.sender);
        uint256 totalPoints = uint256(grade) + (nftCount * POINTS_PER_NFT);
        
        // Validate point bounds
        require(
            totalPoints >= POINTS_MIN && totalPoints <= POINTS_MAX,
            "RateMe: Points outside valid range"
        );
        
        // Calculate RATE token amount (1 RATE per point)
        uint256 rateAmount = totalPoints * RATE_PER_POINT_WEI;
        
        // Defensive check: verify USDC conversion bounds
        uint256 usdcUnits = totalPoints * USDC_UNITS_PER_RATE;
        require(
            usdcUnits >= (POINTS_MIN * USDC_UNITS_PER_RATE) && 
            usdcUnits <= (POINTS_MAX * USDC_UNITS_PER_RATE),
            "RateMe: USDC conversion out of bounds"
        );
        
        // Mint RATE tokens to student
        _mint(msg.sender, rateAmount);
        
        emit RateClaimed(msg.sender, grade, nftCount, totalPoints, rateAmount);
    }

    /* ------------------------------------------------------------------ */
    /*                        Redeem Functions                            */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Redeem RATE tokens for USDC from a sponsor's stream
     * @param rateAmount Amount of RATE tokens to burn (must be whole tokens)
     * @param sponsor Address of the sponsor whose stream to access
     * @dev Burns RATE tokens and pulls equivalent USDC from vault
     * @custom:requirements rateAmount must be in whole tokens (divisible by 1e18)
     * @custom:requirements Equivalent points must be between 50-150
     * @custom:requirements Sponsor must have sufficient funds in their stream
     */
    function redeem(uint256 rateAmount, address sponsor) external nonReentrant {
        require(rateAmount > 0, "RateMe: Amount must be greater than 0");
        require(rateAmount % 1e18 == 0, "RateMe: Must redeem whole RATE tokens");
        require(sponsor != address(0), "RateMe: Invalid sponsor address");
        
        // Calculate equivalent points
        uint256 points = rateAmount / 1e18;
        require(
            points >= POINTS_MIN && points <= POINTS_MAX,
            "RateMe: Redeem amount outside valid range"
        );
        
        // Burn RATE tokens from student
        _burn(msg.sender, rateAmount);
        
        // Calculate USDC amount to pull from vault
        uint256 usdcUnits = points * USDC_UNITS_PER_RATE;
        
        // Pull USDC from sponsor's stream via vault
        vault.pullAllowance(sponsor, usdcUnits);
        
        // Transfer USDC to student
        usdc.safeTransfer(msg.sender, usdcUnits);
        
        emit RateRedeemed(msg.sender, sponsor, rateAmount, usdcUnits);
    }

    /* ------------------------------------------------------------------ */
    /*                           View Functions                           */
    /* ------------------------------------------------------------------ */
    
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
        returns (uint256 points, uint256 rateAmount, bool canClaim)
    {
        if (grade == 0 || grade > MAX_GRADE) {
            return (0, 0, false);
        }
        
        uint256 currentRound = vault.currentRoundStart();
        if (claimed[student][currentRound]) {
            return (0, 0, false);
        }
        
        uint256 nftCount = nft.balanceOf(student);
        points = uint256(grade) + (nftCount * POINTS_PER_NFT);
        
        if (points < POINTS_MIN || points > POINTS_MAX) {
            return (points, 0, false);
        }
        
        rateAmount = points * RATE_PER_POINT_WEI;
        canClaim = true;
    }
    
    /**
     * @notice Check if a student has claimed RATE tokens in the current round
     * @param student Address of the student
     * @return True if student has already claimed in current round
     */
    function hasClaimedThisRound(address student) external view returns (bool) {
        uint256 currentRound = vault.currentRoundStart();
        return claimed[student][currentRound];
    }
    
    /**
     * @notice Get the USDC value of a given amount of RATE tokens
     * @param rateAmount Amount of RATE tokens (in wei)
     * @return USDC value in micro-units (6 decimals)
     */
    function getUSDCValue(uint256 rateAmount) external pure returns (uint256) {
        if (rateAmount == 0) return 0;
        uint256 points = rateAmount / 1e18;
        return points * USDC_UNITS_PER_RATE;
    }
    
    /**
     * @notice Get the current round information from the vault
     * @return currentRoundStart Timestamp when current round started
     * @return timeUntilNext Seconds until next round can begin
     */
    function getCurrentRoundInfo() 
        external 
        view 
        returns (uint256 currentRoundStart, uint256 timeUntilNext) 
    {
        currentRoundStart = vault.currentRoundStart();
        timeUntilNext = vault.timeUntilNextRound();
    }

    /* ------------------------------------------------------------------ */
    /*                         Override Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Returns the number of decimals for RATE token
     * @return 18 decimals (standard ERC20)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
