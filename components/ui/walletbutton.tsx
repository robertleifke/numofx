"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  // Debug: Log available connectors
  console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })));

  const handleConnectClick = async (connector: any) => {
    try {
      await connect({ connector });
      setShowModal(false);
    } catch (error) {
      console.error("Connection failed:", error);
      // Keep modal open on error so user can try another wallet
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
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background rounded-2xl p-6 max-w-md w-full mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Connect Wallet
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {connectors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No wallets detected. Please install MetaMask or another Web3 wallet.
                </div>
              ) : (
                connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleConnectClick(connector)}
                    disabled={isPending}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      </div>
                      <span className="font-medium text-foreground">
                        {connector.name}
                      </span>
                    </div>
                    {isPending ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-xs text-destructive">
                  {error.message || "Failed to connect. Please try again."}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4 text-center">
              By connecting your wallet, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </>
  );
}
