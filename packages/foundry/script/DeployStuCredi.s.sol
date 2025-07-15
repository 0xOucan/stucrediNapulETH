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
    // USDC address for Avalanche Fuji testnet
    address constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
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
        Vault vault = new Vault(IERC20(USDC_FUJI));
        console.logString(
            string.concat(
                "Vault deployed at: ", vm.toString(address(vault))
            )
        );

        // Deploy RateMe contract
        RateMe rateMe = new RateMe(customNFT, vault, IERC20(USDC_FUJI));
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

        // Store deployment information for export
        deployments.push(Deployment({name: "CustomNFT", addr: address(customNFT)}));
        deployments.push(Deployment({name: "Vault", addr: address(vault)}));
        deployments.push(Deployment({name: "RateMe", addr: address(rateMe)}));

        // Log deployment summary
        console.logString("=== StuCredi Deployment Complete ===");
        console.logString(string.concat("CustomNFT: ", vm.toString(address(customNFT))));
        console.logString(string.concat("Vault: ", vm.toString(address(vault))));
        console.logString(string.concat("RateMe: ", vm.toString(address(rateMe))));
        console.logString(string.concat("USDC Fuji: ", vm.toString(USDC_FUJI)));
        console.logString("=====================================");
    }
} 