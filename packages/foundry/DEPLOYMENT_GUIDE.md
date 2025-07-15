# 🚀 StuCredi Deployment Guide - Avalanche Fuji Testnet

This guide will help you deploy the StuCredi contracts to Avalanche Fuji testnet using Foundry with cast wallet management.

## 📋 Prerequisites

1. **Foundry installed** - [Installation Guide](https://book.getfoundry.sh/getting-started/installation)
2. **AVAX Fuji testnet tokens** - Get from [Avalanche Faucet](https://faucet.avax.network/)
3. **Private key** - For your deployment wallet

## 🔐 Step 1: Set up Cast Wallet (Recommended)

### Option A: Import existing private key to cast wallet
```bash
# Import your private key to cast wallet (secure method)
cast wallet import deployer --interactive

# This will prompt you to enter your private key and set a password
# The wallet will be stored encrypted locally
```

### Option B: Create new wallet with cast
```bash
# Create a new wallet
cast wallet new

# Import the generated private key
cast wallet import deployer --interactive
```

### Verify wallet setup
```bash
# List your wallets
cast wallet list

# Check wallet address
cast wallet address --account deployer
```

## 🌐 Step 2: Get Fuji Testnet Tokens

1. Get your wallet address: `cast wallet address --account deployer`
2. Visit [Avalanche Faucet](https://faucet.avax.network/)
3. Request AVAX tokens for your address
4. Wait for confirmation

## 🚀 Step 3: Deploy Contracts

### Deploy to Avalanche Fuji
```bash
# Deploy using cast wallet (secure - no private key exposure)
forge script script/DeployStuCredi.s.sol \
  --rpc-url avalancheFuji \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --broadcast \
  --verify \
  -vvvv
```

### Alternative: Deploy using environment variable (less secure)
```bash
# Set environment variable (temporary)
export PRIVATE_KEY="your_private_key_here"

# Deploy using private key
forge script script/DeployStuCredi.s.sol \
  --rpc-url avalancheFuji \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv
```

## 📄 Step 4: Verify Contracts (if auto-verify fails)

If automatic verification fails during deployment, run manual verification:

```bash
# Verify contracts manually
forge script script/VerifyStuCredi.s.sol \
  --rpc-url avalancheFuji \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --broadcast \
  -vvvv
```

## 📊 Step 5: Check Deployment

After successful deployment, you'll see output like:
```
CustomNFT deployed at: 0x...
Vault deployed at: 0x...
RateMe deployed at: 0x...
USDC Fuji: 0x5425890298aed601595a70AB815c96711a31Bc65
```

### Verify on Snowtrace
1. Visit [Avalanche Fuji Testnet Explorer](https://testnet.snowtrace.io/)
2. Search for your contract addresses
3. Verify the contracts are deployed and verified

## 🔧 Step 6: Test Deployment

### Basic contract interaction tests
```bash
# Check CustomNFT deployment
cast call [CUSTOM_NFT_ADDRESS] "name()" --rpc-url avalancheFuji

# Check Vault deployment
cast call [VAULT_ADDRESS] "usdc()" --rpc-url avalancheFuji

# Check RateMe deployment
cast call [RATE_ME_ADDRESS] "symbol()" --rpc-url avalancheFuji
```

## 📝 Step 7: Update Frontend Configuration

Update your frontend configuration with the deployed contract addresses:

```typescript
// packages/nextjs/contracts/deployedContracts.ts
export const deployedContracts = {
  43113: { // Avalanche Fuji chain ID
    CustomNFT: {
      address: "0x...", // Your deployed CustomNFT address
      abi: [...] // ABI will be auto-generated
    },
    Vault: {
      address: "0x...", // Your deployed Vault address
      abi: [...]
    },
    RateMe: {
      address: "0x...", // Your deployed RateMe address
      abi: [...]
    }
  }
};
```

## 🎯 Key Information

### Network Details
- **Network**: Avalanche Fuji Testnet
- **Chain ID**: 43113
- **RPC URL**: https://avalanche-fuji-c-chain-rpc.publicnode.com
- **Block Explorer**: https://testnet.snowtrace.io/
- **USDC Contract**: 0x5425890298aed601595a70AB815c96711a31Bc65

### Contract Addresses (after deployment)
- **CustomNFT**: `[Will be shown after deployment]`
- **Vault**: `[Will be shown after deployment]`
- **RateMe**: `[Will be shown after deployment]`

### NFT Metadata
- **IPFS Hash**: `bafybeibeany5oa5fi4ois7januptullox4adrjan6yx4ef7pew6tb4h3za`
- **Metadata IPFS**: `bafkreih37mogwuw4owrgozpsdfhgcesepydc3cr7mupyzi5tckmkfucy5q`
- **Image URL**: `ipfs://bafybeibeany5oa5fi4ois7januptullox4adrjan6yx4ef7pew6tb4h3za`

## 🛠 Troubleshooting

### Common Issues

1. **Insufficient funds**: Make sure you have enough AVAX for gas fees
2. **RPC issues**: Try alternative RPC: `https://api.avax-test.network/ext/bc/C/rpc`
3. **Verification fails**: Run manual verification script
4. **Cast wallet issues**: Ensure wallet is properly imported and unlocked

### Gas Optimization
```bash
# Estimate gas before deployment
forge script script/DeployStuCredi.s.sol \
  --rpc-url avalancheFuji \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --gas-estimate
```

### Debug Mode
Add `-vvvv` flag for verbose output to debug issues:
```bash
forge script script/DeployStuCredi.s.sol \
  --rpc-url avalancheFuji \
  --account deployer \
  --sender $(cast wallet address --account deployer) \
  --broadcast \
  -vvvv
```

## 🔒 Security Best Practices

1. **Never expose private keys** in scripts or environment variables in production
2. **Use cast wallet** for secure key management
3. **Verify contracts** on block explorer after deployment
4. **Test thoroughly** on testnet before mainnet deployment
5. **Keep deployment logs** for reference

## 🎉 Next Steps

After successful deployment:
1. Update your frontend with new contract addresses
2. Test the full application flow
3. Share contract addresses with your team
4. Prepare for mainnet deployment (if needed)

---

**Need help?** Check the [Foundry Book](https://book.getfoundry.sh/) or [Avalanche Documentation](https://docs.avax.network/) 