'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

interface HeroProps {
  onTourClick?: () => void;
  trackEngagement?: (event: string) => void;
}

export default function Hero({ onTourClick, trackEngagement }: HeroProps) {
  const { ref: textRef, animationStyle: textAnimationStyle } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    delay: 0,
  });

  const { ref: imageRef, animationStyle: imageAnimationStyle } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
    delay: 100,
  });

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
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-transparent">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20 text-center">
        {/* Headline - Apple Style */}
        <div ref={textRef} style={textAnimationStyle} className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl">
            PrepFlow
          </h1>
          <p className="mt-6 text-2xl font-medium text-gray-300 md:text-3xl lg:text-4xl">
            Kitchen Management Platform.
          </p>
          <p className="mt-2 text-2xl font-medium text-gray-300 md:text-3xl lg:text-4xl">
            Now supercharged by AI.
          </p>
        </div>

        {/* CTAs - Minimal Apple Style */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleRegister}
            className="rounded-full border border-white/20 bg-white px-8 py-3 text-lg font-medium text-black transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Register for PrepFlow"
          >
            Register
          </button>
          <button
            onClick={handleSignIn}
            className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-lg font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Sign in to PrepFlow"
          >
            Sign In
          </button>
        </div>

        {/* Dashboard Screenshot - Large, Centered */}
        <div
          ref={imageRef}
          style={imageAnimationStyle}
          className="mt-16 flex items-center justify-center"
        >
          <div className="w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f1f]/30 shadow-2xl backdrop-blur-sm">
              <Image
                src="/images/dashboard-screenshot.png"
                alt="PrepFlow Dashboard showing kitchen management overview"
                width={1920}
                height={1080}
                className="h-auto w-full"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>

        {/* Smooth Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="h-6 w-6 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
