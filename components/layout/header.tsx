import { WalletButton } from "@/components/ui/walletbutton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  showWalletButton?: boolean;
  showGoToAppButton?: boolean;
  logoLink?: string;
}

export function Header({
  showWalletButton = false,
  showGoToAppButton = false,
  logoLink = "/",
}: HeaderProps) {
  return (
    <header className="max-w-7xl mx-auto px-6 py-4 lg:px-12 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Link href={logoLink}>
            <img src="/numo-logo.png" alt="Numo" className="h-12" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          {showWalletButton && <WalletButton />}
          {showGoToAppButton && (
            <Button
              variant="link"
              href="/app"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
            >
              Secure Your Rate
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
