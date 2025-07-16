// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

/**
 * @notice Test script to verify wallet and network setup
 * @dev Run this before deploying to verify everything is working
 * 
 * Usage with cast wallet:
 * forge script script/TestSetup.s.sol:TestSetup --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --account defaultkey
 * 
 * Usage with .env PRIVATE_KEY:
 * forge script script/TestSetup.s.sol:TestSetup --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --private-key $PRIVATE_KEY
 */
contract TestSetup is Script {
    // Avalanche Fuji USDC address
    address public constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
    function run() external {
        // Start broadcasting to get deployer info
        vm.startBroadcast();
        (, address deployer,) = vm.readCallers();
        vm.stopBroadcast();
        
        console.log("=== StuCredi Setup Test ===");
        console.log("Network: Avalanche Fuji");
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        console.log("USDC Fuji address:", USDC_FUJI);
        console.log("===========================");
        
        // Verify we're on Avalanche Fuji (Chain ID 43113)
        require(block.chainid == 43113, "Not on Avalanche Fuji testnet");
        
        // Verify deployer has some AVAX for gas
        require(deployer.balance > 0, "Deployer has no AVAX for gas");
        
        console.log("All checks passed! Ready to deploy StuCredi contracts.");
    }
} 