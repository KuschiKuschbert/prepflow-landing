'use client';

import React from 'react';
import { initializeTracking } from '../../../lib/track';
import { getCurrentPrice, formatAud, getUpcomingChanges, daysUntil } from '../../../lib/pricing';

export default function Control() {
  React.useEffect(() => {
    // Initialize tracking for control variant
    initializeTracking('control');
  }, []);

  const left1Ref = React.useRef<HTMLDivElement | null>(null);
  const left2Ref = React.useRef<HTMLDivElement | null>(null);
  const right1Ref = React.useRef<HTMLDivElement | null>(null);
  const right2Ref = React.useRef<HTMLDivElement | null>(null);
  const priceRef = React.useRef<HTMLDivElement | null>(null);

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
              <img 
                src="/images/dashboard-screenshot.png" 
                alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
                className="w-full h-auto rounded-xl border border-gray-600"
                loading="lazy"
                width="800"
                height="500"
              />
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
      <section id="features" className="py-10 md:py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <FeatureCard title="Easy COGS">
            Enter ingredients and recipe steps; costs and GP calculate automatically.
          </FeatureCard>
          <FeatureCard title="Yield & Waste Aware">
            Account for prep yield and trim so margins reflect reality.
          </FeatureCard>
          <FeatureCard title="Item-Level Clarity">
            See margin by item and simple menu mix categories for quick decisions.
          </FeatureCard>
          <FeatureCard title="GST & Currency">
            GST-ready for Australia; priced in AUD.
          </FeatureCard>
        </div>
      </section>

      {/* Demo removed to reduce empty space */}

      {/* Price & FAQ around card */}
      <section id="pricing" className="py-10 md:py-12">
        <div className="mx-auto max-w-6xl text-center fade-in-up">
          <h2 className="text-3xl font-bold">One-time purchase. 7-day refund.</h2>
          <p className="mt-2 text-gray-400">No subscriptions. Current price with next planned change.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3 items-start">
            <div className="space-y-6 text-left">
              <div ref={left1Ref} className="observe-left"><FaqItem q="Who is it for?" a="Food vans, stalls, cafés, and small restaurants in Australia." /></div>
              <div ref={left2Ref} className="observe-left"><FaqItem q="Can I customize it?" a="Yes. It is your copy to adapt and edit." /></div>
            </div>
            <div className="flex justify-center" data-price-card-anchor>
              <DynamicPriceCard />
            </div>
            <div className="space-y-6 text-left">
              <div ref={right1Ref} className="observe-right"><FaqItem q="Do I need Excel?" a="No. It is designed for Google Sheets." /></div>
              <div ref={right2Ref} className="observe-right"><FaqItem q="What if it is not for me?" a="Request a refund within 7 days." /></div>
            </div>
          </div>
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
  const next = getUpcomingChanges()[0];
  return (
    <div className="rounded-2xl border border-gray-700 bg-[#121212] p-5 flex flex-col max-w-md">
      <div>
        <p className="text-sm text-gray-400">AUD</p>
        <p className="mt-1 text-4xl font-extrabold">{formatAud(price)}</p>
        <p className="mt-1 text-sm text-gray-400">One-time purchase • 7-day refund</p>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-300">
        <li>• Google Sheet template</li>
        <li>• Setup guide and sample data</li>
        <li>• Works with Google Sheets</li>
      </ul>
      <a
        href="/go/gumroad"
        target="_blank"
        rel="noopener noreferrer"
        data-event="outbound_click_gumroad"
        data-price={price}
        className="mt-4 inline-flex justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Get the Google Sheet
      </a>
      {next && (
        <p className="mt-3 text-xs text-gray-500">
          Next change: {formatAud(next.price)} on {next.date.toLocaleDateString()} (in {daysUntil(next.date)} days)
        </p>
      )}
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
