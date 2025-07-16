"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  AcademicCapIcon,
  BugAntIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const DEPLOYER_ADDRESS = "0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45";
  const isDeployer = connectedAddress?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        {/* Hero Section */}
        <div className="px-5 max-w-4xl mx-auto text-center">
          <h1 className="text-center mb-6">
            <span className="block text-3xl mb-2 font-bold text-primary">🎓 StuCredi</span>
            <span className="block text-xl text-base-content/80">Student Credit Based on Academic Performance</span>
          </h1>

          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            A decentralized platform connecting sponsors with high-performing students, providing financial support
            based on academic achievements and tech event participation through NFTs.
          </p>

          {/* Connection Status */}
          <div className="flex justify-center items-center space-x-2 flex-col mb-8">
            <p className="font-medium text-base-content/80">Connected Address:</p>
            <Address address={connectedAddress} />
            {isDeployer && <div className="badge badge-primary badge-sm">Admin/Sponsor</div>}
          </div>

          {/* Role-based Navigation */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <Link href="/student" className="btn btn-primary btn-lg">
              <AcademicCapIcon className="h-6 w-6" />
              Student Interface
            </Link>
            <Link href="/sponsor" className="btn btn-secondary btn-lg">
              <UserGroupIcon className="h-6 w-6" />
              Sponsor Interface
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-base-300 w-full py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How StuCredi Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* NFT System */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <ShieldCheckIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">NFT Participation</h3>
                <p className="text-base-content/70">
                  Earn NFTs by participating in tech events. Each NFT adds 5 points to your academic score.
                </p>
              </div>

              {/* Grade System */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <ChartBarIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Grade-Based Rewards</h3>
                <p className="text-base-content/70">
                  Submit your academic grades (1-100) to receive RATE tokens based on performance + NFT bonus.
                </p>
              </div>

              {/* Token Economics */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <CurrencyDollarIcon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">USDC Rewards</h3>
                <p className="text-base-content/70">
                  Redeem RATE tokens for USDC. 1 RATE = 10 micro-USDC (0.000010 USDC).
                </p>
              </div>

              {/* Round System */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <ClockIcon className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">15-Minute Rounds</h3>
                <p className="text-base-content/70">
                  Fast funding cycles with max 150 RATE tokens (0.0015 USDC) per round per student.
                </p>
              </div>

              {/* Sponsor System */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <UserGroupIcon className="h-12 w-12 text-info mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sponsor Funding</h3>
                <p className="text-base-content/70">
                  Sponsors fund the vault with USDC and mint NFTs for student participation.
                </p>
              </div>

              {/* Verification */}
              <div className="bg-base-100 p-6 rounded-3xl text-center">
                <ShieldCheckIcon className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Verified Contracts</h3>
                <p className="text-base-content/70">
                  All contracts are verified on Avalanche Fuji testnet and ready for interaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="w-full py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Contract Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-200 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">CustomNFT</h3>
                <p className="text-sm text-base-content/70 mb-2">Activity participation NFTs</p>
                <a
                  href="https://testnet.snowtrace.io/address/0xa4ba4e9270bde8fbbf4328925959287a72ba0a55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm break-all"
                >
                  0xa4ba4e9270bde8fbbf4328925959287a72ba0a55
                </a>
              </div>

              <div className="bg-base-200 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">Vault</h3>
                <p className="text-sm text-base-content/70 mb-2">USDC funding management</p>
                <a
                  href="https://testnet.snowtrace.io/address/0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm break-all"
                >
                  0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e
                </a>
              </div>

              <div className="bg-base-200 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">RateMe</h3>
                <p className="text-sm text-base-content/70 mb-2">Grade submission and token claiming</p>
                <a
                  href="https://testnet.snowtrace.io/address/0x79e043686cce3ee4cd66fc2dbe15fda812da5285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm break-all"
                >
                  0x79e043686cce3ee4cd66fc2dbe15fda812da5285
                </a>
              </div>

              <div className="bg-base-200 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">USDC Fuji</h3>
                <p className="text-sm text-base-content/70 mb-2">Testnet USDC token</p>
                <a
                  href="https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm break-all"
                >
                  0x5425890298aed601595a70AB815c96711a31Bc65
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Tools */}
        <div className="bg-base-300 w-full py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Debug and test contracts using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                interface.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="w-full py-8 text-center text-base-content/60">
          <p className="mb-2">Built for NapulETH Hackathon using Scaffold-ETH 2</p>
          <p className="text-sm">Network: Avalanche Fuji Testnet (Chain ID: 43113)</p>
        </div>
      </div>
    </>
  );
};

export default Home;
