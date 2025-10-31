"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { celo } from "wagmi/chains";

const queryClient = new QueryClient();

export function PrivyWagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Appearance customization
        appearance: {
          theme: "light",
          accentColor: "#00D4AA",
          logo: "/numo-logo.png",
        },
        // Embedded wallets configuration
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
          showWalletUIs: false, // Hide default wallet UIs for white label experience
          noPromptOnSignature: true, // Don't show default UI for signatures and transactions
        },
        // Login methods
        // Note: To enable Google, configure it in Privy dashboard first
        loginMethods: ["email", "wallet"],
        // Default chain
        defaultChain: celo,
        // Supported chains
        supportedChains: [celo],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
