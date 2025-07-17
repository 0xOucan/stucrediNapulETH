"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { AcademicCapIcon, Bars3Icon, BugAntIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Student",
    href: "/student",
    icon: <AcademicCapIcon className="h-4 w-4" />,
  },
  {
    label: "Sponsor",
    href: "/sponsor",
    icon: <UserGroupIcon className="h-4 w-4" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/20 border border-purple-500/30"
                  : "bg-white/5 border border-white/10"
              } hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/50 focus:!bg-gradient-to-r focus:!from-purple-500/30 focus:!to-pink-500/30 active:!text-white py-2 px-4 text-sm rounded-xl gap-2 grid grid-flow-col transition-all duration-300 backdrop-blur-sm font-rajdhani font-medium text-white/90 hover:text-white`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar glass-card min-h-0 shrink-0 justify-between z-20 shadow-lg shadow-purple-500/10 px-4 sm:px-6 border-b border-white/10">
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-white/10 border border-white/10 backdrop-blur-sm">
            <Bars3Icon className="h-6 w-6 text-cyan-400" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-4 glass-card w-64 border border-white/20"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-3 ml-4 mr-6 shrink-0 group">
          <div className="flex relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
            <Image alt="StuCredi logo" className="cursor-pointer drop-shadow-lg" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight text-white font-orbitron text-lg neon-text">🎓 StuCredi</span>
            <span className="text-sm text-white/70 font-rajdhani">Student Credit Platform</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-3">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4 gap-4">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
