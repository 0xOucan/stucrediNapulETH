# 🖥️ StuCredi Frontend Setup - Avalanche Fuji Testnet

This guide explains how to configure and use the StuCredi frontend with the deployed contracts on Avalanche Fuji testnet.

## 🔧 Configuration Changes Made

### 1. **scaffold.config.ts Updated**

```typescript
// Changed from local foundry to Avalanche Fuji
targetNetworks: [chains.avalancheFuji],

// Added custom RPC endpoint
rpcOverrides: {
  [chains.avalancheFuji.id]: "https://avalanche-fuji-c-chain-rpc.publicnode.com",
},

// Enabled external wallets (MetaMask, etc.)
onlyLocalBurnerWallet: false,
```

### 2. **deployedContracts.ts Updated**

Added all verified contracts for Avalanche Fuji (Chain ID: 43113):

- **CustomNFT**: `0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`
- **Vault**: `0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`
- **RateMe**: `0x79e043686cce3ee4cd66fc2dbe15fda812da5285`

## 🚀 Starting the Frontend

### 1. **Install Dependencies**
```bash
cd packages/nextjs
yarn install
```

### 2. **Start Development Server**
```bash
yarn dev
```

### 3. **Access the Application**
- **Frontend**: http://localhost:3000
- **Debug Interface**: http://localhost:3000/debug

## 🔍 Debug Interface Usage

The debug interface at `/debug` allows you to:

### **CustomNFT Contract**
- **Read Functions**:
  - `name()` - Returns "ActivityProof"
  - `symbol()` - Returns "ACTPOAP"
  - `SPONSOR_ROLE()` - Get sponsor role hash
  - `POINTS_PER_NFT()` - Returns 5
  - `totalSupply()` - Current NFT count
  - `balanceOf(address)` - NFT balance of address

- **Write Functions**:
  - `grantRole(role, account)` - Grant SPONSOR_ROLE
  - `mintBatch(uri, recipients)` - Mint NFTs to multiple addresses

### **Vault Contract**
- **Read Functions**:
  - `usdc()` - USDC token address
  - `rateTokenContract()` - RateMe contract address
  - `ROUND_DURATION()` - 900 seconds (15 minutes)
  - `MAX_PER_ROUND()` - 1500 micro-USDC
  - `getCurrentRound()` - Current round number
  - `totalBalance()` - Total USDC in vault
  - `getStream(sponsor)` - Sponsor's stream info

- **Write Functions**:
  - `fundStream(total, perRound)` - Fund vault with USDC
  - `setRateTokenContract(address)` - Set RateMe contract
  - `advanceRound()` - Manually advance round

### **RateMe Contract**
- **Read Functions**:
  - `name()` - Returns "RateToken"
  - `symbol()` - Returns "RATE"
  - `STUDENT_ROLE()` - Get student role hash
  - `POINTS_MIN()` - Returns 50
  - `POINTS_MAX()` - Returns 150
  - `POINTS_PER_NFT()` - Returns 5
  - `balanceOf(address)` - RATE token balance
  - `calculateClaimAmount(student, grade)` - Calculate claimable tokens

- **Write Functions**:
  - `grantRole(role, account)` - Grant STUDENT_ROLE
  - `claim(grade)` - Claim RATE tokens
  - `redeem(rateAmount, sponsor)` - Redeem RATE for USDC

## 🌐 Wallet Connection

### **Supported Wallets**
- MetaMask
- WalletConnect compatible wallets
- Rainbow Wallet
- Coinbase Wallet

### **Network Configuration**
Users need to add Avalanche Fuji to their wallet:

- **Network Name**: Avalanche Fuji Testnet
- **RPC URL**: https://avalanche-fuji-c-chain-rpc.publicnode.com
- **Chain ID**: 43113
- **Currency Symbol**: AVAX
- **Block Explorer**: https://testnet.snowtrace.io/

## 🧪 Testing Workflow

### **Complete Test Flow**:

1. **Connect Wallet** to Avalanche Fuji testnet
2. **Grant SPONSOR_ROLE** to your address (CustomNFT)
3. **Mint NFT** to student address (CustomNFT)
4. **Fund Vault** with USDC (Vault)
5. **Configure RateMe** contract in Vault
6. **Grant STUDENT_ROLE** to student (RateMe)
7. **Claim RATE tokens** as student (RateMe)
8. **Redeem RATE for USDC** as student (RateMe)

### **Debug Interface Benefits**:
- **Real-time contract interaction**
- **Automatic ABI parsing**
- **Transaction history**
- **Event monitoring**
- **Error handling**

## 🔧 Troubleshooting

### **Common Issues**:

1. **"Wrong Network"**:
   - Ensure wallet is connected to Avalanche Fuji
   - Check Chain ID is 43113

2. **"Contract Not Found"**:
   - Verify contract addresses in deployedContracts.ts
   - Check network configuration

3. **"Transaction Fails"**:
   - Ensure sufficient AVAX for gas
   - Check contract permissions/roles

4. **"RPC Error"**:
   - Try alternative RPC: https://api.avax-test.network/ext/bc/C/rpc

### **Verification Steps**:
```bash
# Check if contracts are accessible
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xa4ba4e9270bde8fbbf4328925959287a72ba0a55","latest"],"id":1}' \
  https://avalanche-fuji-c-chain-rpc.publicnode.com
```

## 📊 Contract Addresses Reference

| Contract | Address | Snowtrace Link |
|----------|---------|----------------|
| CustomNFT | `0xa4ba4e9270bde8fbbf4328925959287a72ba0a55` | [View](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55) |
| Vault | `0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e` | [View](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e) |
| RateMe | `0x79e043686cce3ee4cd66fc2dbe15fda812da5285` | [View](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) |
| USDC Fuji | `0x5425890298aed601595a70AB815c96711a31Bc65` | [View](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65) |

## 🎯 Next Steps

1. **Start the frontend**: `yarn dev`
2. **Visit debug interface**: http://localhost:3000/debug
3. **Connect your wallet** to Avalanche Fuji
4. **Follow the testing workflow** above
5. **Monitor transactions** on Snowtrace

---

**Ready to debug and test! 🚀**

For detailed testing scenarios, see [TESTING_GUIDE.md](TESTING_GUIDE.md). 