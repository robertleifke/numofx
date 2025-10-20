import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address, parseUnits, formatUnits } from 'viem';
import { PoolNonTv__factory, getPoolAddress, celoDeployments } from 'yieldspace-sdk';

// Pool names available on Celo
export type PoolName = 'PoolNonTv_cKES' | 'PoolNonTv_USDT';

/**
 * Get pool contract address for a specific pool
 */
export function usePoolAddress(poolName: PoolName) {
  return getPoolAddress('celo', poolName) as Address;
}

/**
 * Get pool deployment info from the SDK
 */
export function usePoolInfo(poolName: PoolName) {
  const deployment = celoDeployments.contracts[poolName];
  return {
    address: deployment.address as Address,
    baseToken: deployment.baseToken as Address,
    fyToken: deployment.fyToken as Address,
    maturity: deployment.maturity,
    g1Fee: deployment.g1Fee,
  };
}

/**
 * Get pool reserves (base and FY token balances)
 */
export function usePoolReserves(poolName: PoolName) {
  const poolAddress = usePoolAddress(poolName);
  const abi = PoolNonTv__factory.abi;

  const { data: baseBalance, isLoading: isLoadingBase } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'getBaseBalance',
  });

  const { data: fyTokenBalance, isLoading: isLoadingFy } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'getFYTokenBalance',
  });

  const { data: baseDecimals } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'baseDecimals',
  });

  return {
    baseBalance,
    fyTokenBalance,
    baseDecimals,
    isLoading: isLoadingBase || isLoadingFy,
  };
}

/**
 * Preview selling base tokens (user sells base, gets FY tokens)
 * This is used to lock in a forward rate
 */
export function useSellBasePreview(poolName: PoolName, baseAmount: bigint | undefined) {
  const poolAddress = usePoolAddress(poolName);
  const abi = PoolNonTv__factory.abi;

  const { data: fyTokenOut, isLoading, error } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'sellBasePreview',
    args: baseAmount !== undefined ? [baseAmount] : undefined,
    query: {
      enabled: baseAmount !== undefined && baseAmount > 0n,
    },
  });

  return {
    fyTokenOut,
    isLoading,
    error,
  };
}

/**
 * Preview buying base tokens (user pays FY tokens, gets base)
 */
export function useBuyBasePreview(poolName: PoolName, baseAmount: bigint | undefined) {
  const poolAddress = usePoolAddress(poolName);
  const abi = PoolNonTv__factory.abi;

  const { data: fyTokenIn, isLoading, error } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'buyBasePreview',
    args: baseAmount !== undefined ? [baseAmount] : undefined,
    query: {
      enabled: baseAmount !== undefined && baseAmount > 0n,
    },
  });

  return {
    fyTokenIn,
    isLoading,
    error,
  };
}

/**
 * Preview selling FY tokens (user sells FY tokens, gets base)
 */
export function useSellFYTokenPreview(poolName: PoolName, fyTokenAmount: bigint | undefined) {
  const poolAddress = usePoolAddress(poolName);
  const abi = PoolNonTv__factory.abi;

  const { data: baseOut, isLoading, error } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'sellFYTokenPreview',
    args: fyTokenAmount !== undefined ? [fyTokenAmount] : undefined,
    query: {
      enabled: fyTokenAmount !== undefined && fyTokenAmount > 0n,
    },
  });

  return {
    baseOut,
    isLoading,
    error,
  };
}

/**
 * Preview buying FY tokens (user pays base, gets FY tokens)
 */
export function useBuyFYTokenPreview(poolName: PoolName, fyTokenAmount: bigint | undefined) {
  const poolAddress = usePoolAddress(poolName);
  const abi = PoolNonTv__factory.abi;

  const { data: baseIn, isLoading, error } = useReadContract({
    address: poolAddress,
    abi,
    functionName: 'buyFYTokenPreview',
    args: fyTokenAmount !== undefined ? [fyTokenAmount] : undefined,
    query: {
      enabled: fyTokenAmount !== undefined && fyTokenAmount > 0n,
    },
  });

  return {
    baseIn,
    isLoading,
    error,
  };
}

/**
 * Get the current implied forward rate from the pool
 */
export function useImpliedRate(poolName: PoolName) {
  const { baseBalance, fyTokenBalance, isLoading } = usePoolReserves(poolName);

  if (isLoading || !baseBalance || !fyTokenBalance) {
    return { rate: undefined, isLoading };
  }

  // Implied rate = FY Token Balance / Base Balance
  // This represents how many FY tokens you get per base token
  const rate = Number(fyTokenBalance) / Number(baseBalance);

  return { rate, isLoading: false };
}

/**
 * Execute a sell base transaction (lock in forward rate)
 */
export function useSellBase() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const sellBase = (poolName: PoolName, recipient: Address, baseAmount: bigint, minFYTokenOut: bigint) => {
    const poolAddress = usePoolAddress(poolName);
    const abi = PoolNonTv__factory.abi;

    writeContract({
      address: poolAddress,
      abi,
      functionName: 'sellBase',
      args: [recipient, minFYTokenOut],
    });
  };

  return {
    sellBase,
    hash,
    isPending,
    error,
  };
}

/**
 * Execute a buy base transaction
 */
export function useBuyBase() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const buyBase = (poolName: PoolName, recipient: Address, baseAmount: bigint, maxFYTokenIn: bigint) => {
    const poolAddress = usePoolAddress(poolName);
    const abi = PoolNonTv__factory.abi;

    writeContract({
      address: poolAddress,
      abi,
      functionName: 'buyBase',
      args: [recipient, baseAmount, maxFYTokenIn],
    });
  };

  return {
    buyBase,
    hash,
    isPending,
    error,
  };
}

/**
 * Wait for a transaction to be confirmed
 */
export function useTransactionStatus(hash: `0x${string}` | undefined) {
  const { data: receipt, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    receipt,
    isLoading,
    isSuccess,
    isError,
  };
}

/**
 * Helper to calculate slippage tolerance
 */
export function calculateMinOutput(amount: bigint, slippageBps: number): bigint {
  // slippageBps is in basis points (e.g., 50 = 0.5%)
  const slippageFactor = 10000n - BigInt(slippageBps);
  return (amount * slippageFactor) / 10000n;
}

/**
 * Helper to calculate max input with slippage
 */
export function calculateMaxInput(amount: bigint, slippageBps: number): bigint {
  // slippageBps is in basis points (e.g., 50 = 0.5%)
  const slippageFactor = 10000n + BigInt(slippageBps);
  return (amount * slippageFactor) / 10000n;
}
