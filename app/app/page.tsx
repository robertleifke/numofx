import { ForwardInterface } from "@/components/forms/swap";
import { Header } from "@/components/layout/header";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showWalletButton={true} />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 flex-1 w-full">
        <ForwardInterface />
      </main>
    </div>
  );
}
