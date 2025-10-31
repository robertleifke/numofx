"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivy, useLogin, useLogout } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

export function WalletButton() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      console.log("User logged in successfully");
      setShowModal(false);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
  const { logout } = useLogout();
  const { address, chain } = useAccount();
  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = () => {
    login();
  };

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <Button disabled className="bg-primary text-primary-foreground rounded-full px-6">
        Loading...
      </Button>
    );
  }

  if (authenticated && address) {
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
          onClick={logout}
          className="rounded-full"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnectClick}
      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
    >
      Connect Wallet
    </Button>
  );
}
