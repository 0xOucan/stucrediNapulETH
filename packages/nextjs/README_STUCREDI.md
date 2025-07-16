# 🎓 StuCredi Frontend Implementation

## Overview

This implementation provides a complete frontend interface for the StuCredi platform with three main sections:

1. **Landing Page** (`/`) - Project overview and navigation
2. **Student Interface** (`/student`) - Grade submission and token management
3. **Sponsor Interface** (`/sponsor`) - Role management and system administration

## 🚀 Getting Started

### Prerequisites
- Wallet connected to Avalanche Fuji testnet
- AVAX tokens for gas fees
- Appropriate roles assigned (see Role Management below)

### Starting the Application
```bash
cd packages/nextjs
yarn dev
```

Visit `http://localhost:3000` to access the landing page.

## 🏗️ Architecture

### Components Structure
```
components/stucredi/
├── shared/
│   ├── StatsCard.tsx          # Metric display cards
│   ├── ActionCard.tsx         # Action buttons with descriptions
│   ├── RoleChecker.tsx        # Permission validation
│   ├── NFTBalance.tsx         # NFT count and points display
│   ├── TokenBalance.tsx       # RATE/USDC balance display
│   └── TransactionStatus.tsx  # Transaction feedback
└── index.ts                   # Component exports
```

### Hooks
```
hooks/stucredi/
├── useContractPermissions.ts  # Role and permission management
└── index.ts                   # Hook exports
```

## 🎯 User Interfaces

### 1. Landing Page (`/`)
- **Purpose**: Project overview and role-based navigation
- **Features**:
  - Project description and token economics
  - Contract address verification links
  - Role-based navigation buttons
  - Admin/Sponsor badge for deployer address
  - Links to debug and block explorer tools

### 2. Student Interface (`/student`)
- **Access**: Requires `STUDENT_ROLE`
- **Features**:
  - NFT balance and points calculation
  - RATE token balance display
  - Grade submission (1-100) with preview
  - Token redemption (RATE → USDC)
  - Round timer and claim status
  - Transaction history and feedback

#### Student Workflow:
1. Check NFT balance and points
2. Submit academic grade
3. Receive RATE tokens based on grade + NFT bonus
4. Redeem RATE tokens for USDC

### 3. Sponsor Interface (`/sponsor`)
- **Access**: Requires `SPONSOR_ROLE` or is deployer address
- **Features**:
  - System overview dashboard
  - Student role management
  - NFT minting to multiple addresses
  - Vault funding with USDC
  - Round management
  - Funding stream monitoring

#### Sponsor Workflow:
1. Grant `STUDENT_ROLE` to student addresses
2. Mint NFTs to students for event participation
3. Fund vault with USDC for token redemptions
4. Monitor system metrics and student activity

## 🔐 Role Management

### Roles and Permissions

#### STUDENT_ROLE
- **Contract**: RateMe
- **Permissions**: 
  - Submit grades and claim RATE tokens
  - Redeem RATE tokens for USDC
- **Granted by**: Sponsors or Admin

#### SPONSOR_ROLE
- **Contract**: CustomNFT
- **Permissions**:
  - Mint NFTs to students
  - Grant STUDENT_ROLE to addresses
  - Fund vault with USDC
- **Pre-granted to**: Deployer address (`0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`)

#### Admin (Deployer)
- **Address**: `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`
- **Permissions**: All sponsor permissions + system administration

## 💰 Token Economics

### RATE Token System
- **1 RATE** = 10 micro-USDC = 0.000010 USDC
- **Points Calculation**: Grade (1-100) + (NFTs × 5)
- **Minimum Points**: 50
- **Maximum Points**: 150
- **Max per Round**: 150 RATE tokens

### Round System
- **Duration**: 15 minutes per round
- **Claiming**: Once per round per student
- **Limits**: Maximum 150 RATE tokens per round

### NFT Bonus
- **Points per NFT**: 5 points
- **Purpose**: Reward event participation
- **Minting**: Sponsors can mint to multiple addresses

## 🔧 Contract Addresses (Avalanche Fuji)

- **CustomNFT**: `0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`
- **Vault**: `0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`
- **RateMe**: `0x79e043686cce3ee4cd66fc2dbe15fda812da5285`
- **USDC Fuji**: `0x5425890298aed601595a70AB815c96711a31Bc65`

All contracts are verified on [Snowtrace](https://testnet.snowtrace.io/).

## 🧪 Testing Guide

### For Students:
1. Get `STUDENT_ROLE` from a sponsor
2. Check NFT balance on student interface
3. Submit grade (1-100) to claim RATE tokens
4. Redeem RATE tokens for USDC

### For Sponsors:
1. Access sponsor interface (auto-granted if deployer)
2. Grant `STUDENT_ROLE` to test addresses
3. Mint NFTs to students for participation
4. Fund vault with USDC for redemptions
5. Monitor system metrics

### Debug Interface:
- Visit `/debug` for direct contract interaction
- Test all contract functions
- Monitor transaction history
- Debug permission issues

## 🔍 Troubleshooting

### Common Issues:

1. **"Permission Denied"**
   - Check wallet connection
   - Verify role assignments
   - Ensure correct network (Avalanche Fuji)

2. **"Transaction Failed"**
   - Check AVAX balance for gas
   - Verify contract interactions
   - Check round limits and timing

3. **"Already Claimed This Round"**
   - Wait for next round (15 minutes)
   - Check round timer on interface

4. **"Invalid Grade"**
   - Enter grade between 1-100
   - Ensure numeric input only

### Getting Help:
- Use debug interface for direct contract testing
- Check transaction hashes on Snowtrace
- Verify contract addresses and network
- Review role assignments and permissions

## 🎨 Styling

The interface uses Scaffold-ETH's DaisyUI theme with:
- Responsive design for mobile/desktop
- Consistent color scheme and typography
- Loading states and animations
- Error handling with user feedback
- Accessibility considerations

## 🚀 Future Enhancements

Potential improvements:
- Real-time USDC balance updates
- Transaction history tracking
- Batch operations for sponsors
- Advanced analytics dashboard
- Mobile-optimized interface
- Multi-language support

---

**Built with ❤️ for NapulETH Hackathon using Scaffold-ETH 2** 