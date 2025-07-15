// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script, console} from "forge-std/Script.sol";

contract VerifyStuCredi is Script {
    // USDC address for Avalanche Fuji testnet
    address public constant USDC_FUJI = 0x5425890298aed601595a70AB815c96711a31Bc65;
    
    function run() external {
        // Read the deployed contract addresses from broadcast file
        string memory root = vm.projectRoot();
        string memory path = string.concat(
            root, 
            "/broadcast/DeployStuCredi.s.sol/", 
            vm.toString(block.chainid), 
            "/run-latest.json"
        );
        string memory content = vm.readFile(path);
        
        // Parse contract addresses from the broadcast file
        // CustomNFT is the first contract deployed (transaction 0)
        address customNFTAddr = abi.decode(
            vm.parseJson(content, ".transactions[0].contractAddress"), 
            (address)
        );
        
        // Vault is the second contract deployed (transaction 1)
        address vaultAddr = abi.decode(
            vm.parseJson(content, ".transactions[1].contractAddress"), 
            (address)
        );
        
        // RateMe is the third contract deployed (transaction 2)
        address rateMeAddr = abi.decode(
            vm.parseJson(content, ".transactions[2].contractAddress"), 
            (address)
        );
        
        console.log("Verifying StuCredi contracts on Avalanche Fuji:");
        console.log("Chain ID:", block.chainid);
        console.log("CustomNFT at:", customNFTAddr);
        console.log("Vault at:", vaultAddr);
        console.log("RateMe at:", rateMeAddr);
        console.log("USDC Fuji:", USDC_FUJI);
        
        // Verify CustomNFT (no constructor args)
        _verifyCustomNFT(customNFTAddr);
        
        // Verify Vault (constructor arg: USDC address)
        _verifyVault(vaultAddr);
        
        // Verify RateMe (constructor args: CustomNFT, Vault, USDC addresses)
        _verifyRateMe(rateMeAddr, customNFTAddr, vaultAddr);
    }
    
    function _verifyCustomNFT(address contractAddr) internal {
        console.log("Verifying CustomNFT...");
        
        // CustomNFT has no constructor arguments
        string[] memory inputs = new string[](7);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(contractAddr);
        inputs[3] = "contracts/CustomNFT/CustomNFT.sol:CustomNFT";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--watch";
        
        bytes memory result = vm.ffi(inputs);
        console.log("CustomNFT verification result:");
        console.logBytes(result);
    }
    
    function _verifyVault(address contractAddr) internal {
        console.log("Verifying Vault...");
        
        // Vault constructor args: IERC20 _usdc
        bytes memory constructorArgs = abi.encode(USDC_FUJI);
        
        string[] memory inputs = new string[](9);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(contractAddr);
        inputs[3] = "contracts/Vault/Vault.sol:Vault";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--constructor-args";
        inputs[7] = vm.toString(constructorArgs);
        inputs[8] = "--watch";
        
        bytes memory result = vm.ffi(inputs);
        console.log("Vault verification result:");
        console.logBytes(result);
    }
    
    function _verifyRateMe(address contractAddr, address customNFTAddr, address vaultAddr) internal {
        console.log("Verifying RateMe...");
        
        // RateMe constructor args: CustomNFT _nft, Vault _vault, IERC20 _usdc
        bytes memory constructorArgs = abi.encode(customNFTAddr, vaultAddr, USDC_FUJI);
        
        string[] memory inputs = new string[](9);
        inputs[0] = "forge";
        inputs[1] = "verify-contract";
        inputs[2] = vm.toString(contractAddr);
        inputs[3] = "contracts/RateMe/RateMe.sol:RateMe";
        inputs[4] = "--chain";
        inputs[5] = vm.toString(block.chainid);
        inputs[6] = "--constructor-args";
        inputs[7] = vm.toString(constructorArgs);
        inputs[8] = "--watch";
        
        bytes memory result = vm.ffi(inputs);
        console.log("RateMe verification result:");
        console.logBytes(result);
    }
} 