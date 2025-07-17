import "@rainbow-me/rainbowkit/styles.css";
import ParticleSystem from "~~/components/ParticleSystem";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "StuCredi - Student Credit Platform",
  description:
    "Decentralized student credit system based on academic performance and event participation. Built with 🏗 Scaffold-ETH 2 for NapulETH Hackathon.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``} data-theme="vaporwave">
      <body>
        <ThemeProvider enableSystem>
          <ParticleSystem />
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
