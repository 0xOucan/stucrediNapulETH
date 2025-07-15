// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Vault
 * @notice Manages USDC deposits from sponsors and releases micro-allowances (≤0.0015 USDC
 *         per student per 15-minute round) when RateTokens are burned through the StuCredi system.
 * @dev This contract holds USDC from sponsors in streams and allows authorized withdrawal
 *      only through the RateMe contract. Uses USDC's 6-decimal unit convention.
 *      Testing amounts: 0.000001 USDC represents 1 USD for demo purposes.
 */
contract Vault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /* ------------------------------------------------------------------ */
    /*                              Structs                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Represents a sponsor's funding stream
     * @param remaining Total remaining USDC in micro-units (6 decimals)
     * @param perRound Maximum USDC that can be unlocked per 15-minute round
     */
    struct Stream {
        uint256 remaining; // total remaining USDC (6-decimal units)
        uint256 perRound;  // unlock quota per 15-minute round
    }

    /* ------------------------------------------------------------------ */
    /*                             Constants                              */
    /* ------------------------------------------------------------------ */
    
    /// @notice Role identifier for sponsors who can fund streams
    bytes32 public constant SPONSOR_ROLE = keccak256("SPONSOR_ROLE");
    
    /// @notice Duration of each funding round in seconds (15 minutes)
    uint256 public immutable ROUND_DURATION = 15 minutes;
    
    /// @notice Maximum USDC per round per student (0.0015 USDC = 1500 micro-units)
    uint256 public constant MAX_PER_ROUND = 1500;

    /* ------------------------------------------------------------------ */
    /*                              Storage                               */
    /* ------------------------------------------------------------------ */
    
    /// @notice The USDC token contract
    IERC20 public immutable usdc;
    
    /// @notice Mapping from sponsor address to their funding stream
    mapping(address => Stream) public streamsOf;
    
    /// @notice Timestamp when the current round started
    uint256 public currentRoundStart;
    
    /// @notice Address of the RateMe contract (authorized to pull funds)
    address public rateTokenContract;

    /* ------------------------------------------------------------------ */
    /*                               Events                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Emitted when a sponsor funds their stream
     * @param sponsor The address of the sponsor
     * @param total Total USDC amount deposited (micro-units)
     * @param perRound Maximum USDC per round for this sponsor
     */
    event StreamFunded(
        address indexed sponsor, 
        uint256 total, 
        uint256 perRound
    );
    
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
    event FundsPulled(
        address indexed sponsor, 
        uint256 amount, 
        address indexed recipient
    );

    /* ------------------------------------------------------------------ */
    /*                            Constructor                             */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Initializes the Vault contract
     * @param _usdc Address of the USDC token contract
     * @dev Grants DEFAULT_ADMIN_ROLE to deployer and sets initial round start time
     */
    constructor(IERC20 _usdc) {
        require(address(_usdc) != address(0), "Vault: Invalid USDC address");
        usdc = _usdc;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        currentRoundStart = block.timestamp;
    }

    /* ------------------------------------------------------------------ */
    /*                         Admin Functions                            */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Set the address of the RateMe contract that can pull funds
     * @param _rateTokenContract Address of the RateMe contract
     * @dev Only admin can call this function
     */
    function setRateTokenContract(address _rateTokenContract) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(_rateTokenContract != address(0), "Vault: Invalid contract address");
        rateTokenContract = _rateTokenContract;
    }

    /**
     * @notice Emergency withdrawal function for admin
     * @param amount Amount of USDC to withdraw (micro-units)
     * @dev Only admin can call this function in emergency situations
     */
    function emergencyWithdraw(uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(amount > 0, "Vault: Amount must be greater than 0");
        require(usdc.balanceOf(address(this)) >= amount, "Vault: Insufficient balance");
        
        usdc.safeTransfer(msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, amount);
    }

    /* ------------------------------------------------------------------ */
    /*                        Sponsor Functions                           */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Fund a sponsor's stream with USDC
     * @param _total Total USDC amount to deposit (6-decimal units)
     * @param _perRound Maximum USDC that can be unlocked per round
     * @dev Sponsor must approve this contract to transfer USDC first
     * @custom:requirements _total must be >= _perRound
     * @custom:requirements _perRound must be > 0 and <= MAX_PER_ROUND
     */
    function fundStream(uint256 _total, uint256 _perRound) 
        external 
        nonReentrant 
    {
        require(_total >= _perRound, "Vault: Total must be >= perRound");
        require(_perRound > 0, "Vault: PerRound must be > 0");
        require(_perRound <= MAX_PER_ROUND, "Vault: PerRound exceeds maximum");
        
        // Transfer USDC from sponsor to vault
        usdc.safeTransferFrom(msg.sender, address(this), _total);
        
        // Update sponsor's stream
        Stream storage stream = streamsOf[msg.sender];
        stream.remaining += _total;
        stream.perRound = _perRound;
        
        emit StreamFunded(msg.sender, _total, _perRound);
    }

    /* ------------------------------------------------------------------ */
    /*                         Round Management                           */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Advance to the next round if enough time has passed
     * @dev Can be called by anyone, automatically called during fund pulls
     */
    function advanceRound() public {
        require(
            block.timestamp >= currentRoundStart + ROUND_DURATION, 
            "Vault: Round still ongoing"
        );
        
        currentRoundStart = block.timestamp;
        emit RoundAdvanced(currentRoundStart);
    }

    /**
     * @notice Check if a new round can be started
     * @return True if enough time has passed for a new round
     */
    function canAdvanceRound() external view returns (bool) {
        return block.timestamp >= currentRoundStart + ROUND_DURATION;
    }

    /**
     * @notice Get the time remaining in the current round
     * @return Seconds remaining in current round, 0 if round can be advanced
     */
    function timeUntilNextRound() external view returns (uint256) {
        uint256 roundEnd = currentRoundStart + ROUND_DURATION;
        if (block.timestamp >= roundEnd) {
            return 0;
        }
        return roundEnd - block.timestamp;
    }

    /* ------------------------------------------------------------------ */
    /*                         Fund Distribution                          */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Pull funds from a sponsor's stream (only callable by RateMe contract)
     * @param _sponsor Address of the sponsor whose stream to access
     * @param _usdcUnits Amount of USDC to pull (micro-units)
     * @dev This function is called by the RateMe contract when students redeem RATE tokens
     * @custom:requirements Only rateTokenContract can call this
     * @custom:requirements Amount must not exceed sponsor's per-round limit
     * @custom:requirements Sponsor must have sufficient remaining funds
     */
    function pullAllowance(address _sponsor, uint256 _usdcUnits) 
        external 
        nonReentrant 
    {
        require(msg.sender == rateTokenContract, "Vault: Not authorized");
        require(_usdcUnits > 0, "Vault: Amount must be > 0");
        
        // Auto-advance round if needed
        if (block.timestamp >= currentRoundStart + ROUND_DURATION) {
            advanceRound();
        }
        
        Stream storage stream = streamsOf[_sponsor];
        require(_usdcUnits <= stream.perRound, "Vault: Exceeds per-round cap");
        require(_usdcUnits <= stream.remaining, "Vault: Insufficient funds");
        
        // Deduct from sponsor's stream
        stream.remaining -= _usdcUnits;
        
        // Transfer USDC to RateMe contract (which will forward to student)
        usdc.safeTransfer(rateTokenContract, _usdcUnits);
        
        emit FundsPulled(_sponsor, _usdcUnits, rateTokenContract);
    }

    /* ------------------------------------------------------------------ */
    /*                           View Functions                           */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Get sponsor's stream information
     * @param _sponsor Address of the sponsor
     * @return remaining Total USDC remaining in sponsor's stream
     * @return perRound Maximum USDC per round for this sponsor
     */
    function getStream(address _sponsor) 
        external 
        view 
        returns (uint256 remaining, uint256 perRound) 
    {
        Stream storage stream = streamsOf[_sponsor];
        return (stream.remaining, stream.perRound);
    }

    /**
     * @notice Get the current round number (rounds since deployment)
     * @return Current round number
     */
    function getCurrentRound() external view returns (uint256) {
        return (block.timestamp - currentRoundStart) / ROUND_DURATION;
    }

    /**
     * @notice Get total USDC balance held by the vault
     * @return Total USDC balance (micro-units)
     */
    function totalBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
