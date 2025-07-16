import React from "react";
import { StatsCard } from "./StatsCard";
import { useAccount } from "wagmi";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface NFTBalanceProps {
  className?: string;
}

export const NFTBalance: React.FC<NFTBalanceProps> = ({ className = "" }) => {
  const { address } = useAccount();

  const { data: nftBalance, isLoading: nftLoading } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: pointsPerNFT } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "POINTS_PER_NFT",
  });

  const nftCount = Number(nftBalance || 0);
  const points = Number(pointsPerNFT || 0);
  const totalPoints = nftCount * points;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <StatsCard
        title="NFTs Owned"
        value={nftCount}
        icon={<ShieldCheckIcon className="h-6 w-6" />}
        description="Activity participation NFTs"
        loading={nftLoading}
      />
      <StatsCard
        title="NFT Points"
        value={totalPoints}
        icon={<ShieldCheckIcon className="h-6 w-6" />}
        description={`${points} points per NFT`}
        loading={nftLoading}
      />
    </div>
  );
};
