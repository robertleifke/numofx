"use client";

import { PrivyWagmiProvider } from "./privy-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PrivyWagmiProvider>{children}</PrivyWagmiProvider>;
}
