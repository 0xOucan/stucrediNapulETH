// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./DeployHelpers.s.sol";
import "../contracts/CustomNFT/CustomNFT.sol";
import "../contracts/Vault/Vault.sol";
import "../contracts/RateMe/RateMe.sol";

/**
 * @notice Deploy script for StuCredi contracts
 * @dev Deploys CustomNFT, Vault, and RateMe contracts in correct order
 * Example:
 * yarn deploy --file DeployStuCredi.s.sol  # local anvil chain
 * yarn deploy --file DeployStuCredi.s.sol --network optimism # live network (requires keystore)
 */
contract DeployStuCredi is ScaffoldETHDeploy {
    // Mock USDC address for testing (replace with real USDC on mainnet)
    address constant MOCK_USDC = 0xA0b86A33e6441d9d1E2D5F5b4B5e5E5e5e5E5e5e; // Replace with actual USDC
    
    error InvalidAddress();

    function run() external ScaffoldEthDeployerRunner {
        // Deploy CustomNFT contract
        CustomNFT customNFT = new CustomNFT();
        console.logString(
            string.concat(
                "CustomNFT deployed at: ", vm.toString(address(customNFT))
            )
        );

        // Deploy Vault contract with USDC address
        // Note: On mainnet, use real USDC address: 0xA0b86a33E6441d9d1E2D5F5B4B5e5e5e5e5e5e5e
        Vault vault = new Vault(IERC20(MOCK_USDC));
        console.logString(
            string.concat(
                "Vault deployed at: ", vm.toString(address(vault))
            )
        );

        // Deploy RateMe contract
        RateMe rateMe = new RateMe(customNFT, vault, IERC20(MOCK_USDC));
        console.logString(
            string.concat(
                "RateMe deployed at: ", vm.toString(address(rateMe))
            )
        );

        // Set RateMe contract address in Vault
        vault.setRateTokenContract(address(rateMe));
        console.logString("RateMe contract address set in Vault");

        // Grant SPONSOR_ROLE to deployer for testing
        bytes32 sponsorRole = customNFT.SPONSOR_ROLE();
        customNFT.grantRole(sponsorRole, deployer);
        console.logString("SPONSOR_ROLE granted to deployer");

        // Log deployment summary
        console.logString("=== StuCredi Deployment Complete ===");
        console.logString(string.concat("CustomNFT: ", vm.toString(address(customNFT))));
        console.logString(string.concat("Vault: ", vm.toString(address(vault))));
        console.logString(string.concat("RateMe: ", vm.toString(address(rateMe))));
        console.logString(string.concat("Mock USDC: ", vm.toString(MOCK_USDC)));
        console.logString("=====================================");
    }
} 