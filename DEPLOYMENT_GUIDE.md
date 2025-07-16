# 🚀 StuCredi Deployment Guide - Avalanche Fuji Testnet

This guide will help you deploy the StuCredi contracts to Avalanche Fuji testnet using Foundry and Cast wallet management.

> **✅ Status**: StuCredi contracts are successfully deployed and verified on Avalanche Fuji testnet! See [Contract Addresses](#-contract-addresses) section for verified links.

## 📋 Prerequisites

- [x] Foundry installed
- [x] **Option 1**: Cast wallet with keystore name "defaultkey" 
- [x] **Option 2**: `.env` file with `PRIVATE_KEY` (without 0x prefix)
- [x] Wallet address: `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`
- [x] AVAX tokens for gas fees on Fuji testnet
- [x] Network: Avalanche Fuji (Chain ID: 43113)
- [x] USDC Fuji address: `0x5425890298aed601595a70AB815c96711a31Bc65`

## 🔐 Wallet Setup Options

### Option 1: Cast Wallet (Recommended)
Already configured with keystore name "defaultkey"

### Option 2: Environment Variables
Create a `.env` file in the `packages/foundry/` directory:

```env
# Private key without 0x prefix
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**⚠️ Important**: Never commit your `.env` file to version control!

## 🔧 Setup Commands

### 1. Test Your Setup First

```bash
# Navigate to foundry directory
cd packages/foundry

# Test your wallet and network connection (with cast wallet)
forge script script/TestSetup.s.sol:TestSetup \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey

# OR with .env PRIVATE_KEY
forge script script/TestSetup.s.sol:TestSetup \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --private-key $PRIVATE_KEY
```

**Expected Output:**
```
=== StuCredi Setup Test ===
Network: Avalanche Fuji
Chain ID: 43113
Block number: [CURRENT_BLOCK]
Deployer address: 0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45
Deployer balance: [YOUR_AVAX_BALANCE]
USDC Fuji address: 0x5425890298aed601595a70AB815c96711a31Bc65
===========================
✅ All checks passed! Ready to deploy StuCredi contracts.
```

### 2. Deploy StuCredi Contracts

**Option A: Simple Deployment (Recommended)**

```bash
# Deploy with verification (with cast wallet)
forge script script/DeployStuCrediSimple.s.sol:DeployStuCrediSimple \
  --broadcast \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey \
  --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' \
  --etherscan-api-key "verifyContract"

# OR with .env PRIVATE_KEY
forge script script/DeployStuCrediSimple.s.sol:DeployStuCrediSimple \
  --broadcast \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --private-key $PRIVATE_KEY \
  --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' \
  --etherscan-api-key "verifyContract"
```

**Option B: Full ScaffoldETH Integration**

```bash
# Deploy with verification (with cast wallet)
forge script script/DeployStuCredi.s.sol:DeployStuCredi \
  --broadcast \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey \
  --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' \
  --etherscan-api-key "verifyContract"

# OR with .env PRIVATE_KEY
forge script script/DeployStuCredi.s.sol:DeployStuCredi \
  --broadcast \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --private-key $PRIVATE_KEY \
  --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' \
  --etherscan-api-key "verifyContract"
```

**Expected Output:**
```
=== StuCredi Deployment Starting ===
Deployer address: 0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45
Chain ID: 43113
USDC Fuji address: 0x5425890298aed601595a70AB815c96711a31Bc65
=====================================
CustomNFT deployed at: [CUSTOM_NFT_ADDRESS]
Vault deployed at: [VAULT_ADDRESS]
RateMe deployed at: [RATE_ME_ADDRESS]
RateMe contract address set in Vault
SPONSOR_ROLE granted to deployer
=== StuCredi Deployment Complete ===
```

### 3. Update deployedContracts.ts (For Simple Deployment)

If you used the simple deployment, update the frontend contracts:

```bash
# Generate deployedContracts.ts content
forge script script/UpdateDeployedContracts.s.sol:UpdateDeployedContracts \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey

# Copy the output to packages/nextjs/contracts/deployedContracts.ts
```

### 4. Manual Verification (if needed)

If automatic verification fails, run manual verification:

```bash
# Verify all contracts (with cast wallet)
forge script script/VerifyStuCredi.s.sol:VerifyStuCredi \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey

# OR with .env PRIVATE_KEY
forge script script/VerifyStuCredi.s.sol:VerifyStuCredi \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --private-key $PRIVATE_KEY
```

## 📊 Contract Addresses

**✅ Verified Contracts on Avalanche Fuji Testnet:**

- **CustomNFT**: [`0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55)
- **Vault**: [`0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e)
- **RateMe**: [`0x79e043686cce3ee4cd66fc2dbe15fda812da5285`](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285)
- **USDC Fuji**: [`0x5425890298aed601595a70AB815c96711a31Bc65`](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65)

## 🔍 Verification on Snowtrace

**✅ All contracts are verified and ready to use!**

1. **CustomNFT**: [View on Snowtrace](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55) - ✅ Verified
2. **Vault**: [View on Snowtrace](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e) - ✅ Verified  
3. **RateMe**: [View on Snowtrace](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) - ✅ Verified

All contracts compiled with Solidity 0.8.30 and 200 optimization runs.

## 🧪 Testing the Deployed Contracts

### 1. Get Some USDC Fuji Tokens

You'll need USDC tokens to test the full flow. You can:
- Use the USDC Fuji faucet (if available)
- Or swap some AVAX for USDC on a DEX

### 2. Test NFT Minting

```bash
# Example: Mint NFT to a student address
cast send 0xa4ba4e9270bde8fbbf4328925959287a72ba0a55 \
  "mintBatch(string,address[])" \
  "ipfs://bafkreih37mogwuw4owrgozpsdfhgcesepydc3cr7mupyzi5tckmkfucy5q" \
  "[0xSTUDENT_ADDRESS]" \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey
```

### 3. Test Vault Funding

```bash
# First approve USDC spending
cast send 0x5425890298aed601595a70AB815c96711a31Bc65 \
  "approve(address,uint256)" \
  0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e \
  100000 \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey

# Then fund the vault
cast send 0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e \
  "fundStream(uint256,uint256)" \
  100000 \
  1500 \
  --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com \
  --account defaultkey
```

## 📁 Contract Details

### CustomNFT
- **Name**: "ActivityProof"
- **Symbol**: "ACTPOAP"
- **Points per NFT**: 5
- **Metadata URI**: `ipfs://bafkreih37mogwuw4owrgozpsdfhgcesepydc3cr7mupyzi5tckmkfucy5q`

### Vault
- **USDC Token**: `0x5425890298aed601595a70AB815c96711a31Bc65`
- **Round Duration**: 15 minutes
- **Max per Round**: 1500 micro-USDC (0.0015 USDC)

### RateMe
- **Name**: "RateToken"
- **Symbol**: "RATE"
- **Decimals**: 18
- **Conversion**: 1 RATE = 0.000010 USDC

## 🔧 Token Economics

- **1 RATE** = 1 point = 0.000010 USDC
- **Minimum funding**: 50 RATE (0.000500 USDC)
- **Maximum funding**: 150 RATE (0.001500 USDC)
- **Each NFT**: 5 points
- **Grade range**: 1-100 points

## 🚨 Troubleshooting

### Common Issues:

1. **"Insufficient balance"**: Make sure you have AVAX for gas fees
2. **"Invalid chain"**: Verify you're connected to Avalanche Fuji (43113)
3. **"Verification failed"**: Run manual verification script
4. **"Account not found"**: Check your cast wallet setup

### Verify Cast Wallet:
```bash
cast wallet list
cast wallet address --account defaultkey
```

## 🎯 Next Steps

1. **Frontend Integration**: Update your NextJS app with the deployed contract addresses
2. **Testing**: Use the debug interface to test all functions
3. **NFT Metadata**: Upload your NFT metadata to IPFS
4. **Mainnet Deployment**: Once tested, deploy to Avalanche mainnet

## 📞 Support

If you encounter issues:
1. Check the Foundry documentation
2. Verify your network connection
3. Ensure your wallet has sufficient AVAX
4. Check the contract addresses are correct

---

**Happy Deploying! 🚀** 