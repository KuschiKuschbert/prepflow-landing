'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

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
          PrepFlow helps cafés and restaurants calculate COGS, manage recipes, and optimize
          margins—fast and accurately.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all hover:opacity-90"
            onClick={() => signIn('auth0', { callbackUrl: '/webapp' })}
          >
            Sign in
          </button>
          <button
            className="rounded-2xl border border-[#2a2a2a] px-6 py-3 font-semibold text-white hover:bg-[#2a2a2a]/40"
            onClick={() => signIn('auth0', { callbackUrl: '/webapp' })}
          >
            Register
          </button>
          <button
            className="rounded-2xl px-6 py-3 font-semibold text-[#29E7CD] underline-offset-2 hover:underline"
            onClick={() => (onTourClick ? onTourClick() : (window.location.hash = '#tour'))}
          >
            Take a quick tour
          </button>
        </div>
      </div>
    </section>
  );
}
