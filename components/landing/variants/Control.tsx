'use client';

import React from 'react';
import { initializePageTracking } from '../../../lib/analytics';
import Image from 'next/image';

export default function Control() {
  React.useEffect(() => {
    initializePageTracking('control');
  }, []);

  const left1Ref = React.useRef<HTMLDivElement | null>(null);
  const left2Ref = React.useRef<HTMLDivElement | null>(null);
  const right1Ref = React.useRef<HTMLDivElement | null>(null);
  const right2Ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const attach = (el: HTMLElement | null, dir: 'left' | 'right', delayMs: number) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          // Half-circle animation relative to price card
          const anchor = document.querySelector('[data-price-card-anchor]') as HTMLElement | null;
          if (anchor) {
            const a = anchor.getBoundingClientRect();
            const e = el.getBoundingClientRect();
            const ax = a.left + a.width / 2;
            const ay = a.top + a.height / 2;
            const ex = e.left + e.width / 2;
            const ey = e.top + e.height / 2;
            const dx = ax - ex;
            const dy = ay - ey;
            const midX = dx * 0.5;
            const midY = dy - Math.max(60, Math.abs(dx) * 0.3);
            el.animate([
              { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
              { transform: `translate(${Math.round(midX)}px, ${Math.round(midY)}px)`, opacity: 0.8, offset: 0.6 },
              { transform: 'translate(0, 0)', opacity: 1 }
            ], { duration: 750, delay: delayMs, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' });
          } else {
            el.style.animationDelay = `${delayMs}ms`;
            el.classList.add(dir === 'left' ? 'animate-left' : 'animate-right');
          }
          obs.unobserve(el);
        }
      }, { threshold: 0.6 });
      obs.observe(el);
    };
    const startDelayMs = 300; // start a bit later
    attach(left1Ref.current, 'left', startDelayMs + 0);
    attach(left2Ref.current, 'left', startDelayMs + 140);
    attach(right1Ref.current, 'right', startDelayMs + 0);
    attach(right2Ref.current, 'right', startDelayMs + 140);
  }, []);

  return (
    <>
      <style jsx global>{`
        .observe-left{opacity:0;transform:translateY(-6px) translateX(40px)}
        .observe-right{opacity:0;transform:translateY(-6px) translateX(-40px)}
        .animate-left{animation:flyLeft .6s ease-out forwards}
        .animate-right{animation:flyRight .6s ease-out forwards}
        @keyframes flyLeft{to{opacity:1;transform:translateY(0) translateX(0)}}
        @keyframes flyRight{to{opacity:1;transform:translateY(0) translateX(0)}}
        @media (prefers-reduced-motion: reduce){
          .observe-left,.observe-right{opacity:1;transform:none}
          .animate-left,.animate-right{animation:none}
        }
      `}</style>
      {/* On-scroll animation setup */}
      {(() => null)()}
      {/* Hero */}
      <section id="hero" className="grid items-center gap-10 py-12 md:py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Instant menu profit clarity for Australian small food businesses.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
            A Google Sheet to cost recipes, see item-level margins, and price with GST confidence.
          </p>
          <ul className="mt-8 space-y-3 text-base text-gray-300">
            <Bullet><strong>Item profit and popularity</strong> — decide what to promote, fix, or drop</Bullet>
            <Bullet><strong>Recipe builder</strong> — auto-calculates COGS, GP$, and GP% in-sheet</Bullet>
            <Bullet><strong>Yield/Waste aware</strong> — costs reflect trim and prep yields</Bullet>
            <Bullet><strong>GST-ready for AU</strong> — priced in AUD</Bullet>
            <Bullet><strong>No subscriptions</strong> — works with Google Sheets</Bullet>
          </ul>
          
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a 
              href="#pricing" 
              className="rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] hover:shadow-[#29E7CD]/25"
              data-event="primary_cta_click"
            >
              Get the Google Sheet
            </a>
            <a href="#demo" className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300">
              Watch the demo
            </a>
            <p className="w-full text-sm text-gray-500">For food vans, stalls, cafés, and small restaurants. 7-day refund.</p>
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
                className="w-full h-auto rounded-xl border border-gray-600"
                loading="lazy"
                width={800}
                height={500}
                sizes="(max-width: 768px) 100vw, 800px"
              />
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
