'use client';

import { LANDING_FONT_WEIGHTS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { errorMessages } from './error-messages';

/**
 * Custom Auth0 Error Page
 * Styled with Cyber Carrot Design System
 */
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
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
            <p className={`${LANDING_TYPOGRAPHY.base} mb-6 text-center text-gray-400`}>
              {errorInfo.message}
            </p>

            {/* Troubleshooting Steps */}
            {errorInfo.troubleshooting && errorInfo.troubleshooting.length > 0 && (
              <div className="mb-8 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
                <h3
                  className={`${LANDING_TYPOGRAPHY.sm} ${LANDING_FONT_WEIGHTS.semibold} mb-3 text-gray-300`}
                >
                  Troubleshooting Steps:
                </h3>
                <ul className="space-y-2">
                  {errorInfo.troubleshooting.map((step, index) => (
                    <li
                      key={index}
                      className={`${LANDING_TYPOGRAPHY.sm} flex items-start gap-2 text-gray-400`}
                    >
                      <span className="mt-1 text-[#29E7CD]">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/api/auth/login"
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

            {/* Error Code and Diagnostic Links */}
            {error && (
              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-3">
                  <p className={`${LANDING_TYPOGRAPHY.xs} text-center text-gray-600`}>
                    Error Code: <span className="font-mono text-gray-500">{error}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-3">
                  <p className={`${LANDING_TYPOGRAPHY.xs} mb-2 text-center text-gray-600`}>
                    Diagnostic Endpoints:
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/api/test/auth0-signin-flow"
                      className={`${LANDING_TYPOGRAPHY.xs} text-center text-[#29E7CD] hover:text-[#29E7CD]/80`}
                      target="_blank"
                    >
                      Sign-In Flow Diagnostic
                    </Link>
                    <Link
                      href="/api/test/auth0-social-connections"
                      className={`${LANDING_TYPOGRAPHY.xs} text-center text-[#29E7CD] hover:text-[#29E7CD]/80`}
                      target="_blank"
                    >
                      Social Connections Status
                    </Link>
                  </div>
                </div>
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
