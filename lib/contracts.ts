import { Address } from "viem";

export const CONTRACTS = {
  CKES: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as Address,
  USDT: "0x48065fbce25e41a7f0b4a4a3f65c8e5c7b9c1b5" as Address,
  FYCKES: "0x774Dce3065C04A61D564470f78b07411Bd38edc5" as Address,
  FYUSDT: "0xCD3F00B3C646210DE13557d6C555E98efea7F767" as Address,
} as const;

export const TOKEN_METADATA = {
  [CONTRACTS.CKES]: {
    name: "Mento Kenyan Shilling",
    symbol: "cKES",
    decimals: 18,
    logo: "/tokens/ckes.png",
    color: "#00D4AA",
  },
  [CONTRACTS.FYCKES]: {
    name: "Zero Coupon cKES",
    symbol: "fyCKES",
    decimals: 18,
    logo: "/tokens/fyckes.png",
    color: "#00D4AA",
  },
  [CONTRACTS.USDT]: {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logo: "/tokens/usdt.png",
    color: "#26A17B",
  },
  [CONTRACTS.FYUSDT]: {
    name: "Zero Coupon USDT",
    symbol: "fyUSDT",
    decimals: 6,
    logo: "/tokens/fyusdt.png",
    color: "#00D4AA",
  },
} as const;

export const YIELDSPACE_CONTRACTS = {
  CELO_MAINNET: "0x0000000000000000000000000000000000000000" as Address, 
  // CELO_SEPOLIA: "0x0000000000000000000000000000000000000000" as Address,
} as const;

export const NETWORKS = {
  CELO_MAINNET: {
    chainId: 42220,
    name: "Celo Mainnet",
    rpcUrl: "https://forno.celo.org",
    blockExplorer: "https://celoscan.io",
  },
  // CELO_SEPOLIA: {
  //   chainId: 44787,
  //   name: "Celo Sepolia",
  //   rpcUrl: "https://sepolia-forno.celo-testnet.org",
  //   blockExplorer: "https://sepolia.celoscan.io",
  // },
} as const;

export const FORWARD_RATE_API = {
  BASE_URL: process.env.NEXT_PUBLIC_FX_API_URL || "https://api.numofx.com",
  ENDPOINTS: {
    RATES: "/api/rates",
    FORWARD_RATES: "/api/forward-rates",
    HISTORICAL: "/api/historical",
  },
} as const;
