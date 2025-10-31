'use client';

import React from 'react';
// Auth bypass for local iteration: link directly to /webapp

interface HeroProps {
  onTourClick?: () => void;
}

export default function Hero({ onTourClick }: HeroProps) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          Run a smarter kitchen. Know your costs. Price with confidence.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          A small set of tools to price dishes properly, move faster, and keep within the rules. No
          pitch. Just useful.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all hover:opacity-90"
            onClick={() => (window.location.href = '/webapp')}
            aria-label="Open PrepFlow web app"
          >
            Get PrepFlow Now
          </button>
          <button
            className="rounded-2xl border border-[#2a2a2a] px-6 py-3 font-semibold text-white hover:bg-[#2a2a2a]/40"
            onClick={() => (onTourClick ? onTourClick() : (window.location.hash = '#tour'))}
            aria-label="Watch a short demo"
          >
            Watch the 2‑min demo
          </button>
        </div>
      </div>
    </section>
  );
}
