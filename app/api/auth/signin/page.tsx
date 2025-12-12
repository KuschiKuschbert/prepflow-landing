'use client';

import { LANDING_FONT_WEIGHTS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { getProviders, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

/**
 * Custom Auth0 Sign-In Page
 * Styled with Cyber Carrot Design System
 */
function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/webapp';
  const error = searchParams.get('error');
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    getProviders().then(provs => {
      setProviders(provs);
      setIsLoading(false);
    });
  }, []);

  // Auto-redirect to www version if auth0 error detected and on non-www domain
  useEffect(() => {
    if (error === 'auth0' || error === 'Callback') {
      const currentUrl = window.location.href;
      if (currentUrl.includes('prepflow.org') && !currentUrl.includes('www.prepflow.org')) {
        // Auto-redirect to www version
        window.location.href = currentUrl.replace('prepflow.org', 'www.prepflow.org');
        return;
      }
    }
  }, [error]);

  // Auto-redirect to Auth0 if error=auth0 is detected (cosmetic error - login actually works)
  // This improves UX by automatically starting the login flow instead of showing confusing error
  // Redirect immediately without waiting for providers to load - we know Auth0 is configured
  useEffect(() => {
    if (error === 'auth0' && !isRedirecting) {
      setIsRedirecting(true);

      // Redirect immediately - don't wait for providers to load
      // Construct the signin URL and redirect immediately
      const signinUrl = `${window.location.origin}/api/auth/signin/auth0?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      window.location.replace(signinUrl);
    }
  }, [error, callbackUrl, isRedirecting]);

  const handleSignIn = (providerId: string) => {
    signIn(providerId, {
      callbackUrl,
      authorizationParams: {
        prompt: 'login',
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Cyber Carrot Gradient Border Container */}
        <div className="rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px]">
          <div className="desktop:p-10 rounded-3xl bg-[#1f1f1f]/95 p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1
                className={`${LANDING_TYPOGRAPHY['3xl']} ${LANDING_FONT_WEIGHTS.bold} mb-3 tracking-tight text-white`}
              >
                Welcome to PrepFlow
              </h1>
              <p className={`${LANDING_TYPOGRAPHY.base} text-gray-400`}>
                Sign in to access your kitchen management dashboard
              </p>
            </div>

            {/* Error Message - Suppress auth0 error since login actually works (cosmetic issue) */}
            {error && error !== 'auth0' && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <p className={`${LANDING_TYPOGRAPHY.sm} text-red-400`}>
                  {error === 'AccessDenied'
                    ? 'Access denied. Please check your credentials and try again.'
                    : error === 'Configuration'
                      ? 'There was a problem with the server configuration. Please contact support.'
                      : error === 'Verification'
                        ? 'The verification token has expired. Please try signing in again.'
                        : error === 'Callback' || error === 'autho'
                          ? 'There was a problem with the authentication callback. This usually means the callback URL is not properly configured. Please ensure you are accessing the site via www.prepflow.org (not prepflow.org).'
                          : 'An error occurred during sign in. Please try again.'}
                </p>
                {(error === 'Callback' || error === 'autho') && (
                  <p className={`${LANDING_TYPOGRAPHY.xs} mt-2 text-gray-500`}>
                    Error code: {error}. This may indicate a callback URL configuration issue. Try
                    accessing{' '}
                    <a
                      href="https://www.prepflow.org/api/auth/signin"
                      className="text-[#29E7CD] hover:underline"
                    >
                      www.prepflow.org
                    </a>{' '}
                    instead.
                  </p>
                )}
              </div>
            )}

            {/* Loading message when auto-redirecting for auth0 error */}
            {error === 'auth0' && isRedirecting && (
              <div className="mb-6 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent" />
                  <p className={`${LANDING_TYPOGRAPHY.sm} text-[#29E7CD]`}>
                    Redirecting to sign in...
                  </p>
                </div>
              </div>
            )}

            {/* Sign In Buttons */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#29E7CD] border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-4">
                {providers &&
                  Object.values(providers).map((provider: any) => (
                    <button
                      key={provider.id}
                      onClick={() => handleSignIn(provider.id)}
                      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] p-[1px] transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B00]/25"
                    >
                      <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#1f1f1f] px-6 py-4 transition-all duration-200 group-hover:bg-[#1f1f1f]/90">
                        {/* Auth0 Logo/Icon */}
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span
                          className={`${LANDING_TYPOGRAPHY.base} ${LANDING_FONT_WEIGHTS.semibold} text-white`}
                        >
                          Sign in with {provider.name}
                        </span>
                      </div>
                    </button>
                  ))}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2a2a2a]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`${LANDING_TYPOGRAPHY.sm} bg-[#1f1f1f] px-4 text-gray-500`}>
                      or
                    </span>
                  </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className={`${LANDING_TYPOGRAPHY.sm} text-gray-500`}>
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => {
                        signIn('auth0', {
                          callbackUrl,
                          authorizationParams: {
                            prompt: 'login',
                            screen_hint: 'signup',
                          },
                        });
                      }}
                      className="text-[#29E7CD] transition-colors hover:text-[#FF6B00]"
                    >
                      Create one now
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 border-t border-[#2a2a2a] pt-6 text-center">
              <p className={`${LANDING_TYPOGRAPHY.xs} text-gray-600`}>
                Secure authentication powered by Auth0
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className={`${LANDING_TYPOGRAPHY.sm} text-gray-400 transition-colors hover:text-[#29E7CD]`}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Sign-in page component with auto-redirect for cosmetic auth0 errors.
 *
 * @component
 * @returns {JSX.Element} Sign-in page with Auth0 provider
 */
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">Loading...</div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
