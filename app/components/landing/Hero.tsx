'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { logger } from '@/lib/logger';

interface HeroProps {
  onTourClick?: () => void;
  trackEngagement?: (event: string) => void;
}

export default function Hero({ onTourClick, trackEngagement }: HeroProps) {
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;

  const handleSignIn = () => {
    if (trackEngagement) {
      trackEngagement('hero_sign_in_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (err) {
      // SessionStorage might fail in private mode - log but continue
      logger.dev('[Hero] Error accessing sessionStorage (non-blocking):', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  const handleRegister = () => {
    if (trackEngagement) {
      trackEngagement('hero_register_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (err) {
      // SessionStorage might fail in private mode - log but continue
      logger.dev('[Hero] Error accessing sessionStorage (non-blocking):', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  const handleGoToDashboard = () => {
    if (trackEngagement) {
      trackEngagement('hero_go_to_dashboard_click');
    }
    window.location.href = '/webapp';
  };

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-transparent">
      <div className="tablet:py-20 mx-auto w-full max-w-7xl px-6 py-16 text-center">
        {/* Headline - MacBook Pro Style */}
        <ScrollReveal variant="fade-up" className="mb-12">
          <h1 className="text-fluid-5xl tablet:text-fluid-6xl desktop:text-fluid-7xl large-desktop:text-fluid-7xl xl:text-fluid-8xl font-light tracking-tight text-white">
            PrepFlow
          </h1>
          <p className="text-fluid-xl tablet:text-fluid-2xl desktop:text-fluid-3xl mt-8 font-light text-gray-300">
            Know your costs. Price with confidence.
          </p>
        </ScrollReveal>

        {/* CTAs - MacBook Pro Style */}
        <ScrollReveal
          variant="fade-up"
          delay={0.2}
          className="tablet:flex-row mt-16 flex flex-col items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <MagneticButton
              onClick={handleGoToDashboard}
              className="text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-3 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
              aria-label="Go to Dashboard"
              strength={0.4}
              maxDistance={15}
            >
              Go to Dashboard
            </MagneticButton>
          ) : (
            <>
              <MagneticButton
                onClick={handleRegister}
                className="text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-white px-10 py-4 font-normal text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Register for PrepFlow"
                strength={0.4}
                maxDistance={15}
              >
                Get Started
              </MagneticButton>
              <MagneticButton
                onClick={handleSignIn}
                className="text-fluid-base tablet:text-fluid-lg rounded-full border border-white/20 bg-transparent px-10 py-4 font-normal text-white transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Sign in to PrepFlow"
                strength={0.4}
                maxDistance={15}
              >
                Sign In
              </MagneticButton>
            </>
          )}
        </ScrollReveal>

        {/* Dashboard Screenshot - MacBook Pro Style */}
        <ScrollReveal
          variant="scale-up"
          delay={0.4}
          className="mt-24 flex items-center justify-center"
        >
          <div className="w-full max-w-6xl">
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f1f]/30 shadow-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/dashboard-screenshot.png"
                alt="PrepFlow Dashboard showing kitchen management overview"
                width={1920}
                height={1080}
                className="h-auto w-full"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />
            </motion.div>
          </div>
        </ScrollReveal>

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
