"use client";

import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

export function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    // Try to connect with MetaMask first, then fallback to other connectors
    const metaMaskConnector = connectors.find(
      (connector) => connector.id === "injected"
    );
    const connector = metaMaskConnector || connectors[0];

    if (connector) {
      connect({ connector });
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full border border-border">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {chain && (
            <span className="text-xs text-muted-foreground">{chain.name}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="rounded-full"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="link"
      onClick={handleConnect}
      disabled={isPending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
