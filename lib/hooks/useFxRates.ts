import { useQuery } from "@tanstack/react-query";
import { FX_API } from "@/lib/contracts";

export interface FxRate {
  pair: string;
  spot: number;
  forward: {
    "1M": number;
    "3M": number;
    "6M": number;
    "12M": number;
  };
  timestamp: number;
}

export interface ForwardRate {
  pair: string;
  tenor: string;
  rate: number;
  expiry: string;
  forwardPoints: number;
  spot: number;
}

// Mock data for development
const mockFxRates: FxRate = {
  pair: "USD/KES",
  spot: 129.15,
  forward: {
    "1M": 129.45,
    "3M": 130.12,
    "6M": 130.97,
    "12M": 132.85,
  },
  timestamp: Date.now(),
};

const mockForwardRates: ForwardRate[] = [
  {
    pair: "USD/KES",
    tenor: "6M",
    rate: 130.97,
    expiry: "31 Dec 2025",
    forwardPoints: 1.82,
    spot: 129.15,
  },
];

export function useFxRates() {
  return useQuery({
    queryKey: ["fx-rates"],
    queryFn: async (): Promise<FxRate> => {
      // In production, this would fetch from your API
      // const response = await fetch(`${FX_API.BASE_URL}${FX_API.ENDPOINTS.RATES}`);
      // return response.json();

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockFxRates), 1000);
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function useForwardRates(tenor: string = "6M") {
  return useQuery({
    queryKey: ["forward-rates", tenor],
    queryFn: async (): Promise<ForwardRate> => {
      // In production, this would fetch from your API
      // const response = await fetch(`${FX_API.BASE_URL}${FX_API.ENDPOINTS.FORWARD_RATES}?tenor=${tenor}`);
      // return response.json();

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const rate =
            mockForwardRates.find((r) => r.tenor === tenor) ||
            mockForwardRates[0];
          resolve(rate);
        }, 1000);
      });
    },
    staleTime: 1000 * 30, // 30 seconds for forward rates
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
}

export function useHistoricalRates(pair: string, days: number = 30) {
  return useQuery({
    queryKey: ["historical-rates", pair, days],
    queryFn: async () => {
      // In production, this would fetch from your API
      // const response = await fetch(`${FX_API.BASE_URL}${FX_API.ENDPOINTS.HISTORICAL}?pair=${pair}&days=${days}`);
      // return response.json();

      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            rate: 129.15 + Math.random() * 2 - 1, // Random rate around 129.15
          }));
          resolve(data);
        }, 1000);
      });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
