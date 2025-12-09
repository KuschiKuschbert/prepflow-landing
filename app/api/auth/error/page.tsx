'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { LANDING_TYPOGRAPHY, LANDING_FONT_WEIGHTS } from '@/lib/landing-styles';

/**
 * Custom Auth0 Error Page
 * Styled with Cyber Carrot Design System
 */
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; message: string }> = {
    Configuration: {
      title: 'Configuration Error',
      message:
        'There was a problem with the server configuration. Please contact support if this persists.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message:
        'You do not have permission to sign in. Please check your credentials or contact support.',
    },
    Verification: {
      title: 'Verification Error',
      message:
        'The verification token has expired or has already been used. Please try signing in again.',
    },
    Callback: {
      title: 'Callback Error',
      message:
        'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
    },
    autho: {
      title: 'Authentication Error',
      message:
        'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
    },
    Default: {
      title: 'Authentication Error',
      message:
        'An error occurred during authentication. Please try again or contact support if the problem persists.',
    },
  };

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Cyber Carrot Gradient Border Container */}
        <div className="rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px]">
          <div className="desktop:p-10 rounded-3xl bg-[#1f1f1f]/95 p-8">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1
              className={`${LANDING_TYPOGRAPHY['2xl']} ${LANDING_FONT_WEIGHTS.bold} mb-3 text-center text-white`}
            >
              {errorInfo.title}
            </h1>

            {/* Error Message */}
            <p className={`${LANDING_TYPOGRAPHY.base} mb-8 text-center text-gray-400`}>
              {errorInfo.message}
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/api/auth/signin"
                className="block w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] p-[1px] transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B00]/25"
              >
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#1f1f1f] px-6 py-4 transition-all duration-200 hover:bg-[#1f1f1f]/90">
                  <span
                    className={`${LANDING_TYPOGRAPHY.base} ${LANDING_FONT_WEIGHTS.semibold} text-white`}
                  >
                    Try Again
                  </span>
                </div>
              </Link>

              <Link
                href="/"
                className="block w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-4 text-center transition-all duration-200 hover:bg-[#2a2a2a]/60"
              >
                <span
                  className={`${LANDING_TYPOGRAPHY.base} ${LANDING_FONT_WEIGHTS.semibold} text-white`}
                >
                  Back to Home
                </span>
              </Link>
            </div>

            {/* Error Code (for debugging) */}
            {error && (
              <div className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-3">
                <p className={`${LANDING_TYPOGRAPHY.xs} text-center text-gray-600`}>
                  Error Code: <span className="font-mono text-gray-500">{error}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">Loading...</div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
