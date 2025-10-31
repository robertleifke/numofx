import { http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";

// Privy + wagmi configuration
// IMPORTANT: createConfig must be imported from @privy-io/wagmi, not from wagmi
// This ensures proper integration with Privy's embedded wallets

export const config = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
  },
});
