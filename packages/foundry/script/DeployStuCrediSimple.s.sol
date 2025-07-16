// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";
import "../contracts/CustomNFT/CustomNFT.sol";
import "../contracts/Vault/Vault.sol";
import "../contracts/RateMe/RateMe.sol";

/**
 * @notice Simple deploy script for StuCredi contracts on Avalanche Fuji testnet
 * @dev Deploys CustomNFT, Vault, and RateMe contracts without complex export functionality
 * 
 * Usage with cast wallet:
 * forge script script/DeployStuCrediSimple.s.sol:DeployStuCrediSimple --broadcast --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --account defaultkey --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' --etherscan-api-key "verifyContract"
 * 
 * Usage with .env PRIVATE_KEY:
 * forge script script/DeployStuCrediSimple.s.sol:DeployStuCrediSimple --broadcast --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --private-key $PRIVATE_KEY --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' --etherscan-api-key "verifyContract"
 */
contract DeployStuCrediSimple is Script {
    // Avalanche Fuji USDC address
    address public constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
    function run() external {
        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Get deployer address
        (, address deployer,) = vm.readCallers();
        
        console.log("=== StuCredi Deployment Starting ===");
        console.log("Deployer address:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("USDC Fuji address:", USDC_FUJI);
        console.log("=====================================");

        // Deploy CustomNFT contract
        CustomNFT customNFT = new CustomNFT();
        console.log("CustomNFT deployed at:", address(customNFT));
        
        // Deploy Vault contract with real USDC address
        Vault vault = new Vault(IERC20(USDC_FUJI));
        console.log("Vault deployed at:", address(vault));
        
        // Deploy RateMe contract with all dependencies
        RateMe rateMe = new RateMe(
            customNFT,
            vault,
            IERC20(USDC_FUJI)
        );
        console.log("RateMe deployed at:", address(rateMe));
        
        console.log("=== Contract Setup ===");
        
        // Setup CustomNFT: Grant SPONSOR_ROLE to RateMe contract
        customNFT.grantRole(customNFT.SPONSOR_ROLE(), address(rateMe));
        console.log("Granted SPONSOR_ROLE to RateMe contract");
        
        // Setup Vault: Grant SPONSOR_ROLE to RateMe contract
        vault.grantRole(vault.SPONSOR_ROLE(), address(rateMe));
        console.log("Granted SPONSOR_ROLE to RateMe contract");
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        console.log("=== Deployment Summary ===");
        console.log("CustomNFT:", address(customNFT));
        console.log("Vault:", address(vault));
        console.log("RateMe:", address(rateMe));
        console.log("USDC Fuji:", USDC_FUJI);
        console.log("==========================");
        
        console.log("=== Next Steps ===");
        console.log("1. Verify contracts on Snowtrace");
        console.log("2. Update deployedContracts.ts in nextjs package");
        console.log("3. Test the contracts using the debug interface");
        console.log("==================");
    }
} 