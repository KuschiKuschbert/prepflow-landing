'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentPrice, formatAud, getUpcomingChanges, daysUntil } from '../lib/pricing';
import Control from '../components/landing/variants/Control';
import V1 from '../components/landing/variants/V1';
import V2 from '../components/landing/variants/V2';
import V3 from '../components/landing/variants/V3';

function LandingPageContent() {
  // Get A/B testing variant from Edge Middleware
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant') || 'control';
  
  // Performance monitoring - track page load time
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadTime = performance.now();
      console.log(`PrepFlow landing page loaded in ${loadTime.toFixed(2)}ms`);
      
      // Track A/B testing variant for analytics
      console.log('A/B Testing Variant:', variant);
    }
  }, [variant]);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PrepFlow",
    "description": "COGS and menu clarity in a Google Sheet for small food businesses.",
    "url": "https://www.prepflow.org",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser"
  };

  // Render the appropriate variant
  const renderVariant = () => {
    switch (variant) {
      case 'v1':
        return <V1 />;
      case 'v2':
        return <V2 />;
      case 'v3':
        return <V3 />;
      case 'control':
      default:
        return <Control />;
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
      {/* Sticky mobile CTA bar */}
      <StickyMobileCta />
      {/* Background gradient effects - optimized with CSS custom properties */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29E7CD]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#D925C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6 md:py-8" role="banner">
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
          <nav className="hidden gap-6 text-sm md:flex" role="navigation" aria-label="Main navigation">
            <a href="#features" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow features">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Learn how PrepFlow works">How it works</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="View PrepFlow pricing">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-[#29E7CD] transition-colors" aria-label="Frequently asked questions">FAQ</a>
          </nav>
          <div className="hidden md:block">
            <a
              href="/go/gumroad"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
              data-event="outbound_click_gumroad"
            >
              Get PrepFlow Now
            </a>
          </div>
        </header>

        {/* Render the appropriate variant */}
        {renderVariant()}

        {/* Compact trust chips (replacing bulky trust bar) */}
        <div className="mt-6 mb-2 flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-300">
          <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
            <span className="text-[#29E7CD]">🧮</span>
            <span>GST-ready • AUD</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
            <span className="text-[#29E7CD]">🛡️</span>
            <span>7‑day refund</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
            <span className="text-[#29E7CD]">📄</span>
            <span>Works in Google Sheets</span>
          </div>
        </div>

        {/* Problem – 4 small boxes across */}
        <section className="py-14 md:py-16">
          <h3 className="text-center text-3xl font-bold tracking-tight md:text-4xl mb-8">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">The Problem</span>
          </h3>
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Hard to tell which dishes actually make money</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">COGS creep and waste chip away at profit</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Pricing feels like guesswork — GST makes it fiddly</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-5">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">✗</span>
                <p className="text-sm md:text-base text-gray-300">Reports are slow or stuck in someone else&apos;s system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#29E7CD]/20 bg-[#101010]/80 p-6 text-center">
            <p className="text-lg md:text-xl text-gray-300">
              A Google Sheet that gives clear item‑level margins and GST‑ready pricing for small Aussie venues.
            </p>
          </div>
        </section>

        {/* Contributing Margin Highlight */}
        <section className="py-14 md:py-16" id="contributing-margin">
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
                  <p className="text-sm text-gray-300">What you think you&apos;re making</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#D925C7]/20 border border-[#D925C7]/30 rounded-2xl p-6 mb-4">
                  <span className="text-4xl">⚡</span>
                  <h4 className="text-xl font-semibold text-white mt-3">Contributing Margin</h4>
                  <p className="text-sm text-gray-300">What you&apos;re actually contributing</p>
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
            
            {/* Integrated capability tiles */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold text-center mb-6">All in one Google Sheet</h4>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D925C7] to-[#29E7CD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Tax Systems</h4>
                  <p className="text-sm text-gray-400">GST, VAT, Sales Tax, HST. Configure to your locale.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Access via Google Sheets</h4>
                  <p className="text-sm text-gray-400">Web and mobile where Sheets is available.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#29E7CD] to-[#D925C7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Self‑Serve Setup</h4>
                  <p className="text-sm text-gray-400">Set it up yourself. No consultants.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-gray-300">
                <strong>Example:</strong> A $15 burger might show 60% GP, but after prep time, waste and complexity, it could only contribute $2.50. A simple $8 side might contribute $4.00.
              </p>
            </div>
          </div>
        </section>

        {/* Inside the sheet – features + screenshots */}
        <section id="features" className="py-12 md:py-14">
          <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Recipe Costing" body="Build dishes from your ingredients and see dish cost, COGS%, GP$ and GP% directly in the sheet." />
            <FeatureCard title="Yield & Waste Aware" body="Include trim and prep yields so unit costs and margins reflect real kitchen conditions." />
            <FeatureCard title="Item Performance" body="Paste sales to see popularity, margin and total profit ex‑GST. Simple tags highlight winners and weak links." />
            <FeatureCard title="Daily Specials" body="Set today’s price on the fly and see GP$ and GP% instantly — GST‑aware." />
            <FeatureCard title="GST for Australia" body="Turn on GST; outputs reflect the AU 10% GST and show values in AUD." />
            <FeatureCard title="Built by Kitchens" body="Designed and refined with almost two decades of hands‑on kitchen and food ops experience." />
          </div>
          <div className="mt-10 mx-auto max-w-3xl grid grid-cols-3 gap-4">
            <div className="text-center">
              <img 
                src="/images/settings-screenshot.png" 
                alt="PrepFlow Settings page with business configuration"
                className="h-32 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width="200"
                height="96"
              />
              <p className="text-xs text-gray-400 mt-2">Settings</p>
            </div>
            <div className="text-center">
              <img 
                src="/images/recipe-screenshot.png" 
                alt="PrepFlow Recipe costing for Double Cheese Burger"
                className="h-32 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width="200"
                height="96"
              />
              <p className="text-xs text-gray-400 mt-2">Recipe Costing</p>
            </div>
            <div className="text-center">
              <img 
                src="/images/stocklist-screenshot.png" 
                alt="PrepFlow Infinite Stock List with ingredient management"
                className="h-32 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width="200"
                height="96"
              />
              <p className="text-xs text-gray-400 mt-2">Stock List</p>
            </div>
          </div>
        </section>

        {/* Outcome – 4 small boxes across */}
        <section className="py-12 md:py-14">
          <h3 className="text-center text-3xl font-bold tracking-tight md:text-4xl mb-8">
            <span className="bg-gradient-to-r from-green-400 to-[#29E7CD] bg-clip-text text-transparent">The Outcome</span>
          </h3>
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5">
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">Clear item‑level margins and profit</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5">
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">See winners and profit leaks in seconds</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5">
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">Price with confidence (GST‑ready)</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-5">
              <div className="flex items-start gap-3">
                <span className="text-[#29E7CD] text-xl">✓</span>
                <p className="text-sm md:text-base text-gray-300">All in Google Sheets — no new software</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-14 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            How it works in 3 steps
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n={1} title="Set up" body="Turn on GST, add ingredients, yields, and supplier costs." />
            <Step n={2} title="Import sales" body="Paste your POS export into the Sales tab." />
            <Step n={3} title="Decide & act" body="Dashboard ranks items by profit and popularity; fix pricing, portioning, or menu mix." />
          </div>
        </section>

        {/* Demo and lead magnet removed: sheet purchase only */}

        {/* Pricing */}
        <section id="pricing" className="py-14 md:py-16">
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
                      If PrepFlow isn&apos;t what you expected, you can request a full refund within 7 days of purchase. 
                      No hoops, no hassle — just reply to your purchase email and let us know. After 7 days, all sales are final.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Cards Layout (Control) */}
              <div className="rounded-2xl border border-gray-600 bg-[#2a2a2a]/80 p-8 text-center shadow-lg md:sticky md:top-24">
                <p className="mt-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">{formatAud(getCurrentPrice().price)}</p>
                <p className="text-sm text-gray-500">one-time purchase · 7-day refund</p>
                <a
                  href="/go/gumroad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
                  data-event="outbound_click_gumroad"
                >
                  Get the Google Sheet
                </a>
                {(() => { const n = getUpcomingChanges()[0]; return n ? (
                  <p className="mt-3 text-xs text-gray-500">Next change: {formatAud(n.price)} on {n.date.toLocaleDateString()} (in {daysUntil(n.date)} days)</p>
                ) : null; })()}
                <p className="mt-4 text-sm text-gray-500">Secure checkout via Gumroad</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 md:py-16">
          <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-center mb-12">
            FAQ
          </h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FAQ q="Do I need tech skills?" a="Zero spreadsheet formulas required. If you can use Google Sheets, you&apos;re good." />
            <FAQ q="Does it work in Australia?" a="Yes. It’s GST-aware and priced in AUD." />
            <FAQ q="What if it doesn&apos;t work for me?" a="If it&apos;s not what you expected, request a refund within 7 days." />
            <FAQ q="Will this slow me down?" a="Setup is straightforward. Add your data at your own pace." />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12">
          <div className="text-center">
            <a
              href="/go/gumroad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
              data-event="outbound_click_gumroad"
            >
              Get the Google Sheet
            </a>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-300">
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">🧮</span>
                <span>GST-ready • AUD</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">🛡️</span>
                <span>7‑day refund</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1">
                <span className="text-[#29E7CD]">📄</span>
                <span>Works in Google Sheets</span>
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

// Main Page component with Suspense wrapper
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29E7CD] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading PrepFlow...</p>
        </div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}

/* ---------- Small helper components ---------- */
function StickyMobileCta() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [hasMinTime, setHasMinTime] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const viewport = typeof window !== 'undefined' ? window.innerHeight : 800;
      const threshold = Math.max(400, Math.floor(viewport * 1.25));
      setVisible(hasMinTime && y > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize immediately on mount
    onScroll();
    const t = window.setTimeout(() => setHasMinTime(true), 6000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(t);
    };
  }, [hasMinTime]);
  return (
    <div
      className={`fixed bottom-3 left-3 right-3 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-24'} motion-reduce:transition-none`}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-md md:max-w-lg rounded-2xl border border-gray-700 bg-[#1f1f1f]/90 backdrop-blur supports-[backdrop-filter]:bg-[#1f1f1f]/70 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-300">
            <span className="block font-semibold">{formatAud(getCurrentPrice().price)}</span>
            <span className="text-xs text-gray-500">One-time • 7-day refund</span>
          </div>
          <a
            href="/go/gumroad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95"
            data-event="outbound_click_gumroad"
            aria-label="Get the Google Sheet"
          >
            Get Sheet
          </a>
        </div>
      </div>
    </div>
  );
}
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
      <p className="text-base italic text-gray-200 leading-relaxed">&quot;{quote}&quot;</p>
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
