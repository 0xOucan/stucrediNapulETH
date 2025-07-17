import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface RoleCheckerProps {
  contractName: "CustomNFT" | "RateMe" | "Vault";
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const RoleChecker: React.FC<RoleCheckerProps> = ({
  contractName,
  role,
  children,
  fallback,
  showError = false,
}) => {
  const { address } = useAccount();
  const [hasRole, setHasRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: roleData,
    isLoading: roleLoading,
    error,
  } = useScaffoldReadContract({
    contractName,
    functionName: "hasRole",
    args: [role as `0x${string}`, address],
  });

  useEffect(() => {
    if (roleData !== undefined) {
      setHasRole(roleData as boolean);
      setIsLoading(false);
    }
  }, [roleData]);

  useEffect(() => {
    if (error && showError) {
      notification.error(`Error checking role: ${error.message}`);
    }
  }, [error, showError]);

  if (!address) {
    return (
      <div className="glass-card bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-xl p-4 text-center shadow-lg shadow-orange-500/20">
        <p className="text-orange-400 font-medium font-rajdhani">Please connect your wallet to continue</p>
      </div>
    );
  }

  if (isLoading || roleLoading) {
    return (
      <div className="bg-base-200 rounded-lg p-4 text-center">
        <div className="loading loading-spinner loading-sm mr-2"></div>
        <span>Checking permissions...</span>
      </div>
    );
  }

  if (!hasRole) {
    return (
      fallback || (
        <div className="bg-error/20 border border-error rounded-lg p-4 text-center">
          <p className="text-error font-medium">You don&apos;t have the required permissions to access this section</p>
        </div>
      )
    );
  }

  return <>{children}</>;
};
