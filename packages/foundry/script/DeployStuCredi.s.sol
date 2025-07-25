// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./DeployHelpers.s.sol";
import "../contracts/CustomNFT/CustomNFT.sol";
import "../contracts/Vault/Vault.sol";
import "../contracts/RateMe/RateMe.sol";

/**
 * @notice Deploy script for StuCredi contracts on Avalanche Fuji testnet
 * @dev Deploys CustomNFT, Vault, and RateMe contracts in correct order
 * 
 * Usage with cast wallet:
 * forge script script/DeployStuCredi.s.sol:DeployStuCredi --broadcast --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --account defaultkey --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' --etherscan-api-key "verifyContract"
 * 
 * Usage with .env PRIVATE_KEY:
 * forge script script/DeployStuCredi.s.sol:DeployStuCredi --broadcast --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --private-key $PRIVATE_KEY --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' --etherscan-api-key "verifyContract"
 */
contract DeployStuCredi is ScaffoldETHDeploy {
    // Avalanche Fuji USDC address
    address public constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
    // NFT metadata from your NFT folder
    string public constant NFT_NAME = "StuCredi Activity Proof";
    string public constant NFT_SYMBOL = "STUCREDIT";
    
    /**
     * @dev Deployer setup using cast wallet keystore or .env PRIVATE_KEY
     * Note: Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and fund it
     *      - Export contract addresses & ABIs to `nextjs` packages
     */
    function run() external ScaffoldEthDeployerRunner {
        console.log("=== StuCredi Deployment Starting ===");
        console.log("Deployer address:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("USDC Fuji address:", USDC_FUJI);
        console.log("=====================================");

        // Deploy CustomNFT contract
        CustomNFT customNFT = new CustomNFT();
        console.log("CustomNFT deployed at:", address(customNFT));
        
        // Store deployment for export
        deployments.push(
            Deployment({
                name: "CustomNFT",
                addr: address(customNFT)
            })
        );

        // Deploy Vault contract with real USDC address
        Vault vault = new Vault(IERC20(USDC_FUJI));
        console.log("Vault deployed at:", address(vault));
        
        // Store deployment for export
        deployments.push(
            Deployment({
                name: "Vault",
                addr: address(vault)
            })
        );

        // Deploy RateMe contract with all dependencies
        RateMe rateMe = new RateMe(
            customNFT,
            vault,
            IERC20(USDC_FUJI)
        );
        console.log("RateMe deployed at:", address(rateMe));
        
        // Store deployment for export
        deployments.push(
            Deployment({
                name: "RateMe",
                addr: address(rateMe)
            })
        );

        console.log("=== Contract Setup ===");
        
        // Setup CustomNFT: Grant SPONSOR_ROLE to RateMe contract
        customNFT.grantRole(customNFT.SPONSOR_ROLE(), address(rateMe));
        console.log("Granted SPONSOR_ROLE to RateMe contract");
        
        // Setup Vault: Grant SPONSOR_ROLE to RateMe contract
        vault.grantRole(vault.SPONSOR_ROLE(), address(rateMe));
        console.log("Granted SPONSOR_ROLE to RateMe contract");
        
        console.log("=== Deployment Summary ===");
        console.log("CustomNFT:", address(customNFT));
        console.log("Vault:", address(vault));
        console.log("RateMe:", address(rateMe));
        console.log("USDC Fuji:", USDC_FUJI);
        console.log("==========================");
        
        // Export deployments for nextjs
        console.log("Exporting deployments...");
        exportDeployments();
    }
} 