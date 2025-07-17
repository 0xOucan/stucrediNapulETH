"use client";

// @refresh reset
import { useReducer } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo({ contractName });
  const networkColor = useNetworkColor();

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="glass-card bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-cyan-400 font-orbitron">{contractName}</span>
                <Address address={deployedContractData.address} onlyEnsOrAddress />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm text-white/80 font-rajdhani">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm font-rajdhani">
                <span className="font-bold text-white/80">Network</span>:{" "}
                <span style={{ color: networkColor }}>{targetNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-purple-500/20 border border-purple-500/30">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="glass-card bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl shadow-lg shadow-cyan-500/20 border border-cyan-500/30 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-cyan-500/30">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm font-orbitron font-semibold text-cyan-400">Read</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-cyan-500/20">
                <ContractReadMethods deployedContractData={deployedContractData} />
              </div>
            </div>
          </div>
          <div className="z-10">
            <div className="glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl shadow-lg shadow-purple-500/20 border border-purple-500/30 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-purple-500/30">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm font-orbitron font-semibold text-purple-400">Write</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-purple-500/20">
                <ContractWriteMethods
                  deployedContractData={deployedContractData}
                  onChange={triggerRefreshDisplayVariables}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
