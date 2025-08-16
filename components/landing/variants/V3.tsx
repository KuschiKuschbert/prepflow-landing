'use client';

import React from 'react';
import { initializeTracking } from '../../../lib/track';
import { getCurrentPrice, formatAud } from '../../../lib/pricing';

export default function V3() {
  React.useEffect(() => {
    // Initialize tracking for V3 variant
    initializeTracking('v3');
  }, []);

  return (
    <>
      {/* Hero - Action-First with Risk Reduction */}
      <section id="hero" className="grid items-center gap-12 py-16 md:py-24 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            See your menu margins at a glance — built for small Aussie venues.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
            A Google Sheet for COGS, GP, and GST-ready pricing without the guesswork.
          </p>
          
          {/* Simple reassurance */}
          <div className="mt-6 p-4 rounded-xl bg-[#29E7CD]/10 border border-[#29E7CD]/30 text-center text-sm text-gray-300">One-time purchase • 7-day refund • Works with Google Sheets</div>
          
          {/* Simplified benefits - focus on action */}
          <ul className="mt-8 space-y-3 text-base text-gray-300">
            <Bullet><strong>Item-level margins</strong> — decide what to promote, fix, or drop</Bullet>
            <Bullet><strong>Auto COGS and profit</strong> — every recipe, in-sheet</Bullet>
            <Bullet><strong>GST-ready for Australian venues</strong> — price with confidence</Bullet>
          </ul>
          
          {/* CTA with prominent risk reduction */}
          <div className="mt-10">
            <a 
              href="#pricing" 
              className="inline-flex rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] hover:shadow-[#29E7CD]/25"
              data-event="primary_cta_click"
            >
              Get the Google Sheet
            </a>
            
            {/* Risk reduction messaging */}
            <div className="mt-4 p-3 rounded-lg bg-[#29E7CD]/10 border border-[#29E7CD]/20">
              <p className="text-sm text-gray-300 text-center">
                <span className="text-[#29E7CD] font-semibold">No subscription</span> — 
                <a href="#pricing" className="text-[#29E7CD] hover:underline ml-1">7-day refund</a> • Works in Google Sheets
              </p>
            </div>
          </div>
        </div>

        {/* Screenshots with action focus */}
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
            </div>
            
            {/* Simple three-step overview without time guarantee */}
            <div className="mt-6 p-4 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">How it fits into your day</p>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-[#3B82F6] text-sm">1</span>
                    </div>
                    <p className="text-gray-400">Setup</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-[#3B82F6] text-sm">2</span>
                    </div>
                    <p className="text-gray-400">Import</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-[#3B82F6] text-sm">3</span>
                    </div>
                    <p className="text-gray-400">Review margins</p>
                  </div>
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
            <p className="mt-4 text-center text-sm text-gray-500">Dashboard - Settings - Recipe Costing - Stock Management</p>
          </div>
        </div>
      </section>

      {/* What It Does / Features */}
      <section id="features" className="py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard title="Easy COGS">
            Ingredients in; costs and GP calculate automatically.
          </FeatureCard>
          <FeatureCard title="Yield & Waste Aware">
            Factor in prep loss and yields for realistic margins.
          </FeatureCard>
          <FeatureCard title="Item-Level Clarity">
            See winners, weak spots, and menu mix categories.
          </FeatureCard>
          <FeatureCard title="GST & Currency">
            GST-ready for Australia (AUD).
          </FeatureCard>
        </div>
      </section>

      {/* Demo / Visual Proof */}
      <section id="demo" className="py-12 md:py-16">
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/60 p-6">
          <h2 className="text-2xl font-semibold">See it in action</h2>
          <p className="mt-2 text-gray-400">Explore the dashboard, recipe costing, and stock list with sample data.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="#" className="rounded-2xl px-6 py-3 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563eb] transition-colors">Play demo</a>
            <a href="#" className="rounded-2xl px-6 py-3 text-sm font-semibold text-[#29E7CD] border border-[#29E7CD]/40 hover:border-[#29E7CD] transition-colors">Get the sample sheet (free)</a>
          </div>
        </div>
      </section>

      {/* Price & Refund */}
      <section id="pricing" className="py-12 md:py-16">
        <h2 className="text-3xl font-bold">One-time purchase. 7-day refund.</h2>
        <p className="mt-2 text-gray-400">Choose the price you want to test. No subscriptions.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <DynamicPriceCard />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 md:py-16">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <FaqItem q="Who is it for?" a="Food vans, stalls, cafés, and small restaurants in Australia." />
          <FaqItem q="Do I need Excel?" a="No. It is designed for Google Sheets." />
          <FaqItem q="Can I customize it?" a="Yes. It is your copy to adapt and edit." />
          <FaqItem q="What if it is not for me?" a="Request a refund within 7 days." />
        </div>
      </section>

      {/* Trust bar rendered globally in app/page.tsx */}
    </>
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

function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#1a1a1a] p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-400">{children}</p>
    </div>
  );
}

function DynamicPriceCard() {
  const { price, url } = getCurrentPrice();
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#121212] p-6 flex flex-col md:col-span-3 lg:col-span-1">
      <div>
        <p className="text-sm text-gray-400">AUD</p>
        <p className="mt-1 text-4xl font-extrabold">{formatAud(price)}</p>
        <p className="mt-1 text-sm text-gray-400">One-time purchase • 7-day refund</p>
      </div>
      <ul className="mt-6 space-y-2 text-sm text-gray-300">
        <li>• Google Sheet template</li>
        <li>• Setup guide and sample data</li>
        <li>• Works with Google Sheets</li>
      </ul>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-event="outbound_click_gumroad"
        data-price={price}
        className="mt-6 inline-flex justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Get the Google Sheet
      </a>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#141414] p-6">
      <h3 className="text-lg font-semibold">{q}</h3>
      <p className="mt-2 text-gray-400">{a}</p>
    </div>
  );
}
