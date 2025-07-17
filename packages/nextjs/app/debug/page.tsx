import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div className="text-center mt-8 glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-10 border border-purple-500/30 shadow-lg shadow-purple-500/20">
        <h1 className="text-4xl my-0 font-orbitron font-bold neon-text-purple">Debug Contracts</h1>
        <p className="text-white/80 font-rajdhani text-lg">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic glass-card bg-cyan-500/20 text-cyan-400 font-bold [word-spacing:-0.5rem] px-2 py-1 rounded border border-cyan-500/30 font-mono">
            packages / nextjs / app / debug / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
