"use client";

import { Settings, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForwardRates } from "@/lib/hooks/useFxRates";
import { useWalletInfo } from "@/lib/hooks/useWallet";

export function ForwardInterface() {
  const [usdAmount, setUsdAmount] = useState("1000000");
  const [showDetails, setShowDetails] = useState(false);

  // Use wagmi hooks
  const { isConnected } = useWalletInfo();

  // Default to 3M tenor as that's the target
  const { data: forwardRateData, isLoading, error } = useForwardRates("3M");

  // Fallback to mock data if API is not available
  const forwardRate = forwardRateData?.rate?.toFixed(4) || "130.9700";
  const spotRate = forwardRateData?.spot?.toFixed(4) || "129.1500";
  const forwardPoints = forwardRateData?.forwardPoints?.toFixed(2) || "1.82";
  const expiryDate = forwardRateData?.expiry || "Dec 31, 2025";

  // Calculate KES amount
  const kesAmount = (parseFloat(usdAmount.replace(/,/g, "") || "0") * parseFloat(forwardRate)).toFixed(0);
  const formattedKesAmount = parseFloat(kesAmount).toLocaleString();
  const formattedUsdAmount = parseFloat(usdAmount.replace(/,/g, "") || "0").toLocaleString();

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">LOCK RATE</h1>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Locked Rate Display */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Locked rate</p>
            <p className="text-5xl font-bold text-foreground tracking-tight leading-none">
              {forwardRate}
            </p>
            <p className="text-xs text-muted-foreground">KES per USD</p>
          </div>

          {/* USD Input */}
          <div className="space-y-2">
            <label className="text-xs text-foreground font-medium">
              How much USD do you need to pay?
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                className="w-full text-3xl font-bold text-foreground bg-transparent border-none outline-none pr-20 leading-tight"
                value={usdAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(value)) {
                    setUsdAmount(value);
                  }
                }}
                placeholder="1000000"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-8 h-8 border border-border rounded overflow-hidden flex-shrink-0">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    {/* Red background */}
                    <rect width="32" height="32" fill="#B22234"/>
                    {/* White stripes */}
                    <rect y="0" width="32" height="2.5" fill="#FFF"/>
                    <rect y="5" width="32" height="2.5" fill="#FFF"/>
                    <rect y="10" width="32" height="2.5" fill="#FFF"/>
                    <rect y="15" width="32" height="2.5" fill="#FFF"/>
                    <rect y="20" width="32" height="2.5" fill="#FFF"/>
                    <rect y="25" width="32" height="2.5" fill="#FFF"/>
                    <rect y="30" width="32" height="2" fill="#FFF"/>
                    {/* Blue canton */}
                    <rect width="13" height="16" fill="#3C3B6E"/>
                    {/* Stars */}
                    <circle cx="2" cy="2" r="0.8" fill="#FFF"/>
                    <circle cx="5" cy="2" r="0.8" fill="#FFF"/>
                    <circle cx="8" cy="2" r="0.8" fill="#FFF"/>
                    <circle cx="11" cy="2" r="0.8" fill="#FFF"/>
                    <circle cx="2" cy="5" r="0.8" fill="#FFF"/>
                    <circle cx="5" cy="5" r="0.8" fill="#FFF"/>
                    <circle cx="8" cy="5" r="0.8" fill="#FFF"/>
                    <circle cx="11" cy="5" r="0.8" fill="#FFF"/>
                    <circle cx="2" cy="8" r="0.8" fill="#FFF"/>
                    <circle cx="5" cy="8" r="0.8" fill="#FFF"/>
                    <circle cx="8" cy="8" r="0.8" fill="#FFF"/>
                    <circle cx="11" cy="8" r="0.8" fill="#FFF"/>
                    <circle cx="2" cy="11" r="0.8" fill="#FFF"/>
                    <circle cx="5" cy="11" r="0.8" fill="#FFF"/>
                    <circle cx="8" cy="11" r="0.8" fill="#FFF"/>
                    <circle cx="11" cy="11" r="0.8" fill="#FFF"/>
                    <circle cx="2" cy="14" r="0.8" fill="#FFF"/>
                    <circle cx="5" cy="14" r="0.8" fill="#FFF"/>
                    <circle cx="8" cy="14" r="0.8" fill="#FFF"/>
                    <circle cx="11" cy="14" r="0.8" fill="#FFF"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">USD</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              For payment to your supplier
            </p>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* KES Output */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">You'll pay</p>
            <div className="relative">
              <p className="text-4xl font-bold text-foreground tracking-tight leading-none pr-20">
                {formattedKesAmount}
              </p>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-8 h-8 border border-border rounded overflow-hidden flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path fill="#141414" d="M0 0h36v36H0z"/>
                    <path fill="#FFF" d="M0 8h36v4H0z"/>
                    <path fill="#FFF" d="M0 24h36v4H0z"/>
                    <path fill="#DC143C" d="M0 12h36v12H0z"/>
                    <path fill="#DC143C" d="M18 4c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14S25.732 4 18 4z"/>
                    <ellipse cx="18" cy="18" rx="5" ry="8" fill="#141414"/>
                    <ellipse cx="18" cy="18" rx="2.5" ry="8" fill="#FFF"/>
                    <circle cx="18" cy="18" r="3" fill="#FFF"/>
                    <path fill="#FFF" d="M13 10l-2 2 2 2-2 2 2 2 2-2-2-2 2-2-2-2zm10 0l-2 2 2 2-2 2 2 2 2-2-2-2 2-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">KES</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              ≈ ${formattedUsdAmount}
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Receive in 3 months</span>
              <span className="text-foreground font-medium">${formattedUsdAmount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Settlement date</span>
              <span className="text-foreground font-medium">{expiryDate} (3 months)</span>
            </div>
          </div>

          {/* Lock Button */}
          <Button
            size="lg"
            className="w-full rounded-full h-12 text-sm font-semibold bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
            disabled={isLoading || !usdAmount || parseFloat(usdAmount) <= 0}
          >
            {isLoading ? "Loading rate..." : "Lock This Rate"}
          </Button>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground">
            Know exactly how much KES you'll need - No surprises
          </p>

          {/* See Details Link */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            See rate details
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Collapsible Details */}
          {showDetails && (
            <div className="pt-3 space-y-2 text-xs border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spot rate</span>
                <span className="text-foreground font-medium">{spotRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forward points</span>
                <span className="text-foreground font-medium">+{forwardPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dealer spread</span>
                <span className="text-foreground font-medium">0.15%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
