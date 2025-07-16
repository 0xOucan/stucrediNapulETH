# 🧪 StuCredi Contract Testing Guide - Snowtrace Explorer

This guide will walk you through testing the StuCredi contracts directly on Snowtrace using your browser wallet extension (MetaMask, Rainbow, etc.).

## 🔧 Prerequisites

- ✅ Browser wallet extension (MetaMask, Rainbow, Coinbase Wallet, etc.)
- ✅ Wallet connected to Avalanche Fuji testnet
- ✅ Deployer wallet: `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`
- ✅ Some AVAX for gas fees
- ✅ Some USDC Fuji tokens for testing (optional)

## 🌐 Network Setup

### Add Avalanche Fuji to Your Wallet

**Network Details:**
- **Network Name**: Avalanche Fuji Testnet
- **RPC URL**: `https://avalanche-fuji-c-chain-rpc.publicnode.com`
- **Chain ID**: `43113`
- **Currency Symbol**: `AVAX`
- **Block Explorer**: `https://testnet.snowtrace.io/`

## 📋 Contract Addresses

- **CustomNFT**: [`0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55)
- **Vault**: [`0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e)
- **RateMe**: [`0x79e043686cce3ee4cd66fc2dbe15fda812da5285`](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285)
- **USDC Fuji**: [`0x5425890298aed601595a70AB815c96711a31Bc65`](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65)

---

## 🎯 Testing Scenarios

### Scenario 1: Basic Contract Inspection

**Objective**: Verify contracts are deployed and explore their functions.

#### Step 1.1: Inspect CustomNFT Contract
1. Visit [CustomNFT on Snowtrace](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55)
2. Click on the **"Contract"** tab
3. Verify you see the green ✅ checkmark (contract is verified)
4. Click **"Read Contract"** to explore read functions:
   - `name()` → Should return "ActivityProof"
   - `symbol()` → Should return "ACTPOAP"
   - `owner()` → Should return `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`
   - `totalSupply()` → Check current total supply
   - `balanceOf(address)` → Enter any address to check NFT balance

#### Step 1.2: Inspect Vault Contract
1. Visit [Vault on Snowtrace](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e)
2. Click **"Contract"** → **"Read Contract"**:
   - `usdc()` → Should return `0x5425890298aed601595a70AB815c96711a31Bc65`
   - `rateTokenContract()` → Should return `0x79e043686cce3ee4cd66fc2dbe15fda812da5285`
   - `ROUND_DURATION()` → Should return `900` (15 minutes in seconds)
   - `MAX_PER_ROUND()` → Should return `1500` (max micro-USDC per round)
   - `getCurrentRound()` → Check current round number
   - `totalBalance()` → Check total USDC balance in vault
   - `hasRole(bytes32,address)` → Check if deployer has SPONSOR_ROLE
     - Role: Use `SPONSOR_ROLE()` to get the hash
     - Account: `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45`

#### Step 1.3: Inspect RateMe Contract
1. Visit [RateMe on Snowtrace](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285)
2. Click **"Contract"** → **"Read Contract"**:
   - `name()` → Should return "RateToken"
   - `symbol()` → Should return "RATE"
   - `decimals()` → Should return `18`
   - `nft()` → Should return `0xa4ba4e9270bde8fbbf4328925959287a72ba0a55`
   - `vault()` → Should return `0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e`
   - `usdc()` → Should return `0x5425890298aed601595a70AB815c96711a31Bc65`
   - `STUDENT_ROLE()` → Get the student role hash
   - `POINTS_MIN()` → Should return `50`
   - `POINTS_MAX()` → Should return `150`
   - `POINTS_PER_NFT()` → Should return `5`
   - `MAX_GRADE()` → Should return `100`

---

### Scenario 2: NFT Minting (Sponsor Activity)

**Objective**: Test CustomNFT minting functionality as a sponsor.

#### Step 2.1: Connect Your Wallet
1. Go to [CustomNFT Contract](https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55)
2. Click **"Contract"** → **"Write Contract"**
3. Click **"Connect to Web3"** and connect your deployer wallet
4. Ensure you're on Avalanche Fuji testnet

#### Step 2.2: Mint NFT to a Student
1. Find the `mintBatch` function
2. Fill in the parameters:
   - `uri` (string): `ipfs://bafkreih37mogwuw4owrgozpsdfhgcesepydc3cr7mupyzi5tckmkfucy5q`
   - `recipients` (address[]): `["0x742d35Cc6634C0532925a3b8D4e5a4B1b4B4b4B4"]` (replace with actual student address)
3. Click **"Write"**
4. Confirm the transaction in your wallet
5. Wait for confirmation and note the transaction hash

#### Step 2.3: Verify NFT Minting
1. Go back to **"Read Contract"**
2. Check `totalSupply()` → Should have increased by 1
3. Check `balanceOf(address)` with the student address → Should return 1
4. Check `tokenURI(uint256)` with token ID 1 → Should return the IPFS URI

---

### Scenario 3: Vault Funding (Sponsor Deposits USDC)

**Objective**: Test funding the vault with USDC tokens.

#### Step 3.1: Get USDC Fuji Tokens
**Option A: If you have USDC Fuji tokens already, skip to Step 3.2**

**Option B: Get USDC Fuji tokens (if available from faucet or DEX)**
1. Visit [USDC Fuji Contract](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65)
2. Check if there's a faucet function or get from a DEX

#### Step 3.2: Approve USDC Spending
1. Go to [USDC Fuji Contract](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65)
2. Click **"Contract"** → **"Write Contract"**
3. Connect your wallet
4. Find the `approve` function
5. Fill parameters:
   - `spender` (address): `0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e` (Vault address)
   - `amount` (uint256): `100000` (0.1 USDC in micro-USDC)
6. Click **"Write"** and confirm transaction

#### Step 3.3: Fund the Vault
1. Go to [Vault Contract](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e)
2. Click **"Contract"** → **"Write Contract"**
3. Connect your wallet
4. Find the `fundStream` function
5. Fill parameters:
   - `amount` (uint256): `100000` (0.1 USDC in micro-USDC)
   - `maxPerRound` (uint256): `1500` (max 0.0015 USDC per round)
6. Click **"Write"** and confirm transaction

#### Step 3.4: Verify Funding
1. Go to **"Read Contract"**
2. Check `totalBalance()` → Should show total USDC in vault
3. Check `getStream(address)` with your address → Should show your stream info:
   - `remaining`: USDC remaining in your stream
   - `perRound`: Max USDC per round from your stream

---

### Scenario 4: Student Grade Submission and Token Claiming

**Objective**: Test the complete flow of a student claiming RATE tokens based on grade and NFTs.

#### Step 4.1: Grant STUDENT_ROLE (As Deployer)
1. Connect your deployer wallet
2. Go to [RateMe Contract](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) **"Read Contract"**
3. Get `STUDENT_ROLE()` hash
4. Go to **"Write Contract"**
5. Use `grantRole`:
   - `role` (bytes32): [STUDENT_ROLE_HASH]
   - `account` (address): Student wallet address
6. Click **"Write"** and confirm

#### Step 4.2: Switch to Student Wallet
1. Switch your browser wallet to student account
2. Ensure it's connected to Avalanche Fuji
3. Make sure this address has some AVAX for gas fees

#### Step 4.3: Check Claim Calculation
1. Go to **"Read Contract"**
2. Use `calculateClaimAmount`:
   - `student` (address): Your student wallet address
   - `grade` (uint8): `85`
3. Note the results:
   - `points`: Total points calculated
   - `rateAmount`: RATE tokens you'll receive
   - `canClaim`: Must be `true`

#### Step 4.4: Claim RATE Tokens
1. Go to **"Write Contract"**
2. Find the `claim` function
3. Fill parameters:
   - `grade` (uint8): `85` (grade between 1-100)
4. Click **"Write"** and confirm transaction

#### Step 4.5: Verify RATE Token Claiming
1. Go to **"Read Contract"**
2. Check `balanceOf(address)` with student address → Should show RATE tokens
3. Check `totalSupply()` → Should have increased
4. Calculate expected tokens:
   - Base: 85 points (from grade)
   - NFT bonus: 5 points × number of NFTs held
   - Total RATE tokens = (grade + NFT bonus) × 10^18

---

### Scenario 5: Token Redemption (RATE → USDC)

**Objective**: Test redeeming RATE tokens for USDC from the vault.

#### Step 5.1: Check USDC Value
1. Go to [RateMe Contract](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) **"Read Contract"**
2. Use `getUSDCValue(rateAmount)`:
   - `rateAmount` (uint256): `50000000000000000000` (50 RATE tokens)
3. Should return `500` (50 RATE × 10 micro-USDC = 500 micro-USDC)

#### Step 5.2: Ensure Vault is Configured
1. Go to [Vault Contract](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e) **"Read Contract"**
2. Check `rateTokenContract()` → Should return RateMe contract address
3. If it returns `0x0000...`, you need to configure it (as deployer):
   - Go to **"Write Contract"**
   - Use `setRateTokenContract`:
     - `_rateTokenContract` (address): `0x79e043686cce3ee4cd66fc2dbe15fda812da5285`

#### Step 5.3: Redeem RATE for USDC
1. Go to [RateMe Contract](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) **"Write Contract"**
2. Connect student wallet
3. Find the `redeem` function
4. Fill parameters:
   - `rateAmount` (uint256): `50000000000000000000` (50 RATE tokens)
   - `sponsor` (address): `0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45` (deployer who funded)
5. Click **"Write"** and confirm transaction

#### Step 5.4: Verify Redemption
1. Check your USDC balance:
   - Go to [USDC Contract](https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65) **"Read Contract"**
   - Check `balanceOf(address)` with your student address
   - Should show `500` micro-USDC increase
2. Check your RATE balance decreased:
   - Go to [RateMe Contract](https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285) **"Read Contract"**
   - Check `balanceOf(address)` with your student address
   - Should show 50 RATE tokens burned

---

### Scenario 6: Round System Testing

**Objective**: Test the 15-minute round system and funding limits.

#### Step 6.1: Check Current Round
1. Go to [Vault Contract](https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e) **"Read Contract"**
2. Check `getCurrentRound()` → Note the current round number
3. Check `currentRoundStart()` → See when current round started
4. Check `timeUntilNextRound()` → See seconds until next round

#### Step 6.2: Test Round Limits
1. Try to exchange more than 1500 micro-USDC worth of RATE tokens in a single round
2. The transaction should fail with "Exceeds round limit" error
3. Expected behavior: Max 150 RATE tokens per round (150 × 10 = 1500 micro-USDC)

#### Step 6.3: Wait for Next Round (Optional)
1. Wait 15 minutes for the next round (or use `advanceRound()` if available)
2. Check `getCurrentRound()` again → Should have increased by 1
3. Try redeeming tokens again → Should work up to the limit

---

## 🔍 Monitoring and Verification

### Transaction Monitoring
- **All Transactions**: Check your wallet's transaction history
- **Contract Events**: Look for event logs in successful transactions
- **Gas Usage**: Monitor gas costs for each operation

### Common Events to Watch For:
- `ActivityNFTMinted` events for NFT minting
- `Transfer` events for RATE token transfers
- `StreamFunded` events for vault funding
- `RateClaimed` events for student claims
- `RateRedeemed` events for token redemptions
- `FundsPulled` events when vault releases USDC

### Troubleshooting Common Issues:

1. **Transaction Fails**: 
   - Check you have enough AVAX for gas
   - Verify you're on Avalanche Fuji (Chain ID: 43113)
   - Ensure you have required tokens/permissions

2. **"Exceeds round limit"**:
   - Wait for next round (15 minutes)
   - Try with smaller amounts

3. **"Insufficient allowance"**:
   - Approve token spending first
   - Check approval amount is sufficient

4. **"Access denied"**:
   - Ensure you're using the correct wallet address
   - Check if you have required roles

---

## 📊 Expected Test Results

### Successful Flow Results:
1. **NFT Minting**: Student receives 1 NFT, total supply increases
2. **Vault Funding**: Vault balance increases, sponsor stream recorded
3. **Role Assignment**: Student receives STUDENT_ROLE for claiming
4. **Grade Claiming**: Student receives RATE tokens based on grade + NFT bonus
5. **Token Redemption**: Student receives USDC, RATE tokens burned
6. **Round System**: Limits enforced, rounds progress every 15 minutes

### Token Economics Validation:
- **1 RATE** = 10 micro-USDC = 0.000010 USDC
- **1 NFT** = 5 additional points
- **Grade 85 + 1 NFT** = 90 RATE tokens = 900 micro-USDC = 0.0009 USDC
- **Max per round**: 150 RATE = 1500 micro-USDC = 0.0015 USDC

---

## 🎯 Success Criteria

✅ **All contracts verified and accessible on Snowtrace**
✅ **NFT minting works for sponsors using `mintBatch`**
✅ **Vault funding accepts USDC deposits using `fundStream`**
✅ **Students can be granted STUDENT_ROLE**
✅ **Students can claim RATE tokens using `claim(grade)`**
✅ **Token redemption works using `redeem(rateAmount, sponsor)`**
✅ **Round system enforces 15-minute cycles with MAX_PER_ROUND limits**
✅ **All token economics calculations are correct**

---

**Happy Testing! 🚀**

For any issues or questions, refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) or check the contract source code on Snowtrace. 