import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address, erc20Abi, maxUint256 } from 'viem';

/**
 * Check if a spender has sufficient allowance for a token
 */
export function useTokenAllowance(
  tokenAddress: Address | undefined,
  owner: Address | undefined,
  spender: Address | undefined
) {
  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!tokenAddress && !!owner && !!spender,
    },
  });

  return {
    allowance: allowance ?? 0n,
    isLoading,
    refetch,
  };
}

/**
 * Check if approval is needed for a specific amount
 */
export function useNeedsApproval(
  tokenAddress: Address | undefined,
  owner: Address | undefined,
  spender: Address | undefined,
  amount: bigint
) {
  const { allowance, isLoading } = useTokenAllowance(tokenAddress, owner, spender);

  return {
    needsApproval: allowance < amount,
    currentAllowance: allowance,
    isLoading,
  };
}

/**
 * Approve a spender to spend tokens
 */
export function useTokenApproval() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();

  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (tokenAddress: Address, spender: Address, amount: bigint = maxUint256) => {
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    receipt,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}

/**
 * Get token balance for an address
 */
export function useTokenBalance(tokenAddress: Address | undefined, owner: Address | undefined) {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!tokenAddress && !!owner,
    },
  });

  return {
    balance: balance ?? 0n,
    isLoading,
    refetch,
  };
}

/**
 * Get token metadata (decimals, symbol, name)
 */
export function useTokenMetadata(tokenAddress: Address | undefined) {
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    decimals,
    symbol,
    name,
  };
}

/**
 * Combined hook for approval workflow
 * Checks if approval is needed and provides approve function
 */
export function useApprovalWorkflow(
  tokenAddress: Address | undefined,
  owner: Address | undefined,
  spender: Address | undefined,
  amount: bigint
) {
  const { needsApproval, currentAllowance, isLoading: isCheckingAllowance } = useNeedsApproval(
    tokenAddress,
    owner,
    spender,
    amount
  );

  const { approve, isPending, isConfirming, isSuccess, error, reset } = useTokenApproval();

  return {
    needsApproval,
    currentAllowance,
    approve: () => tokenAddress && spender && approve(tokenAddress, spender),
    isPending,
    isConfirming,
    isSuccess,
    isCheckingAllowance,
    error,
    reset,
  };
}
