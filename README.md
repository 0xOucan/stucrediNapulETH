# 🎓 StuCredi - Student Credit Based on Academic Performance

<h4 align="center">
  Built for NapulETH Hackathon using Scaffold-ETH 2
</h4>

🎯 StuCredi is a decentralized application that connects sponsors with high-performing students, providing financial support based on academic achievements and event participation. The platform uses a unique point system that considers both academic grades and participation in tech events (proven by NFTs) to determine funding allocation.

⚙️ Built using NextJS, RainbowKit, Foundry, Wagmi, Viem, and Typescript.

## 🚀 Live Deployment

**✅ Verified Contracts on Avalanche Fuji Testnet:**

- **CustomNFT**: [`0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55)
- **Vault**: [`0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e)
- **RateMe**: [`0x79e043686cce3ee4cd66fc2dbe15fda812da5285`](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285)

All contracts are verified and ready to interact with on [Snowtrace](https://testnet.snowtrace.io/).

## Core Features

- 🎨 **CustomNFT Contract**: Enables sponsors to create and distribute NFTs for events and activities
- 💰 **Vault Contract**: Manages USDC deposits from sponsors and handles fund distribution
- ⭐ **RateMe Contract**: Calculates student funding based on grades and NFT points
- 🔄 **15-minute Rounds**: Quick funding cycles for testing and demonstration
- 📊 **Point System**:
  - 1 RATE Token = 1 point = 0.000010 USDC
  - Minimum funding: 50 RATE (0.000500 USDC)
  - Maximum funding: 150 RATE (0.001500 USDC)
  - Each NFT = 5 points
  - Academic grades contribute directly to points

## Smart Contracts Architecture

### CustomNFT.sol
- Simple NFT collection for activity participation
- Each NFT represents 5 points in the system
- Sponsors can mint and distribute NFTs to participating students

### Vault.sol
- Manages USDC deposits from sponsors
- Funds are only accessible in exchange for RATE tokens
- Emergency withdrawal function for admin
- 15-minute round system for fund distribution

### RateMe.sol
- Calculates and mints RATE tokens based on:
  - Student's academic grade (1-100)
  - Number of activity NFTs held
- Maximum 150 RATE tokens per round
- 1 RATE = 0.000010 USDC

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

1. Clone the repository:
```bash
git clone https://github.com/0xOucan/stucrediNapulETH.git
cd stucrediNapulETH
yarn install
```

2. Start a local network:
```bash
yarn chain
```

3. Deploy the contracts:
```bash
yarn deploy
```

4. Start the frontend:
```bash
yarn start
```

Visit your app on: `http://localhost:3000`

## 🌐 Avalanche Fuji Deployment

The StuCredi contracts are deployed and verified on Avalanche Fuji testnet. For deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

**Network Details:**
- **Chain ID**: 43113
- **RPC URL**: https://avalanche-fuji-c-chain-rpc.publicnode.com
- **USDC Fuji**: `0x5425890298aed601595a70AB815c96711a31Bc65`

## Testing

Run smart contract tests:
```bash
yarn foundry:test
```

## Development

- Smart contracts are in `packages/foundry/contracts`
- Frontend code is in `packages/nextjs`
- Deployment scripts are in `packages/foundry/script`

## Contributing

We welcome contributions to StuCredi! Please see [CONTRIBUTING.MD](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).