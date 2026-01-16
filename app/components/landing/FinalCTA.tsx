'use client';

import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
    LANDING_LAYOUT,
    LANDING_TYPOGRAPHY,
    getSectionClasses
} from '@/lib/landing-styles';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';

interface FinalCTAProps {
  trackEngagement?: (event: string) => void;
}

export default function FinalCTA({ trackEngagement }: FinalCTAProps) {
  const { user } = useUser();
  const isAuthenticated = !!user;

  const handleSignIn = () => {
    if (trackEngagement) {
      trackEngagement('final_cta_sign_in_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (err) {
      // SessionStorage might fail in private mode - log but continue
      logger.dev('[FinalCTA] Error accessing sessionStorage (non-blocking):', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  const handleRegister = () => {
    if (trackEngagement) {
      trackEngagement('final_cta_register_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (err) {
      // SessionStorage might fail in private mode - log but continue
      logger.dev('[FinalCTA] Error accessing sessionStorage (non-blocking):', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    window.location.href = '/api/auth/login?returnTo=/webapp';
  };

  const handleGoToDashboard = () => {
    if (trackEngagement) {
      trackEngagement('final_cta_go_to_dashboard_click');
    }
    window.location.href = '/webapp';
  };

  return (
    <section className={`${getSectionClasses({ padding: 'large' })} relative overflow-hidden`}>
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
           className="h-[500px] w-[500px] rounded-full bg-landing-primary/10 blur-[120px]"
         />
      </div>

      <div className={`relative ${LANDING_LAYOUT.containerNarrow} text-center`}>
        <ScrollReveal variant="fade-up">
          <h2 className={`${LANDING_TYPOGRAPHY['4xl']} font-bold tracking-tight text-white`}>
            Ready to optimize your menu profitability?
          </h2>
          <p className={`${LANDING_TYPOGRAPHY.xl} mt-6 text-gray-400`}>
            Start tracking costs, calculating COGS, and making data-driven pricing decisions today.
          </p>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.2}
          className="tablet:flex-row mt-12 flex flex-col items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <MagneticButton
              onClick={handleGoToDashboard}
              className="text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
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
                className="text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Register for PrepFlow"
                strength={0.4}
                maxDistance={15}
              >
                Get Started
              </MagneticButton>
              <MagneticButton
                onClick={handleSignIn}
                className="text-fluid-lg rounded-full border border-white/20 bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Sign in to PrepFlow"
                strength={0.4}
                maxDistance={15}
              >
                Sign In
              </MagneticButton>
            </>
          )}
        </ScrollReveal>

        <ScrollReveal
          variant="fade-in"
          delay={0.4}
          className={`${LANDING_TYPOGRAPHY.sm} mt-8 text-gray-500`}
        >
          <p>No credit card required. Start your free trial today.</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
