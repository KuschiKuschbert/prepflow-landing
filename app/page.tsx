'use client';

import React from 'react';

export default function Page() {

  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
    }
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PrepFlow",
    "description": "COGS & Menu Profit Tool for restaurant profitability optimization",
    "url": "https://www.prepflow.org",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "29",
      "priceCurrency": "AUD",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <main 
      className="min-h-screen bg-[#0a0a0a] text-white" 
      style={{ 
        scrollBehavior: 'smooth',
        '--primary-color': '#29E7CD',
        '--secondary-color': '#3B82F6', 
        '--accent-color': '#D925C7',
        '--bg-color': '#0a0a0a',
        '--text-color': '#ffffff',
        '--gray-300': '#d1d5db',
        '--gray-400': '#9ca3af',
        '--gray-500': '#6b7280',
        '--gray-600': '#4b5563',
        '--gray-700': '#374151',
        '--gray-800': '#1f2937'
      } as React.CSSProperties}
    >
      {/* Background gradient effects - optimized with CSS custom properties */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-8" role="banner">
          <div className="flex items-center gap-3">
            <img 
              src="/images/prepflow-logo.png" 
              alt="PrepFlow Logo"
              className="h-12 w-auto"
              loading="eager"
              width="48"
              height="48"
            />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
              PrepFlow
            </span>
          </div>
          <nav className="hidden gap-8 text-sm md:flex" role="navigation" aria-label="Main navigation">
            <a href="#features" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow features">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Learn how PrepFlow works">How it works</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow pricing">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Frequently asked questions">FAQ</a>
          </nav>
          <div className="hidden md:block">
            <a
              href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Start Free Now
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Turn chaos into clarity — see your menu's true margins in 24 hours
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
              PrepFlow gives you instant profit visibility so you can make smarter menu decisions fast.
            </p>
            <ul className="mt-8 space-y-3 text-base text-gray-300">
              <Bullet><strong>Infinite Stock List</strong> — track every ingredient with pack size, supplier, yield/trim, and true unit cost</Bullet>
              <Bullet><strong>Recipe Builder</strong> — auto-calculate COGS, GP$, and GP% for every dish, instantly</Bullet>
              <Bullet><strong>Paste Sales Data</strong> — watch PrepFlow reveal popularity, profit, and even auto-classify items as Chef's Kiss, Hidden Gem, or Bargain Bucket</Bullet>
              <Bullet><strong>Profit Dashboard</strong> — see your top performers, food cost %, and average margins in one clean view</Bullet>
              <Bullet><strong>Global Tax Support</strong> — works with GST, VAT, and tax systems worldwide — simple setup, no expensive consultants needed</Bullet>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
                              <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Unlock Your Menu's Profit Potential
                </a>
              <a href="#demo" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300">
                Watch 2‑min Demo
              </a>
              <p className="w-full text-sm text-gray-500">No credit card · Results in 1 day · $29/month · Global support</p>
            </div>
          </div>

          {/* PrepFlow Dashboard Screenshot */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
              <div className="relative">
                <img 
                  src="/images/dashboard-screenshot.png" 
                  alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                  className="w-full h-auto rounded-xl border border-gray-600"
                  loading="lazy"
                  width="800"
                  height="500"
                />
                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                      Live GP% Dashboard
                    </div>
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Play Demo
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <img 
                  src="/images/settings-screenshot.png" 
                  alt="PrepFlow Settings page with business configuration"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width="200"
                  height="96"
                />
                <img 
                  src="/images/recipe-screenshot.png" 
                  alt="PrepFlow Recipe costing for Double Cheese Burger"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width="200"
                  height="96"
                />
                <img 
                  src="/images/stocklist-screenshot.png" 
                  alt="PrepFlow Infinite Stock List with ingredient management"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width="200"
                  height="96"
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">Dashboard · Settings · Recipe Costing · Stock Management</p>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 text-center text-base text-gray-300 shadow-lg">
          <strong>Stop guessing. Start knowing.</strong> PrepFlow isn't just a spreadsheet — it's the X-ray machine for your menu's profitability.
        </div>

        {/* Contributing Margin Highlight */}
        <section className="py-20" id="contributing-margin">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  Contributing Margin
                </span> — The Real Profit Story
              </h3>
              <p className="text-lg text-gray-300">See beyond gross profit to understand what each dish truly contributes to your business</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">💰</span>
                  <h4 className="text-xl font-semibold text-white mt-3">Gross Profit</h4>
                  <p className="text-sm text-gray-300">What you think you're making</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#D925C7]/20 border border-[#D925C7]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">⚡</span>
                  <h4 className="text-xl font-semibold text-white mt-3">Contributing Margin</h4>
                  <p className="text-sm text-gray-300">What you're actually contributing</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">🎯</span>
                  <h4 className="text-xl font-semibold text-white mt-3">Action Plan</h4>
                  <p className="text-sm text-gray-300">What to do about it</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-300">
                <strong>PrepFlow reveals:</strong> That $15 burger might have a 60% GP, but after prep time, waste, and complexity, 
                it's only contributing $2.50 to your bottom line. Meanwhile, that simple $8 side dish might be contributing $4.00.
              </p>
            </div>
          </div>
        </section>

        {/* Features – tailored to the spreadsheet */}
        <section id="features" className="py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard title="Stock List (infinite)" body="Centralise ingredients with pack size, unit, supplier, storage, product code. Capture trim/waste and yields to get true cost per unit." />
            <FeatureCard title="COGS Recipes" body="Build recipes that auto‑pull ingredient costs (incl. yield/trim). See dish cost, COGS%, GP$ and GP% instantly." />
            <FeatureCard title="Item Performance" body="Paste sales. We calculate popularity, profit margin, total profit ex‑GST and classify items as Chef's Kiss, Hidden Gem or Bargain Bucket." />
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <FeatureCard title="Dashboard KPIs" body="At a glance: average GP%, food cost %, average item profit and sale price, plus top performers by popularity and margin." />
            <FeatureCard title="Global Tax & Currency" body="Set country, tax system (GST/VAT/Sales Tax), and currency in Settings. All outputs adapt to your local market requirements." />
            <FeatureCard title="Fast Onboarding" body="Start tab with step‑by‑step guidance. Pre‑loaded demo data and member portal resources to learn the flow in minutes." />
          </div>
        </section>

        {/* Global Features */}
        <section className="py-20">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
                        <div className="text-center mb-12">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  Expose Hidden Profits
                </span> — One Sheet, Every Answer
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                While others charge thousands for complicated restaurant software, PrepFlow reveals the same profit insights 
                in a simple Google Sheet for just $29/month.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Multi-Currency</h4>
                <p className="text-sm text-gray-400">USD, EUR, GBP, AUD, SGD, and more. Switch currencies instantly.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Tax Systems</h4>
                <p className="text-sm text-gray-400">GST, VAT, Sales Tax, HST. Configure for your local requirements.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-white mb-2">24/7 Access</h4>
                <p className="text-sm text-gray-400">Cloud-based Google Sheets. Access from anywhere, anytime.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-white mb-2">No Consultants</h4>
                <p className="text-sm text-gray-400">Set up yourself in under an hour. No expensive implementation fees.</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-300">
                <strong>One sheet. Every answer your kitchen needs.</strong> Expose hidden profits buried in your menu 
                with the same insights expensive software provides — but in a simple Google Sheet you can set up yourself.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            From Chaos to Clarity in 5 Steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            <Step n={1} title="Load Recipes & Prices" body="Add your recipes & ingredient prices to unlock true costs." />
            <Step n={2} title="Add Prep & Waste" body="Include prep time, yield, waste data for complete visibility." />
            <Step n={3} title="Paste Sales Data" body="Drop in your weekly/monthly sales to reveal hidden patterns." />
            <Step n={4} title="See Profit Reality" body="Watch PrepFlow expose your true COGS, GP%, and profit per item." />
            <Step n={5} title="Take Action Fast" body="Use insights to optimize pricing, menu items, and operations immediately." />
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">2‑Minute Demo</h3>
              <p className="mt-4 text-lg text-gray-300">Watch us price a Double Cheese Burger and see how a $1 change affects COGS% and GP$ in real-time.</p>
              <ul className="mt-6 space-y-3 text-base text-gray-300">
                <Bullet>See margin calculations instantly</Bullet>
                <Bullet>Understand profit ex-tax per item (GST, VAT, Sales Tax)</Bullet>
                <Bullet>Make informed pricing decisions</Bullet>
              </ul>
              <div className="mt-8">
                <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6">
              <div className="relative w-full aspect-video rounded-xl border border-gray-600 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29E7CD] mb-4"></div>
                  <p className="text-gray-400">Loading demo video...</p>
                </div>
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  className="absolute inset-0 w-full h-full rounded-xl opacity-0 transition-opacity duration-300"
                  title="PrepFlow 2-Minute Demo - See how pricing changes affect COGS and profit margins"
                  allowFullScreen
                  loading="lazy"
                  onLoad={(e) => {
                    const target = e.target as HTMLIFrameElement;
                    target.style.opacity = '1';
                  }}
                  onError={() => {
                    console.error('Failed to load demo video');
                  }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">Watch the full demo to see PrepFlow in action</p>
            </div>
          </div>
        </section>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] p-4 text-center text-white font-semibold">
          🔥 60% launch discount ends this Friday. Don't miss the margin makeover.
        </div>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Choose Your Profit Plan</h3>
                <p className="mt-4 text-lg text-gray-300">Start with the essentials, scale as you grow. Every plan includes our 30-day profit guarantee.</p>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">Google Sheet template — ready to use immediately</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">Automated COGS, GP%, GP$ per item</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">Popularity & profit classes (Chef's Kiss etc.)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">Member portal with exclusive resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">30-day profit guarantee</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center shadow-lg">
                <p className="text-base text-gray-500 line-through">AUD $49</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  AUD $29
                </p>
                <p className="text-sm text-gray-500">per month · Cancel anytime</p>
                <p className="text-xs text-[#29E7CD] font-semibold">🔥 Limited founder pricing — ends soon</p>
                <a
                  href="https://www.prepflow.org/buy/0e6d865e-4ef3-437d-b92f-9a231e1e81e1"
                  className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Start Now — Fix Your Margins Today
                </a>
                <p className="mt-4 text-sm text-gray-500">Secure checkout via Lemon Squeezy</p>
                <p className="mt-2 text-xs text-gray-400">Not profitable in 30 days? Full refund.</p>
                <p className="mt-2 text-xs text-[#29E7CD]">🌍 Global pricing available in USD, EUR, GBP, AUD</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Proof - Case Study */}
        <section className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Real Results in Real Time</h3>
              <p className="text-lg text-gray-300">See the transformation from guesswork to profit precision</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-orange-400">Before PrepFlow</p>
                  <p className="text-4xl font-extrabold text-orange-300">24%</p>
                  <p className="text-sm text-gray-400">Average GP</p>
                </div>
                <p className="text-sm text-gray-400">Blind pricing, gut feeling, profit leaks everywhere</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-green-400">After PrepFlow</p>
                  <p className="text-4xl font-extrabold text-green-300">34%</p>
                  <p className="text-sm text-gray-400">Average GP in 3 days</p>
                </div>
                <p className="text-sm text-gray-400">Data-driven decisions, margin monsters identified, profits secured</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">"We found $2,400 in hidden profit opportunities in our first week"</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            Real Results from Real Venues
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Testimonial 
              quote="We raised two prices and cut one item. Our gross margin shot up 9% overnight." 
              author="Emily W., Owner @ The Dockhouse" 
              result="+9% GP in 24 hours"
            />
            <Testimonial 
              quote="Found $1,200 in hidden profit on our burger menu alone. PrepFlow paid for itself in 2 days." 
              author="Marcus T., Head Chef @ Beachside Café" 
              result="$1,200 profit found"
            />
            <Testimonial 
              quote="Set up in under an hour. Now I know exactly which dishes to push and which to retire." 
              author="Sarah L., Manager @ Food Truck Co" 
              result="Setup in 1 hour"
            />
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-6 py-3">
              <span className="text-[#29E7CD]">🎬</span>
              <span className="text-white font-medium">Watch: "Before vs After using PrepFlow"</span>
              <button className="bg-[#29E7CD] text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#29E7CD]/80 transition-colors">
                Play Video
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            FAQ
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FAQ q="Do I need tech skills?" a="Zero spreadsheet formulas required. If you can use Google Sheets, you're good." />
            <FAQ q="Does it work worldwide?" a="Built for global venues — includes GST, VAT, Sales Tax toggles, multi-currency support, and export-ready reports for any market." />
            <FAQ q="What if it doesn't work for me?" a="If your margin doesn't improve in 30 days, you'll get every cent back. No hassle." />
            <FAQ q="Will this slow me down?" a="Setup takes 1 hour. After that, you'll save 2-3 hours per week on menu planning." />
          </div>
        </section>

        {/* Trust Elements */}
        <section className="py-16 border-t border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Trusted by Independent Venues & Franchise Kitchens Worldwide</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">📊</span>
                <span className="text-white text-sm">Works with Google Sheets</span>
              </div>
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">🛡️</span>
                <span className="text-white text-sm">30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">🇦🇺</span>
                <span className="text-white text-sm">Made for AU Market</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-12 text-sm text-gray-500">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p>© {new Date().getFullYear()} PrepFlow. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#29E7CD] transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
    </>
  );
}

/* ---------- Small helper components ---------- */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]" />
      {children}
    </li>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-sm font-bold text-white">
          {n}
        </div>
        <h5 className="text-lg font-semibold text-white">{title}</h5>
      </div>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Testimonial({ quote, author, result }: { quote: string; author: string; result?: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base italic text-gray-200 leading-relaxed">"{quote}"</p>
      {result && (
        <div className="mt-3 inline-block bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-lg px-3 py-1">
          <span className="text-sm font-semibold text-[#29E7CD]">{result}</span>
        </div>
      )}
      <p className="mt-4 text-sm font-medium text-[#29E7CD]">— {author}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base font-semibold text-white mb-3">{q}</p>
      <p className="text-gray-300 leading-relaxed">{a}</p>
    </div>
  );
}
