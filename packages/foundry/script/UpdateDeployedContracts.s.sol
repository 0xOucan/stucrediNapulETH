// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

/**
 * @notice Helper script to generate deployedContracts.ts content
 * @dev Run this after deployment to get the TypeScript code for deployedContracts.ts
 * 
 * Usage:
 * forge script script/UpdateDeployedContracts.s.sol:UpdateDeployedContracts --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --account defaultkey
 */
contract UpdateDeployedContracts is Script {
    function run() external {
        // Read the latest deployment broadcast file
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/broadcast/DeployStuCrediSimple.s.sol/43113/run-latest.json");
        
        console.log("=== StuCredi Deployed Contracts ===");
        console.log("Reading from:", path);
        
        try vm.readFile(path) returns (string memory content) {
            // Parse contract addresses from the broadcast file
            address customNFT = abi.decode(vm.parseJson(content, ".transactions[0].contractAddress"), (address));
            address vault = abi.decode(vm.parseJson(content, ".transactions[1].contractAddress"), (address));
            address rateMe = abi.decode(vm.parseJson(content, ".transactions[2].contractAddress"), (address));
            
            console.log("CustomNFT:", customNFT);
            console.log("Vault:", vault);
            console.log("RateMe:", rateMe);
            
            console.log("=== deployedContracts.ts Content ===");
            console.log("Copy this to packages/nextjs/contracts/deployedContracts.ts:");
            console.log("");
            console.log("export const deployedContracts = {");
            console.log("  43113: {");
            console.log("    CustomNFT: {");
            console.log("      address: \"", vm.toString(customNFT), "\",");
            console.log("      abi: [], // Import from generated ABIs");
            console.log("    },");
            console.log("    Vault: {");
            console.log("      address: \"", vm.toString(vault), "\",");
            console.log("      abi: [], // Import from generated ABIs");
            console.log("    },");
            console.log("    RateMe: {");
            console.log("      address: \"", vm.toString(rateMe), "\",");
            console.log("      abi: [], // Import from generated ABIs");
            console.log("    },");
            console.log("  },");
            console.log("} as const;");
            console.log("");
            console.log("=====================================");
            
        } catch {
            console.log("Error: Could not read broadcast file");
            console.log("Make sure you have deployed the contracts first using:");
            console.log("forge script script/DeployStuCrediSimple.s.sol:DeployStuCrediSimple --broadcast ...");
        }
    }
} 