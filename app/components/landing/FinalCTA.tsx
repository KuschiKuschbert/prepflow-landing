'use client';

import { signIn, useSession } from 'next-auth/react';

interface FinalCTAProps {
  trackEngagement?: (event: string) => void;
}

export default function FinalCTA({ trackEngagement }: FinalCTAProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSignIn = () => {
    if (trackEngagement) {
      trackEngagement('final_cta_sign_in_click');
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
      trackEngagement('final_cta_register_click');
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
      }
    } catch (_) {}
    signIn('auth0', { callbackUrl: '/webapp' });
  };

  const handleGoToDashboard = () => {
    if (trackEngagement) {
      trackEngagement('final_cta_go_to_dashboard_click');
    }
    window.location.href = '/webapp';
  };

  return (
    <section className="tablet:py-20 relative bg-transparent py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-bold tracking-tight text-white">
          Ready to transform your kitchen?
        </h2>
        <p className="text-fluid-xl mt-6 text-gray-400">
          Join restaurants, cafés, and food trucks using PrepFlow to optimize their menu
          profitability.
        </p>

        <div className="tablet:flex-row mt-12 flex flex-col items-center justify-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleGoToDashboard}
              className="text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
              aria-label="Go to Dashboard"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={handleRegister}
                className="text-fluid-lg rounded-full border border-white/20 bg-white px-8 py-4 font-medium text-black transition-all hover:bg-gray-100 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Register for PrepFlow"
              >
                Get Started
              </button>
              <button
                onClick={handleSignIn}
                className="text-fluid-lg rounded-full border border-white/20 bg-transparent px-8 py-4 font-medium text-white transition-all hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none"
                aria-label="Sign in to PrepFlow"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <p className="text-fluid-sm mt-8 text-gray-500">
          No credit card required. Start your free trial today.
        </p>
      </div>
    </section>
  );
}
