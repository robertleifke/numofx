import { WalletButton } from "@/components/ui/walletbutton";

export function Header() {
  return (
    <header className="max-w-7xl mx-auto px-6 py-4 lg:px-12 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <img src="/numo-logo.png" alt="Numo" className="h-12" />
        </div>
        <div className="flex-1 flex justify-end">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
