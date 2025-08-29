'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ExitIntentTracker from '../components/ExitIntentTracker';
import ScrollTracker from '../components/ScrollTracker';
import PerformanceTracker from '../components/PerformanceTracker';
import PerformanceOptimizer from '../components/PerformanceOptimizer';

import RealStoryNotifier from '../components/SocialProofNotifier';
import LeadMagnetForm from '../components/LeadMagnetForm';

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
      {/* Performance & Analytics Components */}
      <PerformanceOptimizer />
      <ExitIntentTracker 
        onExitIntent={() => {
          console.log('🚨 User attempting to leave page - potential conversion opportunity');
          // You could trigger a popup, offer, or other retention strategy here
        }}
      />
      <ScrollTracker 
        onSectionView={(sectionId) => {
          console.log(`👁️ User viewed section: ${sectionId}`);
        }}
        onScrollDepth={(depth) => {
          console.log(`📊 User scrolled to ${depth}% of page`);
        }}
      />
      <PerformanceTracker 
        onMetrics={(metrics) => {
          console.log('⚡ Performance metrics:', metrics);
        }}
      />
      
      {/* Real Story & Trust Components */}
      <RealStoryNotifier enabled={true} showStory={true} />
      
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
            <Image 
              src="/images/prepflow-logo.png" 
              alt="PrepFlow Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
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
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            >
              Get PrepFlow Now
            </a>
          </div>
        </header>

        {/* Hero */}
        <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Instant menu profit clarity for Aussie cafés.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
              Know your winners and fix low-margin items in minutes — GST-ready, inside a simple Google Sheet.
            </p>
            <ul className="mt-8 space-y-3 text-base text-gray-300">
              <Bullet><strong>Item Profit & Popularity</strong> — know what to promote, fix, or drop to raise gross profit</Bullet>
              <Bullet><strong>Recipe Builder</strong> — auto-calculate COGS, GP$, and GP% for every dish, instantly</Bullet>
              <Bullet><strong>Yield/Waste Aware</strong> — realistic ingredient costs — no fantasy margins</Bullet>
              <Bullet><strong>GST-Ready for AU</strong> — price confidently; avoid surprises</Bullet>
              <Bullet><strong>Menu Mix Intelligence</strong> — "Chef's Kiss / Hidden Gem / Bargain Bucket" categories to guide decisions</Bullet>
              <Bullet><strong>AI Method Generator</strong> — discover new cooking methods that could improve your margins and reduce waste</Bullet>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
                              <a href="#demo" className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300">
                Watch the 2-min demo
              </a>
              <a href="#lead-magnet" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300">
                Get the sample sheet (free)
              </a>
                              <p className="w-full text-sm text-gray-500">Works for cafés, food trucks, small restaurants. No lock-in. 7-day refund policy. Results may vary based on your current menu and operations.</p>
            </div>
          </div>

          {/* PrepFlow Dashboard Screenshot */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
            <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
              <div className="relative">
                <Image 
                  src="/images/dashboard-screenshot.png" 
                  alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                  width={800}
                  height={500}
                  className="w-full h-auto rounded-xl border border-gray-600"
                  priority
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
                <Image 
                  src="/images/settings-screenshot.png" 
                  alt="PrepFlow Settings page with business configuration"
                  width={200}
                  height={96}
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                />
                <Image 
                  src="/images/recipe-screenshot.png" 
                  alt="PrepFlow Recipe costing for Double Cheese Burger"
                  width={200}
                  height={96}
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                />
                <Image 
                  src="/images/stocklist-screenshot.png" 
                  alt="PrepFlow Infinite Stock List with ingredient management"
                  width={200}
                  height={96}
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
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

        {/* Problem → Outcome */}
        <section id="problem-outcome" className="py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  The Problem
                </span>
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>You don't know which menu items actually make money</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>COGS creep and waste eat your profit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>Pricing is guesswork; GST adds friction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <span>Reports are slow, complicated, or sit in someone else's tool</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                <span className="bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent">
                  The Outcome
                </span>
              </h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>See item-level margins and profit instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Spot "winners" and "profit leaks" at a glance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Adjust pricing with confidence (GST-aware)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Run everything in Google Sheets — no new software to learn</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

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
                <strong>PrepFlow helps you see:</strong> That $15 burger might have a 60% GP, but after prep time, waste, and complexity, 
                it might only be contributing $2.50 to your bottom line. Meanwhile, that simple $8 side dish might be contributing $4.00.
                <br /><span className="text-sm text-gray-400">*Example for illustration - actual results depend on your specific menu and costs</span>
              </p>
            </div>
          </div>
        </section>

        {/* My Story - Authentic Journey */}
        <section className="py-20 border-t border-gray-700">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              My Journey Creating PrepFlow
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              This isn't just another tool - it's my personal solution to real kitchen problems, 
              refined over 20 years of working in restaurants across Europe and Australia.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold text-white mb-2">2008-2012 - Early Experience</h3>
              <p className="text-gray-300 text-sm">
                Started as Sous Chef at Krautwells GmbH, managing vegan cuisine and training junior chefs
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">2012-2018 - European Leadership</h3>
              <p className="text-gray-300 text-sm">
                Founded KSK-Küchenspezialkräfte vegan catering, managed teams of 21 staff, served 1,200+ daily
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🇦🇺</div>
              <h3 className="text-xl font-semibold text-white mb-2">2018-2024 - Australian Excellence</h3>
              <p className="text-gray-300 text-sm">
                Executive Chef roles, Head Chef at ALH Hotels, leading teams of 9 chefs with AI integration
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">2024 - Ready to Share</h3>
              <p className="text-gray-300 text-sm">
                Now sharing the perfected tool with fellow chefs and restaurateurs who face the same challenges I did
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-[#29E7CD] mb-4">
                Why I Created PrepFlow
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Over 20 years as a chef, I've managed everything from small cafés to large-scale catering operations serving 1,200+ guests daily. 
                I've faced the same challenges you do: menu costing, waste management, profitability analysis, and team efficiency.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                As Head Chef at ALH Hotels, I was constantly looking for better ways to manage costs, streamline prep systems, and optimize our menu mix. 
                Existing solutions were either too complex, too expensive, or didn't understand real kitchen operations.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                So I built my own solution - a simple Google Sheets template that could handle COGS calculations, 
                track ingredient costs, and show me exactly which menu items were profitable and which were losing money.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Having worked across Europe and Australia, I've refined it to work perfectly for venues worldwide - with GST support for Australian markets, 
                multi-currency options, and the flexibility to adapt to any kitchen's needs. It's the tool I wish I had when I started, and now I'm sharing it with you.
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
                          <FeatureCard title="Fast Onboarding" body="Start tab with step‑by‑step guidance. Pre‑loaded demo data and comprehensive resources to learn the flow in minutes." />
            <FeatureCard title="AI Method Generator" body="Discover new cooking methods that could improve your margins and reduce waste. Get AI-powered suggestions for optimizing your kitchen processes." />
          </div>
        </section>

        {/* Global Features */}
        <section id="global-features" className="py-20">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
                        <div className="text-center mb-12">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  Expose Hidden Profits
                </span> — One Sheet, Every Answer
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                While others charge thousands for complicated restaurant software, PrepFlow provides similar profit insights 
                in a simple Google Sheet for a one-time purchase.
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
                <strong>One sheet. Key insights your kitchen needs.</strong> Identify profit opportunities in your menu 
                with insights similar to expensive software — but in a simple Google Sheet you can set up yourself.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            Get Results in 3 Simple Steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n={1} title="Set up (5–10 min)" body="Turn on GST, add ingredients, yields, and supplier costs." />
            <Step n={2} title="Import sales" body="Paste your POS export into the Sales tab." />
            <Step n={3} title="Decide & act" body="Dashboard ranks items by profit and popularity; fix pricing, portioning, or menu mix." />
          </div>
          
          {/* 60-Second Checklist */}
          <div className="mt-16 rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-6">60-Second Checklist</h3>
            <div className="grid gap-4 md:grid-cols-5 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">1</span>
                </div>
                <span className="text-sm text-gray-300">GST toggle set?</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">2</span>
                </div>
                <span className="text-sm text-gray-300">Ingredient yields/waste entered?</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">3</span>
                </div>
                <span className="text-sm text-gray-300">Sales pasted?</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">4</span>
                </div>
                <span className="text-sm text-gray-300">Review top 5 low-margin items?</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#29E7CD]/20 border border-[#29E7CD]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#29E7CD] text-xl">5</span>
                </div>
                <span className="text-sm text-gray-300">Re-check dashboard tomorrow</span>
              </div>
            </div>
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
                  href="https://7495573591101.gumroad.com/l/prepflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Get PrepFlow Now
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

        {/* Lead Magnet */}
        <section id="lead-magnet" className="py-20">
          <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                See PrepFlow before you buy
              </h3>
              <p className="text-lg text-gray-300">
                Get the 2-min demo or a sample dashboard — we'll email it to you.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadMagnetForm 
                onSuccess={(data: { name: string; email: string; preference: 'demo' | 'sample' }) => {
                  console.log('Lead captured:', data);
                  // You can add additional success handling here
                }}
                onError={(error: string) => {
                  console.error('Lead capture failed:', error);
                  // You can add additional error handling here
                }}
              />
            </div>
          </div>
        </section>

        {/* Simple Pricing Banner */}
        <div className="bg-gradient-to-r from-[#D925C7] to-[#29E7CD] p-6 text-center text-white">
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-2">
              🚀 Simple, Honest Pricing
            </h3>
            <p className="text-sm opacity-90">
              AUD $29 - one-time purchase, lifetime access
            </p>
          </div>
        </div>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl md:p-16">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Get Your Menu Clarity Tool</h3>
              <p className="mt-4 text-lg text-gray-300">Simple, powerful, and designed to give you the insights you need to make better decisions.</p>
              
              {/* Refund Policy */}
              <div className="mt-6 p-4 rounded-xl bg-[#29E7CD]/5 border border-[#29E7CD]/20">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-[#29E7CD] mb-2">Our Refund Policy</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    PrepFlow is a digital product with instant access. That said, we want you to feel confident. 
                    If PrepFlow isn't what you expected, you can request a full refund within 7 days of purchase. 
                    No hoops, no hassle — just reply to your purchase email and let us know. After 7 days, all sales are final.
                  </p>
                </div>
              </div>
                
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
                    <span className="text-gray-300">AI Method Generator for cooking optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">Comprehensive setup guide and resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#29E7CD]">✅</span>
                    <span className="text-gray-300">7-day refund policy</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center shadow-lg">
                <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
                  AUD $29
                </p>
                <p className="text-sm text-gray-500">one-time purchase · Lifetime access</p>
                <a
                  href="https://7495573591101.gumroad.com/l/prepflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                >
                  Start Now — Get Menu Clarity Today
                </a>
                <p className="mt-4 text-sm text-gray-500">Secure checkout via Gumroad</p>
                <p className="mt-2 text-xs text-gray-400">Not satisfied in 7 days? Full refund.</p>
                <p className="mt-2 text-xs text-[#29E7CD]">🌍 Global pricing available in USD, EUR, GBP, AUD</p>
                
                {/* Trust Indicators */}
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">🔒</span>
                      <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">🛡️</span>
                      <span>Privacy Focused</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-purple-500">✅</span>
                      <span>20 years of real kitchen experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How PrepFlow Works in Practice */}
        <section id="how-it-works-practice" className="py-20">
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How PrepFlow Works in Practice</h3>
              <p className="text-lg text-gray-300">From guesswork to data-driven clarity - here's what you can expect</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-orange-400">Before PrepFlow</p>
                  <p className="text-4xl font-extrabold text-orange-300">?</p>
                  <p className="text-sm text-gray-400">Unclear margins</p>
                </div>
                <p className="text-sm text-gray-400">Blind pricing, gut feeling, unclear margins everywhere</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 mb-4">
                  <p className="text-2xl font-bold text-green-400">After PrepFlow</p>
                  <p className="text-4xl font-extrabold text-green-300">📊</p>
                  <p className="text-sm text-gray-400">Clear insights</p>
                </div>
                <p className="text-sm text-gray-400">Data-driven decisions, margin insights revealed, clarity achieved</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">PrepFlow helps you identify where your menu has profit potential and where costs might be eating into your margins</p>
              <p className="text-xs text-gray-500 mt-2">*Results depend on your current menu structure and how you implement the insights</p>
            </div>
          </div>
        </section>

        {/* What PrepFlow Helps You Achieve */}
        <section id="benefits" className="py-20">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            What PrepFlow Helps You Achieve
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <BenefitCard 
              title="Better Pricing Decisions"
              description="See exactly how ingredient costs, yields, and waste affect your margins. Make informed pricing decisions instead of guessing."
              icon="💰"
            />
            <BenefitCard 
              title="Identify Profit Opportunities"
              description="Spot which menu items are underperforming and which have hidden potential. Focus your efforts where they'll have the biggest impact."
              icon="🎯"
            />
            <BenefitCard 
              title="Streamline Operations"
              description="Understand your true costs and optimize your menu mix. Reduce waste, improve efficiency, and increase your bottom line."
              icon="⚡"
            />
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-6 py-3">
              <span className="text-[#29E7CD]">🎬</span>
              <span className="text-white font-medium">See PrepFlow in action with our demo</span>
              <a href="#demo" className="bg-[#29E7CD] text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-[#29E7CD]/80 transition-colors">
                Watch Demo
              </a>
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
                            <FAQ q="What if it doesn't work for me?" a="If you're not satisfied with the insights and clarity PrepFlow provides in 7 days, you'll get every cent back. No hassle." />
            <FAQ q="Will this slow me down?" a="Setup typically takes 1-2 hours. After that, you'll save time on menu planning and cost analysis." />
          </div>
        </section>

        {/* Trust Elements */}
        <section className="py-16 border-t border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Built for Independent Venues & Small Kitchens</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">📊</span>
                <span className="text-white text-sm">Works with Google Sheets</span>
              </div>
              <div className="flex items-center gap-2 bg-[#29E7CD]/10 border border-[#29E7CD]/30 rounded-full px-4 py-2">
                <span className="text-[#29E7CD]">🛡️</span>
                <span className="text-white text-sm">7-Day Refund Policy</span>
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
              <Link href="/terms-of-service" className="hover:text-[#29E7CD] transition-colors">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-[#29E7CD] transition-colors">Privacy</Link>
              <a href="mailto:support@prepflow.org" className="hover:text-[#29E7CD] transition-colors">Support</a>
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



function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <p className="text-base font-semibold text-white mb-3">{q}</p>
      <p className="text-gray-300 leading-relaxed">{a}</p>
    </div>
  );
}

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:border-[#29E7CD]/50 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-white mb-3">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
