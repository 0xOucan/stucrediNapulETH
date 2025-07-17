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
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

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
          <Card variant="glass" className="max-w-md mx-auto mb-8 text-center animate-bounce-in">
            <CardContent className="p-6">
              <p className="font-medium text-white/90 font-orbitron mb-3">Connected Address:</p>
              <div className="mb-3">
                <Address address={connectedAddress} />
              </div>
              {isDeployer && (
                <Badge variant="glow" className="mt-2">
                  Admin/Sponsor
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Role-based Navigation */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
            <Button asChild variant="secondary" size="xl" className="group">
              <Link href="/student">
                <AcademicCapIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Student Interface
              </Link>
            </Button>
            <Button asChild variant="vaporwave" size="xl" className="group">
              <Link href="/sponsor">
                <UserGroupIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Sponsor Interface
              </Link>
            </Button>
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
              <Card
                variant="glass"
                float
                className="text-center group hover:scale-105 transition-all duration-300 animate-bounce-in"
              >
                <CardHeader className="pb-4">
                  <div
                    className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full 
                                 w-20 h-20 mx-auto mb-4 flex items-center justify-center
                                 group-hover:scale-110 transition-transform duration-300
                                 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-400/50"
                  >
                    <ShieldCheckIcon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl neon-text-purple">NFT Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Earn NFTs by participating in tech events. Each NFT adds 5 points to your academic score.
                  </CardDescription>
                  <Badge variant="glow" className="mt-4">
                    +5 Points
                  </Badge>
                </CardContent>
              </Card>

              {/* Grade System */}
              <Card
                variant="glass"
                float
                className="text-center group hover:scale-105 transition-all duration-300 animate-bounce-in animation-delay-150"
              >
                <CardHeader className="pb-4">
                  <div
                    className="bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-full 
                                 w-20 h-20 mx-auto mb-4 flex items-center justify-center
                                 group-hover:scale-110 transition-transform duration-300
                                 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50"
                  >
                    <ChartBarIcon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl neon-text">Grade-Based Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Submit your academic grades (1-100) to receive RATE tokens based on performance + NFT bonus.
                  </CardDescription>
                  <Badge variant="secondary" className="mt-4">
                    1-150 RATE
                  </Badge>
                </CardContent>
              </Card>

              {/* Token Redemption */}
              <Card
                variant="glass"
                float
                className="text-center group hover:scale-105 transition-all duration-300 animate-bounce-in animation-delay-300"
              >
                <CardHeader className="pb-4">
                  <div
                    className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-full 
                                 w-20 h-20 mx-auto mb-4 flex items-center justify-center
                                 group-hover:scale-110 transition-transform duration-300
                                 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-400/50"
                  >
                    <CurrencyDollarIcon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl neon-text-pink">Token Redemption</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Convert RATE tokens to USDC at a fixed rate (1 RATE = 0.000010 USDC).
                  </CardDescription>
                  <Badge variant="success" className="mt-4">
                    Instant
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contract Information Section */}
        <div className="w-full py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 holo-text font-orbitron">Avalanche Fuji Testnet</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="glass" className="group hover:scale-105 transition-all duration-300 animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-lg">CustomNFT Contract</CardTitle>
                  <CardDescription>NFT participation rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                    0xa4ba4e9270bde8fbbf4328925959287a72ba0a55
                  </code>
                  <Badge variant="secondary" className="mt-3">
                    NFT Minting
                  </Badge>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="group hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-150"
              >
                <CardHeader>
                  <CardTitle className="text-pink-400 text-lg">Vault Contract</CardTitle>
                  <CardDescription>USDC funding management</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                    0x3d6cb29a1f97a2cff7a48af96f7ed3a02f6aa38e
                  </code>
                  <Badge variant="success" className="mt-3">
                    Funded
                  </Badge>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="group hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300"
              >
                <CardHeader>
                  <CardTitle className="text-purple-400 text-lg">RateMe Contract</CardTitle>
                  <CardDescription>Grade submission & token claiming</CardDescription>
                </CardHeader>
                <CardContent>
                  <code className="text-sm text-white/80 break-all bg-black/20 p-3 rounded-lg block">
                    0x79e043686cce3ee4cd66fc2dbe15fda812da5285
                  </code>
                  <Badge variant="default" className="mt-3">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="w-full py-16">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12 neon-text font-orbitron">Developer Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                variant="glass"
                className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up"
              >
                <CardContent className="p-6">
                  <BugAntIcon className="h-12 w-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg mb-2">Debug Contracts</CardTitle>
                  <CardDescription className="text-sm">Interact with contracts directly</CardDescription>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href="/debug">Open Debug</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-150"
              >
                <CardContent className="p-6">
                  <MagnifyingGlassIcon className="h-12 w-12 text-pink-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg mb-2">Block Explorer</CardTitle>
                  <CardDescription className="text-sm">Browse transactions and blocks</CardDescription>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href="/blockexplorer">Explore Blocks</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300"
              >
                <CardContent className="p-6">
                  <ClockIcon className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg mb-2">Snowtrace</CardTitle>
                  <CardDescription className="text-sm">Avalanche Fuji Explorer</CardDescription>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <a href="https://testnet.snowtrace.io/" target="_blank" rel="noopener noreferrer">
                      View on Snowtrace
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
