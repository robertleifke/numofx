import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { CONTRACTS, TOKEN_METADATA } from "@/lib/contracts";
import { formatUnits } from "viem";

export function useWalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  return {
    address,
    isConnected,
    chain,
    chainId,
    switchChain,
  };
}

export function useTokenBalance(tokenAddress?: `0x${string}`) {
  const { address } = useAccount();

  const { data: balance, ...rest } = useBalance({
    address,
    token: tokenAddress,
  });

  return {
    balance,
    formattedBalance: balance
      ? formatUnits(balance.value, balance.decimals)
      : "0",
    ...rest,
  };
}

export function useAllTokenBalances() {
  const { address, isConnected } = useAccount();

  const tokenAddresses = Object.values(CONTRACTS);

  const queries = tokenAddresses.map((tokenAddress) => ({
    queryKey: ["token-balance", address, tokenAddress],
    queryFn: async () => {
      // This would typically use useBalance hook, but for multiple tokens
      // you might want to batch the requests or use a multicall contract
      return {
        address: tokenAddress,
        balance: "0", // Mock for now
        metadata: TOKEN_METADATA[tokenAddress as keyof typeof TOKEN_METADATA],
      };
    },
    enabled: !!address && isConnected,
    staleTime: 1000 * 30, // 30 seconds
  }));

  return useQuery({
    queryKey: ["all-token-balances", address],
    queryFn: async () => {
      // In a real implementation, you'd fetch all balances here
      return tokenAddresses.map((address) => ({
        address,
        balance: "0",
        metadata: TOKEN_METADATA[address as keyof typeof TOKEN_METADATA],
      }));
    },
    enabled: !!address && isConnected,
    staleTime: 1000 * 30,
  });
}

export function useForwardContract() {
  const { address, isConnected, chainId } = useAccount();

  return useQuery({
    queryKey: ["forward-contract", chainId],
    queryFn: async () => {
      // This would return the contract instance or ABI
      return {
        address: "0x0000000000000000000000000000000000000000", // Mock address
        abi: [], // Mock ABI
        chainId,
      };
    },
    enabled: isConnected,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
