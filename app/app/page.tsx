import { ForwardInterface } from "@/components/forms/swap";
import { Header } from "@/components/layout/header";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showWalletButton={true} />
      <ForwardInterface />
    </div>
  );
}
