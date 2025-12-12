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

  const errorMessages: Record<string, { title: string; message: string; troubleshooting?: string[] }> = {
    Configuration: {
      title: 'Configuration Error',
      message:
        'There was a problem with the server configuration. Please contact support if this persists.',
      troubleshooting: [
        'Check that Auth0 environment variables are configured correctly',
        'Verify NEXTAUTH_URL matches your domain',
        'Check Vercel environment variables',
      ],
    },
    AccessDenied: {
      title: 'Access Denied',
      message:
        'You do not have permission to sign in. Please check your credentials or contact support.',
      troubleshooting: [
        'Verify your email is in the allowlist (if enabled)',
        'Check your Auth0 account permissions',
        'Contact support if you believe this is an error',
      ],
    },
    Verification: {
      title: 'Verification Error',
      message:
        'The verification token has expired or has already been used. Please try signing in again.',
      troubleshooting: ['Try signing in again', 'Clear your browser cookies', 'Use a different browser'],
    },
    Callback: {
      title: 'Callback Error',
      message:
        'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
      troubleshooting: [
        'Ensure you are accessing via www.prepflow.org (not prepflow.org)',
        'Check Auth0 callback URL configuration',
        'Contact support with this error code',
      ],
    },
    autho: {
      title: 'Authentication Error',
      message:
        'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
      troubleshooting: [
        'Ensure you are accessing via www.prepflow.org',
        'Check Auth0 callback URL configuration',
        'Contact support with this error code',
      ],
    },
    auth0: {
      title: 'Authentication Error',
      message:
        'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please ensure you are accessing the site via www.prepflow.org (not prepflow.org).',
      troubleshooting: [
        'Ensure you are accessing via www.prepflow.org (not prepflow.org)',
        'Clear your browser cookies and try again',
        'Check Auth0 callback URL configuration',
      ],
    },
    MissingEmail: {
      title: 'Email Missing',
      message:
        'Your account email could not be retrieved during authentication. This may be a temporary issue with your identity provider.',
      troubleshooting: [
        'Try signing in again - this is usually a temporary issue',
        'Ensure your Google/Auth0 account has an email address',
        'Check Vercel logs for Management API errors',
        'Contact support if this persists',
      ],
    },
    MissingAccountOrUser: {
      title: 'Account Data Missing',
      message:
        'Required account information is missing during authentication. This may be a temporary issue with Auth0.',
      troubleshooting: [
        'Try signing in again - this is usually a temporary issue',
        'Clear your browser cookies',
        'Check Vercel logs for detailed error information',
        'Contact support if this persists',
      ],
    },
    MissingToken: {
      title: 'Session Token Missing',
      message:
        'Your session token could not be retrieved. Please try signing in again to create a new session.',
      troubleshooting: [
        'Try signing in again',
        'Clear your browser cookies',
        'Use a different browser',
        'Contact support if this persists',
      ],
    },
    InvalidCallbackUrl: {
      title: 'Invalid Redirect URL',
      message:
        'The redirect URL after authentication is invalid or unsafe. You have been redirected to the webapp instead.',
      troubleshooting: [
        'This is usually handled automatically',
        'If you see this repeatedly, contact support',
        'Check that callback URLs are configured correctly in Auth0',
      ],
    },
    Default: {
      title: 'Authentication Error',
      message:
        'An error occurred during authentication. Please try again or contact support if the problem persists.',
      troubleshooting: [
        'Try signing in again',
        'Clear your browser cookies',
        'Check Vercel logs for detailed error information',
        'Contact support with the error code below',
      ],
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
                    <li key={index} className={`${LANDING_TYPOGRAPHY.sm} flex items-start gap-2 text-gray-400`}>
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
