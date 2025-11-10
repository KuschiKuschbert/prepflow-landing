'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

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
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left side - Text content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Kitchen Project Management Software
          </h1>
          <p className="mt-4 text-lg text-gray-300 md:text-xl">
            From ingredients to pricing, all in one place
          </p>
          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Stop fighting with Excel at 2 AM
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
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

        {/* Right side - Dashboard screenshot */}
        <div className="relative hidden lg:block">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-2 shadow-2xl">
            <Image
              src="/images/dashboard-screenshot.png"
              alt="PrepFlow Dashboard showing kitchen management overview"
              width={800}
              height={600}
              className="rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
