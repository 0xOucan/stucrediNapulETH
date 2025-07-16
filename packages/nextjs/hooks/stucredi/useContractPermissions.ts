import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const useContractPermissions = () => {
  const { address } = useAccount();
  const [permissions, setPermissions] = useState({
    isStudent: false,
    isSponsor: false,
    isAdmin: false,
    loading: true,
  });

  const DEPLOYER_ADDRESS = "0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45";

  // Get role constants
  const { data: studentRole } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "STUDENT_ROLE",
  });

  const { data: sponsorRole } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "SPONSOR_ROLE",
  });

  // Check roles
  const { data: hasStudentRole, isLoading: studentLoading } = useScaffoldReadContract({
    contractName: "RateMe",
    functionName: "hasRole",
    args: [studentRole as `0x${string}`, address],
  });

  const { data: hasSponsorRole, isLoading: sponsorLoading } = useScaffoldReadContract({
    contractName: "CustomNFT",
    functionName: "hasRole",
    args: [sponsorRole as `0x${string}`, address],
  });

  useEffect(() => {
    if (!address) {
      setPermissions({
        isStudent: false,
        isSponsor: false,
        isAdmin: false,
        loading: false,
      });
      return;
    }

    const isAdmin = address.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();
    const isStudent = Boolean(hasStudentRole);
    const isSponsor = Boolean(hasSponsorRole) || isAdmin; // Admin has sponsor privileges

    setPermissions({
      isStudent,
      isSponsor,
      isAdmin,
      loading: studentLoading || sponsorLoading,
    });
  }, [address, hasStudentRole, hasSponsorRole, studentLoading, sponsorLoading]);

  return {
    ...permissions,
    roles: {
      studentRole: studentRole as `0x${string}`,
      sponsorRole: sponsorRole as `0x${string}`,
    },
    DEPLOYER_ADDRESS,
  };
};
