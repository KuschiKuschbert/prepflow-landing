'use client';

import React from 'react';
import { initializePageTracking } from '../../../lib/analytics';
import Image from 'next/image';

export default function V2() {
  React.useEffect(() => {
    initializePageTracking('v2');
  }, []);

  return (
    <>
      {/* Hero - Trust-First */}
      <section id="hero" className="grid items-center gap-10 py-12 md:py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Clear COGS and margins for small Aussie hospitality teams.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
            Google Sheet that turns your recipes into item-level numbers — price with GST confidence.
          </p>
          
          <ul className="mt-8 space-y-3 text-base text-gray-300">
            <Bullet><strong>Item profit and popularity</strong> — decide what to promote, fix, or drop</Bullet>
            <Bullet><strong>Recipe builder</strong> — auto-calculates COGS, GP$, and GP% in-sheet</Bullet>
            <Bullet><strong>Yield/Waste aware</strong> — costs reflect trim and prep yields</Bullet>
            <Bullet><strong>GST-ready for AU</strong> — priced in AUD</Bullet>
          </ul>
          
          {/* CTA with refund policy nearby */}
          <div className="mt-10">
            <a 
              href="#pricing" 
              className="inline-flex rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] hover:shadow-[#29E7CD]/25"
              data-event="primary_cta_click"
            >
              Get the Google Sheet
            </a>
            <p className="mt-4 text-sm text-gray-500">
              For food vans, stalls, cafés, and small restaurants. 
              <a href="#pricing" className="text-[#29E7CD] hover:underline ml-1">7-day refund</a>.
            </p>
          </div>
        </div>

        {/* Screenshots with trust context */}
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
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            
            {/* Visual proof is provided by screenshots below */}
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Image 
                src="/images/settings-screenshot.png" 
                alt="PrepFlow Settings page with business configuration"
                className="h-24 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={200}
                height={96}
              />
              <Image 
                src="/images/recipe-screenshot.png" 
                alt="PrepFlow Recipe costing for Double Cheese Burger"
                className="h-24 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={200}
                height={96}
              />
              <Image 
                src="/images/stocklist-screenshot.png" 
                alt="PrepFlow Infinite Stock List with ingredient management"
                className="h-24 w-full object-cover rounded-lg border border-gray-600"
                loading="lazy"
                width={200}
                height={96}
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">Dashboard - Settings - Recipe Costing - Stock Management</p>
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
