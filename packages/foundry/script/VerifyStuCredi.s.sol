// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

/**
 * @notice Verification script for StuCredi contracts on Avalanche Fuji testnet
 * @dev Verifies all three contracts: CustomNFT, Vault, and RateMe
 * 
 * Usage with cast wallet:
 * forge script script/VerifyStuCredi.s.sol:VerifyStuCredi --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --account defaultkey
 * 
 * Usage with .env PRIVATE_KEY:
 * forge script script/VerifyStuCredi.s.sol:VerifyStuCredi --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --private-key $PRIVATE_KEY
 */
contract VerifyStuCredi is Script {
    // Avalanche Fuji USDC address
    address public constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
    function run() external {
        // Read the deployed contract addresses from broadcast file
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/broadcast/DeployStuCredi.s.sol/", vm.toString(block.chainid), "/run-latest.json");
        string memory content = vm.readFile(path);
        
        console.log("=== StuCredi Contract Verification ===");
        console.log("Chain ID:", block.chainid);
        console.log("USDC Fuji address:", USDC_FUJI);
        console.log("=======================================");
        
        // Verify CustomNFT contract (no constructor args)
        _verifyCustomNFT(content);
        
        // Verify Vault contract (constructor: USDC address)
        _verifyVault(content);
        
        // Verify RateMe contract (constructor: CustomNFT, Vault, USDC addresses)
        _verifyRateMe(content);
        
        console.log("=== Verification Complete ===");
    }
    
    function _verifyCustomNFT(string memory content) internal {
        // CustomNFT is typically the first contract deployed (transaction index 0)
        address customNFTAddr = abi.decode(vm.parseJson(content, ".transactions[0].contractAddress"), (address));
        
        console.log("Verifying CustomNFT at:", customNFTAddr);
        
        // CustomNFT has no constructor arguments
        string[] memory inputs = new string[](8);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(customNFTAddr);
        inputs[3] = "contracts/CustomNFT/CustomNFT.sol:CustomNFT";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--verifier-url";
        inputs[7] = "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan";
        
        bytes memory result = vm.ffi(inputs);
        console.log("CustomNFT verification result:", string(result));
    }
    
    function _verifyVault(string memory content) internal {
        // Vault is typically the second contract deployed (transaction index 1)
        address vaultAddr = abi.decode(vm.parseJson(content, ".transactions[1].contractAddress"), (address));
        
        console.log("Verifying Vault at:", vaultAddr);
        
        // Vault constructor arguments: IERC20 _usdcToken
        string[] memory inputs = new string[](10);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(vaultAddr);
        inputs[3] = "contracts/Vault/Vault.sol:Vault";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--verifier-url";
        inputs[7] = "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan";
        inputs[8] = "--constructor-args";
        inputs[9] = vm.toString(abi.encode(USDC_FUJI));
        
        bytes memory result = vm.ffi(inputs);
        console.logBytes(result);
    }
    
    function _verifyRateMe(string memory content) internal {
        // RateMe is typically the third contract deployed (transaction index 2)
        address rateMeAddr = abi.decode(vm.parseJson(content, ".transactions[2].contractAddress"), (address));
        
        // Get the other contract addresses for constructor args
        address customNFTAddr = abi.decode(vm.parseJson(content, ".transactions[0].contractAddress"), (address));
        address vaultAddr = abi.decode(vm.parseJson(content, ".transactions[1].contractAddress"), (address));
        
        console.log("Verifying RateMe at:", rateMeAddr);
        
        // RateMe constructor arguments: CustomNFT _customNFT, Vault _vault, IERC20 _usdcToken
        string[] memory inputs = new string[](10);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(rateMeAddr);
        inputs[3] = "contracts/RateMe/RateMe.sol:RateMe";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--verifier-url";
        inputs[7] = "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan";
        inputs[8] = "--constructor-args";
        inputs[9] = vm.toString(abi.encode(customNFTAddr, vaultAddr, USDC_FUJI));
        
        bytes memory result = vm.ffi(inputs);
        console.logBytes(result);
    }
} 