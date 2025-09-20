import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </a>
          </nav>

          <div className="flex-1 flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Secure Your Rate
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-8">
        <div className="bg-muted/80 rounded-3xl px-8 py-16 lg:px-16 lg:py-24">
          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">Lock In FX Rates</h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Protect your business from currency risk with the most competitive FX forward rates.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 h-12">
              Secure Your Rate
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 h-12 border-border bg-transparent">
              Learn More
            </Button>
          </div>

          {/* Dashboard Mockups */}
          <div className="w-full">
            {/* Center Chart */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white w-full">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Exchange Rate USDT/cKES</h3>
                  <div className="text-xs text-gray-400 mt-1">3 month tenor</div>
                </div>
              </div>

              <div className="h-48 relative mx-auto max-w-6xl">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 120 Q 50 100 100 80 T 200 70 T 300 60" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <path d="M 0 120 Q 50 100 100 80 T 200 70 T 300 60 L 300 150 L 0 150 Z" fill="url(#gradient)" />
                </svg>
                <div className="absolute top-4 right-4 bg-gray-700 px-2 py-1 rounded text-xs">128.15</div>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Bid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
