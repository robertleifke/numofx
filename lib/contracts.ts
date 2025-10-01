import { Address } from "viem";

// Celo Mainnet Contract Addresses
export const CONTRACTS = {
  // CELO (Native token)
  CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438" as Address,

  // cUSD (Celo Dollar)
  CUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as Address,

  // cEUR (Celo Euro)
  CEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" as Address,

  // USDC on Celo
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as Address,

  // USDT on Celo
  USDT: "0x48065fbce25e41a7f0b4a4a3f65c8e5c7b9c1b5" as Address,
} as const;

// Token metadata for display
export const TOKEN_METADATA = {
  [CONTRACTS.CELO]: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
    logo: "/tokens/celo.png",
    color: "#35D07F",
  },
  [CONTRACTS.CUSD]: {
    name: "Celo Dollar",
    symbol: "cUSD",
    decimals: 18,
    logo: "/tokens/cusd.png",
    color: "#00D4AA",
  },
  [CONTRACTS.CEUR]: {
    name: "Celo Euro",
    symbol: "cEUR",
    decimals: 18,
    logo: "/tokens/ceur.png",
    color: "#00D4AA",
  },
  [CONTRACTS.USDC]: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logo: "/tokens/usdc.png",
    color: "#2775CA",
  },
  [CONTRACTS.USDT]: {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logo: "/tokens/usdt.png",
    color: "#26A17B",
  },
} as const;

// Forward contract addresses (these would be your actual deployed contracts)
export const FORWARD_CONTRACTS = {
  // Mainnet
  CELO_MAINNET: "0x0000000000000000000000000000000000000000" as Address, // Replace with actual address

  // Testnet
  CELO_ALFAJORES: "0x0000000000000000000000000000000000000000" as Address, // Replace with actual address
} as const;

// Network configurations
export const NETWORKS = {
  CELO_MAINNET: {
    chainId: 42220,
    name: "Celo Mainnet",
    rpcUrl: "https://forno.celo.org",
    blockExplorer: "https://celoscan.io",
  },
  CELO_ALFAJORES: {
    chainId: 44787,
    name: "Celo Alfajores",
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    blockExplorer: "https://alfajores.celoscan.io",
  },
} as const;

// FX Rate API endpoints (mock for now)
export const FX_API = {
  BASE_URL: process.env.NEXT_PUBLIC_FX_API_URL || "https://api.numofx.com",
  ENDPOINTS: {
    RATES: "/api/rates",
    FORWARD_RATES: "/api/forward-rates",
    HISTORICAL: "/api/historical",
  },
} as const;
