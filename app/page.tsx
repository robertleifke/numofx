import { Button } from "@/components/ui/button";
import USDKESChart from "@/components/USDKESChart";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header showGoToAppButton={true} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 flex-1 w-full">
        <div className="bg-muted/80 rounded-3xl px-8 py-16 lg:px-16 lg:py-24">
          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Lock In FX Rates
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Protect your business from currency risk with the most competitive
              FX forward rates.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="link"
              href="/app"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 h-12"
            >
              Secure Your Rate
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 py-3 h-12 border-border bg-transparent"
            >
              Learn More
            </Button>
          </div>

          {/* Dashboard Mockups */}
          <div className="w-full">
            {/* Center Chart */}
            <div className="w-full h-[500px]">
              <USDKESChart />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Logo and Copyright */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
              <img src="/numo-logo.png" alt="Numo" className="h-8" />
              <p className="text-sm text-muted-foreground">
                Copyright © 2025 Numo Technologies Inc. All rights reserved
              </p>
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Let's stay in touch
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com/numoforex"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
