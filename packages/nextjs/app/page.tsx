"use client";

import dynamic from "next/dynamic";
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

// Dynamically import 3D component to avoid SSR issues
const FloatingLogo3D = dynamic(() => import("~~/components/FloatingLogo3D"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <div className="text-2xl neon-text animate-pulse">Loading 3D Scene...</div>
    </div>
  ),
});

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const DEPLOYER_ADDRESS = "0x9c77c6fafc1eb0821F1De12972Ef0199C97C6e45";
  const isDeployer = connectedAddress?.toLowerCase() === DEPLOYER_ADDRESS.toLowerCase();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 relative z-10">
        {/* Hero Section with 3D Logo */}
        <div className="px-5 max-w-6xl mx-auto text-center relative">
          {/* 3D Floating Logo */}
          <div className="mb-8">
            <FloatingLogo3D height="400px" className="mb-4" />
          </div>

          <h1 className="text-center mb-6 relative z-10">
            <span className="block text-5xl mb-4 font-orbitron font-bold holo-text drop-shadow-2xl">🎓 StuCredi</span>
            <span className="block text-2xl neon-text-purple font-rajdhani font-light tracking-wider">
              Student Credit Based on Academic Performance
            </span>
          </h1>

          <p
            className="text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed font-rajdhani 
                        backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            A <span className="neon-text-pink">decentralized platform</span> connecting sponsors with high-performing
            students, providing <span className="neon-text">financial support</span> based on academic achievements and
            tech event participation through <span className="neon-text-purple">NFTs</span>.
          </p>

          {/* Connection Status */}
          <div
            className="flex justify-center items-center space-x-2 flex-col mb-8 
                          glass-card p-6 rounded-2xl max-w-md mx-auto"
          >
            <p className="font-medium text-white/90 font-orbitron">Connected Address:</p>
            <div className="mt-2">
              <Address address={connectedAddress} />
            </div>
            {isDeployer && (
              <div
                className="badge badge-primary badge-sm mt-2 
                             bg-gradient-to-r from-pink-500 to-purple-500 
                             border-none text-white shadow-lg shadow-pink-500/30"
              >
                Admin/Sponsor
              </div>
            )}
          </div>

          {/* Role-based Navigation */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Link
              href="/student"
              className="btn btn-primary btn-lg group 
                                           bg-gradient-to-r from-cyan-500 to-blue-500 
                                           hover:from-cyan-400 hover:to-blue-400
                                           border-none shadow-lg shadow-cyan-500/30
                                           hover:shadow-cyan-400/50 hover:shadow-xl
                                           transform hover:scale-105 transition-all duration-300"
            >
              <AcademicCapIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-orbitron font-semibold">Student Interface</span>
            </Link>
            <Link
              href="/sponsor"
              className="btn btn-secondary btn-lg group
                                           bg-gradient-to-r from-pink-500 to-purple-500 
                                           hover:from-pink-400 hover:to-purple-400
                                           border-none shadow-lg shadow-pink-500/30
                                           hover:shadow-pink-400/50 hover:shadow-xl
                                           transform hover:scale-105 transition-all duration-300"
            >
              <UserGroupIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-orbitron font-semibold">Sponsor Interface</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full py-20 relative">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />

          <div className="max-w-6xl mx-auto px-8 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 holo-text font-orbitron">How StuCredi Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* NFT System */}
              <div
                className="glass-card p-8 rounded-3xl text-center group hover:scale-105 
                             transition-all duration-300 float-element"
              >
                <div
                  className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full 
                               w-20 h-20 mx-auto mb-6 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-300
                               shadow-lg shadow-purple-500/30 group-hover:shadow-purple-400/50"
                >
                  <ShieldCheckIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 neon-text-purple font-orbitron">NFT Participation</h3>
                <p className="text-white/70 leading-relaxed font-rajdhani">
                  Earn NFTs by participating in tech events. Each NFT adds 5 points to your academic score.
                </p>
              </div>

              {/* Grade System */}
              <div
                className="glass-card p-8 rounded-3xl text-center group hover:scale-105 
                             transition-all duration-300 float-delayed"
              >
                <div
                  className="bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-full 
                               w-20 h-20 mx-auto mb-6 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-300
                               shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50"
                >
                  <ChartBarIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 neon-text font-orbitron">Grade-Based Rewards</h3>
                <p className="text-white/70 leading-relaxed font-rajdhani">
                  Submit your academic grades (1-100) to receive RATE tokens based on performance + NFT bonus.
                </p>
              </div>

              {/* Token Redemption */}
              <div
                className="glass-card p-8 rounded-3xl text-center group hover:scale-105 
                             transition-all duration-300 float-element"
              >
                <div
                  className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-full 
                               w-20 h-20 mx-auto mb-6 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-300
                               shadow-lg shadow-orange-500/30 group-hover:shadow-orange-400/50"
                >
                  <CurrencyDollarIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 neon-text-pink font-orbitron">Token Redemption</h3>
                <p className="text-white/70 leading-relaxed font-rajdhani">
                  Convert RATE tokens to USDC at a fixed rate (1 RATE = 0.000010 USDC).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Information Section */}
        <div className="w-full py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 holo-text font-orbitron">Avalanche Fuji Testnet</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contract addresses with glass morphism */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-cyan-400 mb-3 font-orbitron">CustomNFT Contract</h3>
                <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                  0xa4ba4e9270bde8fbbf4328925959287a72ba0a55
                </code>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-pink-400 mb-3 font-orbitron">Vault Contract</h3>
                <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                  0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e
                </code>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-purple-400 mb-3 font-orbitron">RateMe Contract</h3>
                <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                  0x79e043686cce3ee4cd66fc2dbe15fda812da5285
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="w-full py-16">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 neon-text font-orbitron">Developer Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/debug"
                className="glass-card p-6 rounded-2xl text-center group 
                                           hover:border-cyan-500/50 transition-all duration-300"
              >
                <BugAntIcon
                  className="h-12 w-12 text-cyan-400 mx-auto mb-4 
                                      group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-lg font-semibold text-white mb-2 font-orbitron">Debug Contracts</h3>
                <p className="text-white/70 text-sm font-rajdhani">Interact with contracts directly</p>
              </Link>

              <Link
                href="/blockexplorer"
                className="glass-card p-6 rounded-2xl text-center group 
                                                   hover:border-pink-500/50 transition-all duration-300"
              >
                <MagnifyingGlassIcon
                  className="h-12 w-12 text-pink-400 mx-auto mb-4 
                                               group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-lg font-semibold text-white mb-2 font-orbitron">Block Explorer</h3>
                <p className="text-white/70 text-sm font-rajdhani">Browse transactions and blocks</p>
              </Link>

              <a
                href="https://testnet.snowtrace.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 rounded-2xl text-center group 
                           hover:border-purple-500/50 transition-all duration-300"
              >
                <ClockIcon
                  className="h-12 w-12 text-purple-400 mx-auto mb-4 
                                    group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-lg font-semibold text-white mb-2 font-orbitron">Snowtrace</h3>
                <p className="text-white/70 text-sm font-rajdhani">Avalanche Fuji Explorer</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
