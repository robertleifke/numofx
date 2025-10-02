# Wagmi & React Query Setup

This document outlines the wagmi and React Query configuration for the Numo FX application.

## 🚀 Features Implemented

### ✅ Wagmi Configuration

- **Chains**: Celo Mainnet and Celo Alfajores Testnet
- **Connectors**: MetaMask (injected), WalletConnect, Coinbase Wallet
- **Transports**: HTTP RPC endpoints for both networks
- **SSR Support**: Enabled for Next.js compatibility

### ✅ React Query Integration

- **Query Client**: Configured with 5-minute stale time and 3 retries
- **Custom Hooks**: Created for FX rates, wallet info, and token balances
- **Caching**: Optimized for real-time FX data and wallet state

### ✅ Token & Contract Configuration

- **Token Metadata**: CELO, cUSD, cEUR, USDC, USDT with logos and colors
- **Contract Addresses**: Pre-configured for Celo ecosystem tokens
- **Forward Contracts**: Placeholder addresses for your deployed contracts

### ✅ Wallet Integration

- **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Network Detection**: Shows current chain and allows switching
- **Balance Queries**: Real-time token balance fetching
- **Connection State**: Proper loading and error states

## 📁 File Structure

```
lib/
├── wagmi.ts              # Wagmi configuration
├── contracts.ts          # Token metadata and contract addresses
└── hooks/
    ├── useFxRates.ts     # FX rate queries
    └── useWallet.ts      # Wallet and balance queries

components/
├── providers.tsx         # Wagmi and React Query providers
└── ui/
    └── walletbutton.tsx  # Updated wallet button with wagmi hooks
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# FX API Configuration
NEXT_PUBLIC_FX_API_URL=https://api.numofx.com

# Contract Addresses (update with your deployed contracts)
NEXT_PUBLIC_FORWARD_CONTRACT_CELO=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_FORWARD_CONTRACT_ALFAJORES=0x0000000000000000000000000000000000000000
```

### WalletConnect Setup

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID to your environment variables

## 🎯 Usage Examples

### Using FX Rate Hooks

```tsx
import { useForwardRates, useFxRates } from "@/lib/hooks/useFxRates";

function TradingInterface() {
  const { data: rates, isLoading } = useForwardRates("6M");
  const { data: fxData } = useFxRates();

  if (isLoading) return <div>Loading rates...</div>;

  return (
    <div>
      <p>Forward Rate: {rates?.rate}</p>
      <p>Spot Rate: {rates?.spot}</p>
    </div>
  );
}
```

### Using Wallet Hooks

```tsx
import { useWalletInfo, useTokenBalance } from "@/lib/hooks/useWallet";

function WalletInfo() {
  const { address, isConnected, chain } = useWalletInfo();
  const { balance } = useTokenBalance(CONTRACTS.CUSD);

  if (!isConnected) return <div>Please connect wallet</div>;

  return (
    <div>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
      <p>cUSD Balance: {balance?.formatted}</p>
    </div>
  );
}
```

## 🔄 Next Steps

1. **Deploy Contracts**: Update contract addresses in `lib/contracts.ts`
2. **API Integration**: Replace mock data in hooks with real API calls
3. **Error Handling**: Add comprehensive error boundaries and retry logic
4. **Testing**: Add unit tests for hooks and components
5. **Analytics**: Integrate wallet connection analytics

## 🛠️ Available Hooks

### FX Rate Hooks

- `useFxRates()`: Get current FX rates
- `useForwardRates(tenor)`: Get forward rates for specific tenor
- `useHistoricalRates(pair, days)`: Get historical rate data

### Wallet Hooks

- `useWalletInfo()`: Get wallet connection state and chain info
- `useTokenBalance(tokenAddress)`: Get balance for specific token
- `useAllTokenBalances()`: Get balances for all configured tokens
- `useForwardContract()`: Get forward contract instance

## 🔗 Useful Links

- [Wagmi Documentation](https://wagmi.sh/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Celo Documentation](https://docs.celo.org/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
