"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { ActionCard, NFTBalance, RoleChecker, StatsCard, TokenBalance } from "~~/components/stucredi/shared";
import { Input } from "~~/components/ui/input";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const StudentPage: NextPage = () => {
  const { address } = useAccount();
  const [grade, setGrade] = useState<string>("");
  const [redeemAmount, setRedeemAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const DEPLOYER_ADDRESS = "0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45";

  // Contract reads
  const { data: studentRole } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "STUDENT_ROLE",
  });

  const { data: hasClaimedThisRound } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "hasClaimedThisRound",
    args: [address],
  });

  const { data: currentRoundInfo } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "getCurrentRoundInfo",
  });

  const { data: claimAmount } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "calculateClaimAmount",
    args: [address, parseInt(grade) || 0],
  });

  const { data: usdcValue } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "getUSDCValue",
    args: [redeemAmount ? parseEther(redeemAmount) : 0n],
  });

  const { data: pointsMin } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "POINTS_MIN",
  });

  const { data: pointsMax } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "POINTS_MAX",
  });

  // Contract writes
  const { writeContractAsync: claimTokens } = useScaffoldWriteContract({
    contractName: "RateMe",
  });

  const { writeContractAsync: redeemTokens } = useScaffoldWriteContract({
    contractName: "RateMe",
  });

  const handleGradeSubmit = async () => {
    if (!grade || parseInt(grade) < 1 || parseInt(grade) > 100) {
      notification.error("Please enter a valid grade between 1 and 100");
      return;
    }

    try {
      setIsSubmitting(true);
      await claimTokens({
        functionName: "claim",
        args: [parseInt(grade)],
      });
      notification.success("Grade submitted and RATE tokens claimed!");
      setGrade("");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      notification.error("Failed to claim tokens. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedeem = async () => {
    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      notification.error("Please enter a valid amount to redeem");
      return;
    }

    try {
      setIsRedeeming(true);
      await redeemTokens({
        functionName: "redeem",
        args: [parseEther(redeemAmount), DEPLOYER_ADDRESS],
      });
      notification.success("RATE tokens redeemed for USDC!");
      setRedeemAmount("");
    } catch (error) {
      console.error("Error redeeming tokens:", error);
      notification.error("Failed to redeem tokens. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const timeUntilNext = currentRoundInfo ? Number(currentRoundInfo[1]) : 0;
  const claimablePoints = claimAmount ? Number(claimAmount[0]) : 0;
  const claimableTokens = claimAmount ? Number(claimAmount[1]) : 0;
  const canClaim = claimAmount ? claimAmount[2] : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎓 Student Dashboard</h1>
          <p className="text-base-content/70">Submit your grades, claim RATE tokens, and redeem for USDC</p>
          <div className="mt-4">
            <Address address={address} />
          </div>
        </div>

        {/* Role Protection */}
        <RoleChecker
          contractName="RateMe"
          role={studentRole as string}
          fallback={
            <div className="glass-card bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-xl p-6 text-center shadow-lg shadow-orange-500/20">
              <h3 className="font-bold text-orange-400 mb-2 font-orbitron">Student Role Required</h3>
              <p className="text-orange-300/90 font-rajdhani">
                You need to be granted the STUDENT_ROLE to access this interface. Please contact an admin to get the
                required permissions.
              </p>
            </div>
          }
        >
          {/* Current Round Info */}
          <div className="mb-8">
            <StatsCard
              title="Current Round"
              value={
                timeUntilNext > 0
                  ? `${Math.floor(timeUntilNext / 60)}:${(timeUntilNext % 60).toString().padStart(2, "0")}`
                  : "New Round"
              }
              icon={<ClockIcon className="h-6 w-6" />}
              description={hasClaimedThisRound ? "Already claimed this round" : "Time remaining"}
            />
          </div>

          {/* Balances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
              <NFTBalance />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Tokens</h2>
              <TokenBalance />
            </div>
          </div>

          {/* Grade Submission */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Submit Grade</h2>
            <ActionCard
              title="Grade Submission"
              description={`Submit your academic grade (1-100) to claim RATE tokens. Min: ${pointsMin || 50} points, Max: ${pointsMax || 150} points.`}
              icon={<AcademicCapIcon className="h-6 w-6" />}
              disabled={hasClaimedThisRound}
              action={
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      placeholder="Enter grade (1-100)"
                      className="flex-1"
                      disabled={hasClaimedThisRound}
                      variant="glow"
                    />
                    <button
                      onClick={handleGradeSubmit}
                      disabled={!grade || isSubmitting || hasClaimedThisRound}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <AcademicCapIcon className="h-4 w-4" />
                          Submit Grade
                        </>
                      )}
                    </button>
                  </div>

                  {grade && canClaim && (
                    <div className="glass-card bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-xl p-4 shadow-lg shadow-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <ChartBarIcon className="h-5 w-5 text-cyan-400" />
                        <span className="font-medium text-cyan-400 font-rajdhani">Calculation Preview</span>
                      </div>
                      <div className="text-sm space-y-1 text-white/90 font-rajdhani">
                        <p>Total Points: {claimablePoints}</p>
                        <p>RATE Tokens: {(claimableTokens / 1e18).toFixed(0)}</p>
                        <p>USDC Value: ${((claimableTokens / 1e18) * 0.00001).toFixed(6)}</p>
                      </div>
                    </div>
                  )}

                  {hasClaimedThisRound && (
                    <div className="glass-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-4 shadow-lg shadow-green-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        <span className="font-medium text-green-400 font-rajdhani">Already claimed this round</span>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </div>

          {/* Token Redemption */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Redeem RATE for USDC</h2>
            <ActionCard
              title="Token Redemption"
              description="Exchange your RATE tokens for USDC. 1 RATE = 10 micro-USDC (0.000010 USDC)"
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              action={
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={redeemAmount}
                      onChange={e => setRedeemAmount(e.target.value)}
                      placeholder="Enter RATE amount"
                      className="flex-1"
                      variant="default"
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={!redeemAmount || isRedeeming}
                      className="btn btn-secondary"
                    >
                      {isRedeeming ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <CurrencyDollarIcon className="h-4 w-4" />
                          Redeem
                        </>
                      )}
                    </button>
                  </div>

                  {redeemAmount && usdcValue && (
                    <div className="glass-card bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl p-4 shadow-lg shadow-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-purple-400" />
                        <span className="font-medium text-purple-400 font-rajdhani">Redemption Preview</span>
                      </div>
                      <div className="text-sm space-y-1 text-white/90 font-rajdhani">
                        <p>RATE Tokens: {redeemAmount}</p>
                        <p>USDC Received: ${(Number(usdcValue) / 1000000).toFixed(6)}</p>
                        <p>Sponsor: {DEPLOYER_ADDRESS}</p>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </div>

          {/* Help Section */}
          <div className="glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/20">
            <h3 className="font-bold mb-4 text-white font-orbitron neon-text-purple">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">📊 Grade Submission</h4>
                <p className="text-white/70">
                  Submit your academic grade (1-100) to receive RATE tokens. Your total points = grade + (NFTs × 5).
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">💰 Token Redemption</h4>
                <p className="text-white/70">
                  Exchange RATE tokens for USDC at a rate of 1 RATE = 10 micro-USDC (0.000010 USDC).
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">⏰ Round System</h4>
                <p className="text-white/70">
                  Each round lasts 15 minutes. You can only claim once per round with a maximum of 150 RATE tokens.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-cyan-400 font-rajdhani">🎯 NFT Bonus</h4>
                <p className="text-white/70">
                  Participate in events to earn NFTs. Each NFT adds 5 points to your total score.
                </p>
              </div>
            </div>
          </div>
        </RoleChecker>
      </div>
    </div>
  );
};

export default StudentPage;
