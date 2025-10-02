"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForwardRates } from "@/lib/hooks/useFxRates";
import { useWalletInfo } from "@/lib/hooks/useWallet";

export function ForwardInterface() {
  const [tenor, setTenor] = useState("6M");
  const [notional, setNotional] = useState("1000000");
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [countdown, setCountdown] = useState(30);

  // Use wagmi hooks
  const { isConnected } = useWalletInfo();
  const { data: forwardRateData, isLoading, error } = useForwardRates(tenor);

  // Fallback to mock data if API is not available
  const forwardRate = forwardRateData?.rate?.toFixed(4) || "130.9700";
  const spotRate = forwardRateData?.spot?.toFixed(4) || "129.1500";
  const forwardPoints = forwardRateData?.forwardPoints?.toFixed(2) || "1.82";
  const expiryDate = forwardRateData?.expiry || "31 Dec 2025";

  const tenors = ["1M", "3M", "6M", "12M", "Custom"];

  // Calculate delivery amount (simplified)
  const deliveryAmount =
    currency === "USD"
      ? (parseFloat(notional) * parseFloat(forwardRate)).toLocaleString()
      : (parseFloat(notional) / parseFloat(forwardRate)).toLocaleString();

  return (
    <div className="bg-muted/80 rounded-3xl px-8 py-16 lg:px-16 lg:py-24 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header with rate and countdown */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            USD/KES Forward Trading
          </h1>
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full border border-border">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{countdown} sec</span>
            </div>
          </div>
        </div>

        {/* Forward Rate Display */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Forward (USD/KES) @ {expiryDate}
          </p>
          <p className="text-6xl font-bold text-primary">{forwardRate}</p>
          <p className="text-sm text-muted-foreground">KES per USD</p>
          <p className="text-sm text-muted-foreground">
            Forward points:{" "}
            <span className="text-primary font-semibold">+{forwardPoints}</span>{" "}
            vs spot {spotRate}
          </p>
        </div>

        {/* Tenor Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Tenor</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {tenors.map((t) => (
              <Button
                key={t}
                variant={tenor === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTenor(t)}
                className="rounded-full"
              >
                {t}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Expiry: {expiryDate}
          </p>
        </div>

        {/* Notional Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Enter {currency} Notional
          </h3>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="number"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              value={notional}
              onChange={(e) => setNotional(e.target.value)}
              placeholder="1000000"
            />
            <div className="flex">
              <Button
                variant={currency === "USD" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency("USD")}
                className="rounded-l-lg rounded-r-none border-r-0"
              >
                USD
              </Button>
              <Button
                variant={currency === "KES" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency("KES")}
                className="rounded-l-none rounded-r-lg"
              >
                KES
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="space-y-4 p-6 bg-background/50 rounded-2xl border border-border">
          <div className="flex justify-between items-center">
            <span className="text-foreground">You'll receive at expiry:</span>
            <span className="text-primary font-semibold text-lg">
              {currency === "USD" ? notional : deliveryAmount} {currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground">You'll deliver at expiry:</span>
            <span className="text-muted-foreground font-semibold text-lg">
              {currency === "USD" ? deliveryAmount : notional}{" "}
              {currency === "USD" ? "KES" : "USD"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-border">
            <span>Dealer spread + Numo fee:</span>
            <span>0.15%</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="rounded-full px-12 py-4 h-14 text-lg"
            disabled={!isConnected || isLoading}
          >
            {!isConnected
              ? "Connect Wallet to Trade"
              : isLoading
              ? "Loading Rates..."
              : "Accept & Lock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
