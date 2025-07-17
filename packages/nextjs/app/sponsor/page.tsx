"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import {
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { ActionCard, RoleChecker, StatsCard } from "~~/components/stucredi/shared";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const SponsorPage: NextPage = () => {
  const { address } = useAccount();
  const [studentAddress, setStudentAddress] = useState<string>("");
  const [nftRecipients, setNftRecipients] = useState<string>("");
  const [fundAmount, setFundAmount] = useState<string>("");
  const [perRoundAmount, setPerRoundAmount] = useState<string>("");
  const [isGrantingRole, setIsGrantingRole] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const DEPLOYER_ADDRESS = "0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45";
  const DEFAULT_NFT_URI = "ipfs://bafkreih37mogwuw4owrgozpsdfhgcesepydc3cr7mupyzi5tckmkfucy5q";

  // Contract reads
  const { data: sponsorRole } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "SPONSOR_ROLE",
  });

  const { data: studentRole } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "STUDENT_ROLE",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "totalSupply",
  });

  const { data: totalRateSupply } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "totalSupply",
  });

  const { data: vaultBalance } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalBalance",
  });

  const { data: currentRound } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "getCurrentRound",
  });

  const { data: roundDuration } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "ROUND_DURATION",
  });

  const { data: maxPerRound } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "MAX_PER_ROUND",
  });

  const { data: hasStudentRole } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "hasRole",
    args: [studentRole as `0x${string}`, studentAddress as `0x${string}`],
  });

  const { data: sponsorStream } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "getStream",
    args: [address],
  });

  // Contract writes
  const { writeContractAsync: grantStudentRole } = useScaffoldWriteContract({
    contractName: "RateMe",
  });

  const { writeContractAsync: mintNFTs } = useScaffoldWriteContract({
    contractName: "CustomNFT",
  });

  const { writeContractAsync: fundVault } = useScaffoldWriteContract({
    contractName: "Vault",
  });

  const { writeContractAsync: advanceRound } = useScaffoldWriteContract({
    contractName: "Vault",
  });

  const handleGrantRole = async () => {
    if (!studentAddress || !isAddress(studentAddress)) {
      notification.error("Please enter a valid student address");
      return;
    }

    try {
      setIsGrantingRole(true);
      await grantStudentRole({
        functionName: "grantRole",
        args: [studentRole as `0x${string}`, studentAddress as `0x${string}`],
      });
      notification.success("Student role granted successfully!");
      setStudentAddress("");
    } catch (error) {
      console.error("Error granting role:", error);
      notification.error("Failed to grant student role. Please try again.");
    } finally {
      setIsGrantingRole(false);
    }
  };

  const handleMintNFTs = async () => {
    if (!nftRecipients) {
      notification.error("Please enter recipient addresses");
      return;
    }

    const recipients = nftRecipients.split(",").map(addr => addr.trim());
    const invalidAddresses = recipients.filter(addr => !isAddress(addr));

    if (invalidAddresses.length > 0) {
      notification.error("Some addresses are invalid. Please check and try again.");
      return;
    }

    try {
      setIsMinting(true);
      await mintNFTs({
        functionName: "mintBatch",
        args: [DEFAULT_NFT_URI, recipients],
      });
      notification.success(`NFTs minted successfully to ${recipients.length} addresses!`);
      setNftRecipients("");
    } catch (error) {
      console.error("Error minting NFTs:", error);
      notification.error("Failed to mint NFTs. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleFundVault = async () => {
    if (!fundAmount || !perRoundAmount) {
      notification.error("Please enter both funding amounts");
      return;
    }

    const totalMicroUSDC = parseFloat(fundAmount) * 1000000; // Convert to micro-USDC
    const perRoundMicroUSDC = parseFloat(perRoundAmount) * 1000000;

    try {
      setIsFunding(true);
      // Note: In a real implementation, you'd need to approve USDC spending first
      await fundVault({
        functionName: "fundStream",
        args: [BigInt(totalMicroUSDC), BigInt(perRoundMicroUSDC)],
      });
      notification.success("Vault funded successfully!");
      setFundAmount("");
      setPerRoundAmount("");
    } catch (error) {
      console.error("Error funding vault:", error);
      notification.error("Failed to fund vault. Please try again.");
    } finally {
      setIsFunding(false);
    }
  };

  const handleAdvanceRound = async () => {
    try {
      await advanceRound({
        functionName: "advanceRound",
      });
      notification.success("Round advanced successfully!");
    } catch (error) {
      console.error("Error advancing round:", error);
      notification.error("Failed to advance round. Please try again.");
    }
  };

  const isDeployer = address?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">👨‍💼 Sponsor Dashboard</h1>
          <p className="text-base-content/70">Manage student roles, mint NFTs, and fund the vault</p>
          <div className="mt-4">
            <Address address={address} />
            {isDeployer && <div className="badge badge-primary badge-sm mt-2">Admin/Sponsor</div>}
          </div>
        </div>

        {/* Role Protection */}
        <RoleChecker
          contractName="CustomNFT"
          role={sponsorRole as string}
          fallback={
            <div className="glass-card bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-xl p-6 text-center shadow-lg shadow-orange-500/20">
              <h3 className="font-bold text-orange-400 mb-2 font-orbitron">Sponsor Role Required</h3>
              <p className="text-orange-300/90 font-rajdhani">
                You need to be granted the SPONSOR_ROLE to access this interface. Please contact the admin to get the
                required permissions.
              </p>
              <p className="text-sm text-orange-400/80 mt-2 font-rajdhani">Admin Address: {DEPLOYER_ADDRESS}</p>
            </div>
          }
        >
          {/* System Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total NFTs"
                value={Number(totalSupply || 0)}
                icon={<ShieldCheckIcon className="h-6 w-6" />}
                description="Minted activity NFTs"
              />
              <StatsCard
                title="RATE Supply"
                value={Number(totalRateSupply || 0) / 1e18}
                icon={<CurrencyDollarIcon className="h-6 w-6" />}
                description="Total RATE tokens"
              />
              <StatsCard
                title="Vault Balance"
                value={`$${(Number(vaultBalance || 0) / 1000000).toFixed(4)}`}
                icon={<BanknotesIcon className="h-6 w-6" />}
                description="USDC in vault"
              />
              <StatsCard
                title="Current Round"
                value={Number(currentRound || 0)}
                icon={<ClockIcon className="h-6 w-6" />}
                description={`${Number(roundDuration || 0) / 60} min rounds`}
              />
            </div>
          </div>

          {/* My Stream Info */}
          {sponsorStream && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">My Funding Stream</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard
                  title="Remaining"
                  value={`$${(Number(sponsorStream[0]) / 1000000).toFixed(4)}`}
                  icon={<BanknotesIcon className="h-6 w-6" />}
                  description="USDC remaining in stream"
                />
                <StatsCard
                  title="Per Round"
                  value={`$${(Number(sponsorStream[1]) / 1000000).toFixed(4)}`}
                  icon={<ChartBarIcon className="h-6 w-6" />}
                  description="Max USDC per round"
                />
              </div>
            </div>
          )}

          {/* Role Management */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Role Management</h2>
            <ActionCard
              title="Grant Student Role"
              description="Grant STUDENT_ROLE to allow students to submit grades and claim tokens"
              icon={<UserGroupIcon className="h-6 w-6" />}
              action={
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <AddressInput
                      value={studentAddress}
                      onChange={setStudentAddress}
                      placeholder="Enter student address"
                    />
                    <button
                      onClick={handleGrantRole}
                      disabled={!studentAddress || isGrantingRole}
                      className="btn btn-primary"
                    >
                      {isGrantingRole ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4" />
                          Grant Role
                        </>
                      )}
                    </button>
                  </div>

                  {studentAddress && hasStudentRole !== undefined && (
                    <div
                      className={`border rounded-lg p-4 ${hasStudentRole ? "bg-success/20 border-success" : "bg-info/20 border-info"}`}
                    >
                      <p className={`text-sm font-medium ${hasStudentRole ? "text-success" : "text-info"}`}>
                        {hasStudentRole
                          ? "✅ Address already has STUDENT_ROLE"
                          : "ℹ️ Address does not have STUDENT_ROLE"}
                      </p>
                    </div>
                  )}
                </div>
              }
            />
          </div>

          {/* NFT Minting */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">NFT Minting</h2>
            <ActionCard
              title="Mint Activity NFTs"
              description="Mint NFTs to students for event participation. Each NFT adds 5 points to their score."
              icon={<ShieldCheckIcon className="h-6 w-6" />}
              action={
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <textarea
                      value={nftRecipients}
                      onChange={e => setNftRecipients(e.target.value)}
                      placeholder="Enter recipient addresses (comma-separated)"
                      className="textarea textarea-bordered flex-1"
                      rows={3}
                    />
                    <button
                      onClick={handleMintNFTs}
                      disabled={!nftRecipients || isMinting}
                      className="btn btn-secondary"
                    >
                      {isMinting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <ShieldCheckIcon className="h-4 w-4" />
                          Mint NFTs
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-info/20 border border-info rounded-lg p-4">
                    <p className="text-sm text-info">
                      <strong>NFT URI:</strong> {DEFAULT_NFT_URI}
                    </p>
                    <p className="text-sm text-info mt-1">
                      <strong>Points per NFT:</strong> 5 points
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Vault Funding */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Vault Funding</h2>
            <ActionCard
              title="Fund Vault with USDC"
              description="Add USDC to the vault to enable student token redemptions"
              icon={<BanknotesIcon className="h-6 w-6" />}
              action={
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Total USDC Amount</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={fundAmount}
                        onChange={e => setFundAmount(e.target.value)}
                        placeholder="0.001"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Max per Round</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={perRoundAmount}
                        onChange={e => setPerRoundAmount(e.target.value)}
                        placeholder="0.0015"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFundVault}
                    disabled={!fundAmount || !perRoundAmount || isFunding}
                    className="btn btn-accent w-full"
                  >
                    {isFunding ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <BanknotesIcon className="h-4 w-4" />
                        Fund Vault
                      </>
                    )}
                  </button>

                  <div className="glass-card bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-xl p-4 shadow-lg shadow-orange-500/20">
                    <p className="text-sm text-orange-400 font-rajdhani">
                      <strong>Note:</strong> You need to approve USDC spending before funding the vault. Make sure you
                      have sufficient USDC balance.
                    </p>
                    <p className="text-sm text-orange-400 mt-1 font-rajdhani">
                      <strong>Max per round:</strong> {Number(maxPerRound || 0)} micro-USDC ($
                      {(Number(maxPerRound || 0) / 1000000).toFixed(6)})
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Round Management */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Round Management</h2>
            <ActionCard
              title="Advance Round"
              description="Manually advance to the next round (normally happens automatically every 15 minutes)"
              icon={<ClockIcon className="h-6 w-6" />}
              action={
                <button onClick={handleAdvanceRound} className="btn btn-warning">
                  <ClockIcon className="h-4 w-4" />
                  Advance Round
                </button>
              }
            />
          </div>

          {/* Help Section */}
          <div className="glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/20">
            <h3 className="font-bold mb-4 text-white font-orbitron neon-text-purple">Sponsor Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">👥 Role Management</h4>
                <p className="text-white/70">
                  Grant STUDENT_ROLE to addresses to allow them to submit grades and claim tokens.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">🎯 NFT Minting</h4>
                <p className="text-white/70">
                  Mint NFTs to students for event participation. Each NFT adds 5 points to their total score.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">💰 Vault Funding</h4>
                <p className="text-white/70">
                  Fund the vault with USDC to enable student token redemptions. Set appropriate per-round limits.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">⏰ Round System</h4>
                <p className="text-white/70">
                  Rounds advance automatically every 15 minutes. Students can claim once per round.
                </p>
              </div>
            </div>
          </div>
        </RoleChecker>
      </div>
    </div>
  );
};

export default SponsorPage;
