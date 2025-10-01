"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
  };

  if (!mounted) {
    return (
      <Button
        variant="link"
        disabled
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 opacity-50"
      >
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full border border-border">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
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
      onClick={connectWallet}
      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
    >
      Connect Wallet
    </Button>
  );
}
