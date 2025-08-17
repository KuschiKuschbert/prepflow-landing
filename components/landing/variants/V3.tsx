'use client';

import React from 'react';
import { initializeTracking } from '../../../lib/track';
import Image from 'next/image';

export default function V3() {
  React.useEffect(() => {
    // Initialize tracking for V3 variant
    initializeTracking('v3');
  }, []);

  return (
    <>
      {/* Hero - Action-First with Risk Reduction */}
      <section id="hero" className="grid items-center gap-10 py-12 md:py-16 md:grid-cols-2">
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
              <Image 
                src="/images/dashboard-screenshot.png" 
                alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                className="w-full h-auto rounded-xl border border-gray-600"
                loading="lazy"
                width={800}
                height={500}
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
