import React from "react";
import { StatsCard } from "./StatsCard";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface TokenBalanceProps {
  className?: string;
}

export const TokenBalance: React.FC<TokenBalanceProps> = ({ className = "" }) => {
  const { address } = useAccount();

  const { data: rateBalance, isLoading: rateLoading } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "balanceOf",
    args: [address],
  });

  // For USDC, we need to read from the external contract
  // Using a placeholder for now since USDC is not in our deployedContracts
  const usdcBalance = 0; // This would need to be implemented separately
  const usdcLoading = false;

  const rateAmount = rateBalance ? Number(formatEther(rateBalance)) : 0;
  const usdcAmount = usdcBalance / 1000000; // USDC has 6 decimals

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <StatsCard
        title="RATE Tokens"
        value={rateAmount.toFixed(0)}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        description="Claimable tokens from grades"
        loading={rateLoading}
      />
      <StatsCard
        title="USDC Balance"
        value={`$${usdcAmount.toFixed(6)}`}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        description="Redeemed rewards"
        loading={usdcLoading}
      />
    </div>
  );
};
