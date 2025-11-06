'use client';

import { signIn } from 'next-auth/react';

interface HeroProps {
  onTourClick?: () => void;
  trackEngagement?: (event: string) => void;
}

export default function Hero({ onTourClick, trackEngagement }: HeroProps) {
  const handleSignIn = () => {
    if (trackEngagement) {
      trackEngagement('hero_sign_in_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (_) {}
    signIn('auth0', { callbackUrl: '/webapp' });
  };

  const handleRegister = () => {
    if (trackEngagement) {
      trackEngagement('hero_register_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (_) {}
    signIn('auth0', { callbackUrl: '/webapp' });
  };

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
            onClick={handleRegister}
            aria-label="Register for PrepFlow"
          >
            Register
          </button>
          <button
            className="rounded-2xl border border-[#2a2a2a] px-6 py-3 font-semibold text-white hover:bg-[#2a2a2a]/40"
            onClick={handleSignIn}
            aria-label="Sign in to PrepFlow"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
