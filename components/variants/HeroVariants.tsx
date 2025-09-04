'use client';

import React from 'react';
import Image from 'next/image';

// Control Hero (Original)
export function ControlHero() {
  return (
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
  );
}

// Variant A - Problem-Focused Hero
export function VariantAHero() {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Stop losing money on your menu.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          Most restaurants don't know which dishes are profitable. PrepFlow shows you exactly where your money is going — and how to fix it.
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>Stop the Bleeding</strong> — identify which menu items are costing you money</Bullet>
          <Bullet><strong>Real Cost Analysis</strong> — see true ingredient costs including waste and yields</Bullet>
          <Bullet><strong>Profit Optimization</strong> — know which dishes to promote, fix, or remove</Bullet>
          <Bullet><strong>GST Compliance</strong> — price correctly for Australian tax requirements</Bullet>
          <Bullet><strong>Smart Menu Decisions</strong> — data-driven choices about your menu mix</Bullet>
          <Bullet><strong>AI Kitchen Insights</strong> — discover new methods to improve margins</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#demo" className="rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25 transition-all duration-300">
            See How It Works
          </a>
          <a href="#lead-magnet" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#D925C7] hover:text-[#D925C7] transition-all duration-300">
            Get Free Sample
          </a>
          <p className="w-full text-sm text-gray-500">Built for Australian cafés and restaurants. No lock-in. 7-day refund policy.</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <Image 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing profit analysis and cost breakdown"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#D925C7] text-white px-4 py-2 rounded-lg font-semibold mb-2">
                  Profit Analysis Dashboard
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Demo
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Image 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings page"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe costing"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock management"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Profit Analysis · Recipe Costing · Stock Management</p>
        </div>
      </div>
    </section>
  );
}

// Variant B - Results-Focused Hero
export function VariantBHero() {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Turn your menu into a profit machine.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          Transform guesswork into data-driven decisions. PrepFlow gives you the insights to maximize every dollar on your menu.
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>Profit Maximization</strong> — identify your highest-margin opportunities</Bullet>
          <Bullet><strong>Cost Transparency</strong> — see exactly what each dish costs to make</Bullet>
          <Bullet><strong>Menu Optimization</strong> — know which items to feature or remove</Bullet>
          <Bullet><strong>Tax Compliance</strong> — GST-ready pricing for Australian businesses</Bullet>
          <Bullet><strong>Performance Tracking</strong> — monitor which dishes drive your profit</Bullet>
          <Bullet><strong>AI Optimization</strong> — get suggestions to improve your margins</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#demo" className="rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#3B82F6]/25 transition-all duration-300">
            Start Profiting Now
          </a>
          <a href="#lead-magnet" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300">
            Try Sample Sheet
          </a>
          <p className="w-full text-sm text-gray-500">Designed for Australian hospitality. Simple setup. 7-day refund guarantee.</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#29E7CD]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <Image 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing profit optimization and performance metrics"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-semibold mb-2">
                  Profit Optimization
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Now
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Image 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe analysis"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock tracking"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Profit Dashboard · Recipe Analysis · Stock Tracking</p>
        </div>
      </div>
    </section>
  );
}

// Variant C - Simple/Direct Hero
export function VariantCHero() {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Know your menu costs. Make more profit.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          PrepFlow shows you exactly what each dish costs and how much profit it makes. Simple Google Sheet. Real results.
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>Cost Breakdown</strong> — see exactly what each dish costs to make</Bullet>
          <Bullet><strong>Profit Calculation</strong> — know your margin on every item</Bullet>
          <Bullet><strong>Menu Decisions</strong> — decide what to keep, change, or remove</Bullet>
          <Bullet><strong>GST Ready</strong> — Australian tax compliance built-in</Bullet>
          <Bullet><strong>Easy Setup</strong> — works in Google Sheets, no new software</Bullet>
          <Bullet><strong>Smart Insights</strong> — AI suggestions to improve your margins</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#demo" className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300">
            Get Started
          </a>
          <a href="#lead-magnet" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300">
            Free Sample
          </a>
          <p className="w-full text-sm text-gray-500">For Australian cafés and restaurants. 7-day refund policy.</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <Image 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing cost analysis and profit metrics"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                  Cost Analysis Dashboard
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Image 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe costs"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
            <Image 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock list"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Cost Analysis · Recipe Costs · Stock List</p>
        </div>
      </div>
    </section>
  );
}

// Helper component
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]" />
      {children}
    </li>
  );
}
