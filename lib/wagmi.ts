import { createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { QueryClient } from "@tanstack/react-query";

// https://revoke.cash/learn/wallets/add-network/celo

// Function to get connectors - only initializes client-side
function getConnectors() {
  const connectors = [
    injected(), // Detects any injected wallet (MetaMask, Brave, etc.)
  ];

  // Only add WalletConnect and Coinbase on client-side to avoid SSR issues
  if (typeof window !== "undefined") {
    // Only add WalletConnect if projectId is configured
    const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

    if (walletConnectProjectId) {
      try {
        connectors.push(
          walletConnect({
            projectId: walletConnectProjectId,
            showQrModal: true,
          })
        );
      } catch (error) {
        console.warn("WalletConnect initialization failed:", error);
      }
    } else {
      console.warn("WalletConnect projectId not configured. Skipping WalletConnect connector.");
    }

    // Coinbase wallet doesn't require external config
    connectors.push(
      coinbaseWallet({
        appName: "Numo FX",
      })
    );
  }

  return connectors;
}

export const config = createConfig({
  chains: [celo, celoAlfajores],
  connectors: getConnectors(),
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
  },
  ssr: true,
});

// Create a client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});
