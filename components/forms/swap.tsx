"use client";

import { Settings, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useForwardRates } from "@/lib/hooks/useFxRates";
import { useWalletInfo } from "@/lib/hooks/useWallet";
import {
  usePoolInfo,
  useSellBasePreview,
  useImpliedRate,
  useSellBase,
  calculateMinOutput,
  type PoolName,
} from "@/lib/hooks/useYieldSpacePools";
import { useApprovalWorkflow } from "@/lib/hooks/useTokenApproval";
import { parseUnits, formatUnits, type Address } from "viem";
import { useAccount } from "wagmi";

export function ForwardInterface() {
  const [usdAmount, setUsdAmount] = useState("1000000");
  const [showDetails, setShowDetails] = useState(false);
  const [slippageBps, setSlippageBps] = useState(50); // 0.5% default slippage
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // Use wagmi hooks
  const { isConnected } = useWalletInfo();
  const { address } = useAccount();

  // For now, default to cKES pool - this could be made configurable
  const poolName: PoolName = "PoolNonTv_cKES";
  const poolInfo = usePoolInfo(poolName);

  // Parse USD input amount to bigint (assuming 18 decimals for base token)
  const baseAmountBigInt = useMemo(() => {
    const cleanAmount = usdAmount.replace(/,/g, "");
    if (!cleanAmount || parseFloat(cleanAmount) <= 0) return undefined;
    try {
      return parseUnits(cleanAmount, 18); // Assuming 18 decimals
    } catch {
      return undefined;
    }
  }, [usdAmount]);

  // Get preview of how many FY tokens user will receive
  const { fyTokenOut, isLoading: isLoadingPreview } = useSellBasePreview(poolName, baseAmountBigInt);

  // Get implied rate from pool
  const { rate: impliedRate, isLoading: isLoadingRate } = useImpliedRate(poolName);

  // Calculate minimum output with slippage protection
  const minFYTokenOut = useMemo(() => {
    if (!fyTokenOut) return undefined;
    return calculateMinOutput(fyTokenOut, slippageBps);
  }, [fyTokenOut, slippageBps]);

  // Token approval workflow
  const {
    needsApproval,
    approve,
    isPending: isApproving,
    isConfirming: isConfirmingApproval,
    isSuccess: isApprovalSuccess,
  } = useApprovalWorkflow(
    poolInfo.baseToken,
    address,
    poolInfo.address,
    baseAmountBigInt ?? 0n
  );

  // Sell base transaction
  const {
    sellBase,
    hash: sellHash,
    isPending: isSelling,
    error: sellError,
  } = useSellBase();

  // Track transaction hash
  useEffect(() => {
    if (sellHash) {
      setTxHash(sellHash);
    }
  }, [sellHash]);

  // Fallback to mock data for display if pool data not available
  const { data: forwardRateData } = useForwardRates("3M");
  const forwardRate = impliedRate?.toFixed(4) || forwardRateData?.rate?.toFixed(4) || "130.9700";
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

          {/* Transaction Status Messages */}
          {txHash && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-900 dark:text-green-100">
                  Transaction submitted!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 break-all">
                  Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              </div>
            </div>
          )}

          {sellError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-red-900 dark:text-red-100">
                  Transaction failed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {sellError.message}
                </p>
              </div>
            </div>
          )}

          {/* Lock Button or Approve Button */}
          {!isConnected ? (
            <Button
              size="lg"
              className="w-full rounded-full h-12 text-sm font-semibold bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled
            >
              Connect Wallet to Continue
            </Button>
          ) : needsApproval && baseAmountBigInt ? (
            <Button
              size="lg"
              className="w-full rounded-full h-12 text-sm font-semibold bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
              onClick={approve}
              disabled={isApproving || isConfirmingApproval}
            >
              {isApproving
                ? "Approving..."
                : isConfirmingApproval
                ? "Confirming Approval..."
                : "Approve Token Spending"}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full rounded-full h-12 text-sm font-semibold bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
              disabled={
                isLoadingPreview ||
                isLoadingRate ||
                !usdAmount ||
                parseFloat(usdAmount) <= 0 ||
                !address ||
                !minFYTokenOut ||
                isSelling
              }
              onClick={() => {
                if (address && minFYTokenOut) {
                  sellBase(poolName, address, baseAmountBigInt!, minFYTokenOut);
                }
              }}
            >
              {isSelling
                ? "Locking Rate..."
                : isLoadingPreview
                ? "Loading preview..."
                : "Lock This Rate"}
            </Button>
          )}

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
                <span className="text-muted-foreground">Pool fee</span>
                <span className="text-foreground font-medium">{poolInfo.g1Fee / 100}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage tolerance</span>
                <span className="text-foreground font-medium">{slippageBps / 100}%</span>
              </div>
              {fyTokenOut && minFYTokenOut && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected FY tokens</span>
                    <span className="text-foreground font-medium">
                      {formatUnits(fyTokenOut, 18)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum FY tokens</span>
                    <span className="text-foreground font-medium">
                      {formatUnits(minFYTokenOut, 18)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pool address</span>
                <span className="text-foreground font-medium font-mono">
                  {poolInfo.address.slice(0, 6)}...{poolInfo.address.slice(-4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
