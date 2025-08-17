'use client';

import React from 'react';
import { initializeTracking } from '../../../lib/track';
import Image from 'next/image';

export default function V1() {
  React.useEffect(() => {
    // Initialize tracking for V1 variant
    initializeTracking('v1');
  }, []);

  return (
    <>
      {/* Hero - Clarity-First */}
      <section id="hero" className="grid items-center gap-10 py-12 md:py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Profit clarity for small Australian venues — inside Google Sheets.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
            Cost recipes, see item-level margins, and price with GST confidence.
          </p>
          
          {/* Simplified to 3 key benefits */}
          <ul className="mt-8 space-y-3 text-base text-gray-300">
            <Bullet><strong>Item profit and popularity</strong> — decide what to promote, fix, or drop</Bullet>
            <Bullet><strong>Recipe builder</strong> — auto-calculates COGS, GP$, and GP% in-sheet</Bullet>
            <Bullet><strong>GST-ready for AU</strong> — priced in AUD</Bullet>
          </ul>
          
          {/* Single primary CTA with stronger copy */}
          <div className="mt-10">
            <a 
              href="#pricing" 
              className="inline-flex rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] hover:shadow-[#29E7CD]/25"
              data-event="primary_cta_click"
            >
              Get the Google Sheet
            </a>
            <p className="mt-4 text-sm text-gray-500">For food vans, stalls, cafés, and small restaurants. 7-day refund.</p>
          </div>
        </div>

        {/* Screenshots above fold with short captions */}
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
          <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
            <div className="relative">
              <Image 
                src="/images/dashboard-screenshot.png" 
                alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                className="w-full h-auto rounded-xl border border-gray-600"
                loading="lazy"
                width={800}
                height={500}
              />
              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                    Live GP% Dashboard
                  </div>
                  <span className="bg-white text-black px-6 py-3 rounded-lg font-semibold">Demo preview</span>
                </div>
              </div>
            </div>
            
            {/* Screenshots with short captions */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Image 
                  src="/images/settings-screenshot.png" 
                  alt="PrepFlow Settings page with business configuration"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width={200}
                  height={96}
                />
                <p className="text-xs text-gray-400 mt-2">Settings</p>
              </div>
              <div className="text-center">
                <Image 
                  src="/images/recipe-screenshot.png" 
                  alt="PrepFlow Recipe costing for Double Cheese Burger"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width={200}
                  height={96}
                />
                <p className="text-xs text-gray-400 mt-2">Recipe Costing</p>
              </div>
              <div className="text-center">
                <Image 
                  src="/images/stocklist-screenshot.png" 
                  alt="PrepFlow Infinite Stock List with ingredient management"
                  className="h-24 w-full object-cover rounded-lg border border-gray-600"
                  loading="lazy"
                  width={200}
                  height={96}
                />
                <p className="text-xs text-gray-400 mt-2">Stock List</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Variant files now only render the Hero section. Global sections are in app/page.tsx */}
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

// Removed local Feature/Pricing/FAQ components to avoid duplication
