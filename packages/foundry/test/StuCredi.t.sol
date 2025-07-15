// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/CustomNFT/CustomNFT.sol";
import "../contracts/Vault/Vault.sol";
import "../contracts/RateMe/RateMe.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC contract for testing purposes
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }
}

/**
 * @title StuCrediTest
 * @notice Comprehensive test suite for the StuCredi system
 */
contract StuCrediTest is Test {
    // Contracts
    CustomNFT public customNFT;
    Vault public vault;
    RateMe public rateMe;
    MockUSDC public usdc;

    // Test addresses
    address public admin = address(0x1);
    address public sponsor = address(0x2);
    address public student1 = address(0x3);
    address public student2 = address(0x4);

    // Test constants
    uint256 public constant INITIAL_USDC_SUPPLY = 1000000; // 1 USDC in micro-units
    uint256 public constant SPONSOR_DEPOSIT = 100000; // 0.1 USDC in micro-units
    uint256 public constant PER_ROUND_LIMIT = 1500; // 0.0015 USDC max per round

    // Events for testing
    event ActivityNFTMinted(address indexed sponsor, uint256 indexed tokenId, address indexed recipient);
    event StreamFunded(address indexed sponsor, uint256 total, uint256 perRound);
    event RateClaimed(address indexed student, uint8 grade, uint256 nftCount, uint256 totalPoints, uint256 rateAmount);
    event RateRedeemed(address indexed student, address indexed sponsor, uint256 rateAmount, uint256 usdcAmount);

    function setUp() public {
        // Set up test environment
        vm.startPrank(admin);

        // Deploy contracts
        usdc = new MockUSDC();
        customNFT = new CustomNFT();
        vault = new Vault(IERC20(address(usdc)));
        rateMe = new RateMe(customNFT, vault, IERC20(address(usdc)));

        // Configure contracts
        vault.setRateTokenContract(address(rateMe));
        customNFT.grantRole(customNFT.SPONSOR_ROLE(), sponsor);

        // Mint USDC for testing
        usdc.mint(sponsor, INITIAL_USDC_SUPPLY);

        vm.stopPrank();

        // Set up sponsor
        vm.startPrank(sponsor);
        usdc.approve(address(vault), INITIAL_USDC_SUPPLY);
        vault.fundStream(SPONSOR_DEPOSIT, PER_ROUND_LIMIT);
        vm.stopPrank();
    }

    /* ------------------------------------------------------------------ */
    /*                         CustomNFT Tests                           */
    /* ------------------------------------------------------------------ */

    function test_CustomNFT_Deployment() public {
        assertEq(customNFT.name(), "ActivityProof");
        assertEq(customNFT.symbol(), "ACTPOAP");
        assertEq(customNFT.POINTS_PER_NFT(), 5);
        assertTrue(customNFT.hasRole(customNFT.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(customNFT.hasRole(customNFT.SPONSOR_ROLE(), sponsor));
    }

    function test_CustomNFT_MintBatch() public {
        address[] memory receivers = new address[](2);
        receivers[0] = student1;
        receivers[1] = student2;

        vm.startPrank(sponsor);
        
        vm.expectEmit(true, true, true, true);
        emit ActivityNFTMinted(sponsor, 1, student1);
        
        vm.expectEmit(true, true, true, true);
        emit ActivityNFTMinted(sponsor, 2, student2);

        customNFT.mintBatch("ipfs://test-uri", receivers);
        vm.stopPrank();

        assertEq(customNFT.totalMinted(), 2);
        assertEq(customNFT.balanceOf(student1), 1);
        assertEq(customNFT.balanceOf(student2), 1);
        assertEq(customNFT.ownerOf(1), student1);
        assertEq(customNFT.ownerOf(2), student2);
        assertEq(customNFT.tokenURI(1), "ipfs://test-uri");
    }

    function test_CustomNFT_MintBatch_OnlySponsor() public {
        address[] memory receivers = new address[](1);
        receivers[0] = student1;

        vm.startPrank(student1);
        vm.expectRevert();
        customNFT.mintBatch("ipfs://test-uri", receivers);
        vm.stopPrank();
    }

    function test_CustomNFT_MintBatch_EmptyReceivers() public {
        address[] memory receivers = new address[](0);

        vm.startPrank(sponsor);
        vm.expectRevert("CustomNFT: No receivers provided");
        customNFT.mintBatch("ipfs://test-uri", receivers);
        vm.stopPrank();
    }

    /* ------------------------------------------------------------------ */
    /*                           Vault Tests                             */
    /* ------------------------------------------------------------------ */

    function test_Vault_Deployment() public {
        assertEq(address(vault.usdc()), address(usdc));
        assertEq(vault.ROUND_DURATION(), 15 minutes);
        assertEq(vault.MAX_PER_ROUND(), 1500);
        assertTrue(vault.hasRole(vault.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_Vault_FundStream() public {
        vm.startPrank(sponsor);
        usdc.approve(address(vault), 50000);
        
        vm.expectEmit(true, false, false, true);
        emit StreamFunded(sponsor, 50000, 1000);
        
        vault.fundStream(50000, 1000);
        vm.stopPrank();

        (uint256 remaining, uint256 perRound) = vault.getStream(sponsor);
        assertEq(remaining, SPONSOR_DEPOSIT + 50000); // Previous + new deposit
        assertEq(perRound, 1000); // Updated per round
    }

    function test_Vault_FundStream_InvalidParams() public {
        vm.startPrank(sponsor);
        usdc.approve(address(vault), 50000);
        
        // Total less than perRound
        vm.expectRevert("Vault: Total must be >= perRound");
        vault.fundStream(1000, 2000);
        
        // PerRound is 0
        vm.expectRevert("Vault: PerRound must be > 0");
        vault.fundStream(1000, 0);
        
        // PerRound exceeds maximum
        vm.expectRevert("Vault: PerRound exceeds maximum");
        vault.fundStream(5000, 2000);
        
        vm.stopPrank();
    }

    function test_Vault_RoundManagement() public {
        uint256 initialRound = vault.currentRoundStart();
        
        // Cannot advance round immediately
        vm.expectRevert("Vault: Round still ongoing");
        vault.advanceRound();
        
        // Fast forward 15 minutes
        vm.warp(block.timestamp + 15 minutes);
        
        assertTrue(vault.canAdvanceRound());
        assertEq(vault.timeUntilNextRound(), 0);
        
        vault.advanceRound();
        assertGt(vault.currentRoundStart(), initialRound);
    }

    /* ------------------------------------------------------------------ */
    /*                          RateMe Tests                             */
    /* ------------------------------------------------------------------ */

    function test_RateMe_Deployment() public {
        assertEq(rateMe.name(), "RateToken");
        assertEq(rateMe.symbol(), "RATE");
        assertEq(rateMe.decimals(), 18);
        assertEq(address(rateMe.nft()), address(customNFT));
        assertEq(address(rateMe.vault()), address(vault));
        assertEq(address(rateMe.usdc()), address(usdc));
        assertEq(rateMe.MAX_GRADE(), 100);
        assertEq(rateMe.POINTS_PER_NFT(), 5);
        assertEq(rateMe.POINTS_MIN(), 50);
        assertEq(rateMe.POINTS_MAX(), 150);
        assertEq(rateMe.USDC_UNITS_PER_RATE(), 10);
    }

    function test_RateMe_Claim_BasicGrade() public {
        uint8 grade = 75;
        uint256 expectedPoints = 75; // No NFTs
        uint256 expectedRate = expectedPoints * 1e18;

        vm.startPrank(student1);
        
        vm.expectEmit(true, false, false, true);
        emit RateClaimed(student1, grade, 0, expectedPoints, expectedRate);
        
        rateMe.claim(grade);
        vm.stopPrank();

        assertEq(rateMe.balanceOf(student1), expectedRate);
        assertTrue(rateMe.hasClaimedThisRound(student1));
    }

    function test_RateMe_Claim_WithNFTs() public {
        // First mint NFTs to student
        address[] memory receivers = new address[](1);
        receivers[0] = student1;
        
        vm.startPrank(sponsor);
        customNFT.mintBatch("ipfs://test-uri", receivers);
        customNFT.mintBatch("ipfs://test-uri2", receivers);
        vm.stopPrank();

        uint8 grade = 60;
        uint256 nftCount = 2;
        uint256 expectedPoints = grade + (nftCount * 5); // 60 + 10 = 70
        uint256 expectedRate = expectedPoints * 1e18;

        vm.startPrank(student1);
        
        vm.expectEmit(true, false, false, true);
        emit RateClaimed(student1, grade, nftCount, expectedPoints, expectedRate);
        
        rateMe.claim(grade);
        vm.stopPrank();

        assertEq(rateMe.balanceOf(student1), expectedRate);
        assertEq(customNFT.balanceOf(student1), 2);
    }

    function test_RateMe_Claim_BoundaryConditions() public {
        // Test minimum valid claim (grade 50, no NFTs)
        vm.startPrank(student1);
        rateMe.claim(50);
        assertEq(rateMe.balanceOf(student1), 50 * 1e18);
        vm.stopPrank();

        // Test maximum valid claim (grade 100 + 10 NFTs = 150 points)
        address[] memory receivers = new address[](1);
        receivers[0] = student2;
        
        vm.startPrank(sponsor);
        for (uint i = 0; i < 10; i++) {
            customNFT.mintBatch("ipfs://test-uri", receivers);
        }
        vm.stopPrank();

        vm.startPrank(student2);
        rateMe.claim(100);
        assertEq(rateMe.balanceOf(student2), 150 * 1e18);
        vm.stopPrank();
    }

    function test_RateMe_Claim_InvalidConditions() public {
        vm.startPrank(student1);
        
        // Invalid grade (0)
        vm.expectRevert("RateMe: Invalid grade range");
        rateMe.claim(0);
        
        // Invalid grade (101)
        vm.expectRevert("RateMe: Invalid grade range");
        rateMe.claim(101);
        
        // Points too low (grade 40, no NFTs = 40 points < 50 minimum)
        vm.expectRevert("RateMe: Points outside valid range");
        rateMe.claim(40);
        
        vm.stopPrank();
    }

    function test_RateMe_Claim_OncePerRound() public {
        vm.startPrank(student1);
        rateMe.claim(75);
        
        // Cannot claim again in same round
        vm.expectRevert("RateMe: Already claimed this round");
        rateMe.claim(80);
        
        vm.stopPrank();
    }

    function test_RateMe_Redeem() public {
        // First, student claims RATE tokens
        vm.startPrank(student1);
        rateMe.claim(75);
        uint256 rateBalance = rateMe.balanceOf(student1);
        vm.stopPrank();

        uint256 redeemAmount = 50 * 1e18; // 50 RATE tokens
        uint256 expectedUSDC = 50 * 10; // 50 * 10 micro-USDC = 500 micro-USDC

        vm.startPrank(student1);
        
        vm.expectEmit(true, true, false, true);
        emit RateRedeemed(student1, sponsor, redeemAmount, expectedUSDC);
        
        rateMe.redeem(redeemAmount, sponsor);
        vm.stopPrank();

        assertEq(rateMe.balanceOf(student1), rateBalance - redeemAmount);
        assertEq(usdc.balanceOf(student1), expectedUSDC);
    }

    function test_RateMe_Redeem_InvalidConditions() public {
        vm.startPrank(student1);
        rateMe.claim(75);
        
        // Cannot redeem 0 tokens
        vm.expectRevert("RateMe: Amount must be greater than 0");
        rateMe.redeem(0, sponsor);
        
        // Cannot redeem partial tokens
        vm.expectRevert("RateMe: Must redeem whole RATE tokens");
        rateMe.redeem(1e17, sponsor); // 0.1 RATE
        
        // Cannot redeem too few tokens (< 50 RATE)
        vm.expectRevert("RateMe: Redeem amount outside valid range");
        rateMe.redeem(49 * 1e18, sponsor);
        
        // Cannot redeem too many tokens (> 150 RATE)
        vm.expectRevert("RateMe: Redeem amount outside valid range");
        rateMe.redeem(151 * 1e18, sponsor);
        
        vm.stopPrank();
    }

    /* ------------------------------------------------------------------ */
    /*                       Integration Tests                            */
    /* ------------------------------------------------------------------ */

    function test_Integration_FullWorkflow() public {
        // Step 1: Sponsor mints NFTs for students
        address[] memory receivers = new address[](2);
        receivers[0] = student1;
        receivers[1] = student2;
        
        vm.startPrank(sponsor);
        customNFT.mintBatch("ipfs://bootcamp-nft", receivers);
        vm.stopPrank();

        // Step 2: Students claim RATE tokens
        vm.startPrank(student1);
        rateMe.claim(80); // 80 grade + 5 NFT points = 85 points = 85 RATE
        vm.stopPrank();

        vm.startPrank(student2);
        rateMe.claim(70); // 70 grade + 5 NFT points = 75 points = 75 RATE
        vm.stopPrank();

        // Verify balances
        assertEq(rateMe.balanceOf(student1), 85 * 1e18);
        assertEq(rateMe.balanceOf(student2), 75 * 1e18);

        // Step 3: Students redeem RATE tokens for USDC
        vm.startPrank(student1);
        rateMe.redeem(60 * 1e18, sponsor); // Redeem 60 RATE for 600 micro-USDC
        vm.stopPrank();

        vm.startPrank(student2);
        rateMe.redeem(50 * 1e18, sponsor); // Redeem 50 RATE for 500 micro-USDC
        vm.stopPrank();

        // Verify final balances
        assertEq(rateMe.balanceOf(student1), 25 * 1e18); // 85 - 60 = 25 RATE remaining
        assertEq(rateMe.balanceOf(student2), 25 * 1e18); // 75 - 50 = 25 RATE remaining
        assertEq(usdc.balanceOf(student1), 600); // 600 micro-USDC
        assertEq(usdc.balanceOf(student2), 500); // 500 micro-USDC

        // Verify sponsor's vault balance decreased
        (uint256 remaining, ) = vault.getStream(sponsor);
        assertEq(remaining, SPONSOR_DEPOSIT - 600 - 500); // 100000 - 1100 = 98900
    }

    function test_Integration_MultipleRounds() public {
        // Round 1: Student claims
        vm.startPrank(student1);
        rateMe.claim(75);
        vm.stopPrank();

        // Fast forward to next round
        vm.warp(block.timestamp + 15 minutes);
        vault.advanceRound();

        // Round 2: Student can claim again
        vm.startPrank(student1);
        rateMe.claim(80);
        vm.stopPrank();

        // Should have tokens from both rounds
        assertEq(rateMe.balanceOf(student1), (75 + 80) * 1e18);
    }

    /* ------------------------------------------------------------------ */
    /*                          Helper Tests                              */
    /* ------------------------------------------------------------------ */

    function test_RateMe_CalculateClaimAmount() public {
        // Test with no NFTs
        (uint256 points, uint256 rateAmount, bool canClaim) = rateMe.calculateClaimAmount(student1, 75);
        assertEq(points, 75);
        assertEq(rateAmount, 75 * 1e18);
        assertTrue(canClaim);

        // Test with NFTs
        address[] memory receivers = new address[](1);
        receivers[0] = student1;
        
        vm.startPrank(sponsor);
        customNFT.mintBatch("ipfs://test", receivers);
        vm.stopPrank();

        (points, rateAmount, canClaim) = rateMe.calculateClaimAmount(student1, 75);
        assertEq(points, 80); // 75 + 5
        assertEq(rateAmount, 80 * 1e18);
        assertTrue(canClaim);

        // Test after claiming
        vm.startPrank(student1);
        rateMe.claim(75);
        vm.stopPrank();

        (points, rateAmount, canClaim) = rateMe.calculateClaimAmount(student1, 75);
        assertEq(points, 0);
        assertEq(rateAmount, 0);
        assertFalse(canClaim);
    }

    function test_RateMe_GetUSDCValue() public {
        assertEq(rateMe.getUSDCValue(0), 0);
        assertEq(rateMe.getUSDCValue(50 * 1e18), 500); // 50 RATE = 500 micro-USDC
        assertEq(rateMe.getUSDCValue(150 * 1e18), 1500); // 150 RATE = 1500 micro-USDC
    }

    function test_RateMe_GetCurrentRoundInfo() public {
        (uint256 currentRoundStart, uint256 timeUntilNext) = rateMe.getCurrentRoundInfo();
        assertEq(currentRoundStart, vault.currentRoundStart());
        assertEq(timeUntilNext, vault.timeUntilNextRound());
    }
} 