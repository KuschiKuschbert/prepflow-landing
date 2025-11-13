'use client';
/**
 * Landing page header component
 */

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { BrandMark } from '../../../components/BrandMark';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { BUTTON_STYLES } from '../../../lib/tailwind-utils';
import { useTranslation } from '../../../lib/useTranslation';
interface LandingHeaderProps {
  trackEngagement: (event: string) => void;
}

const LandingHeader = React.memo(function LandingHeader({ trackEngagement }: LandingHeaderProps) {
  const { t } = useTranslation();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <BrandMark
              src="/images/prepflow-logo.svg"
              alt="PrepFlow Logo"
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label="View PrepFlow features"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label="Learn how PrepFlow works"
            >
              How it works
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher className="mr-4" />
            {!isLoading && (
              <button
                className={BUTTON_STYLES.primary}
                onClick={() => {
                  if (isAuthenticated) {
                    trackEngagement('header_go_to_dashboard_click');
                    window.location.href = '/webapp';
                  } else {
                    trackEngagement('header_get_started_click');
                    try {
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                      }
                    } catch (_) {}
                    signIn('auth0', { callbackUrl: '/webapp' });
                  }
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
            )}
          </div>

          {/* Mobile Header - Simplified: Just logo and CTA */}
          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            {!isLoading && (
              <button
                className="flex min-h-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                onClick={() => {
                  if (isAuthenticated) {
                    trackEngagement('mobile_header_go_to_dashboard_click');
                    window.location.href = '/webapp';
                  } else {
                    trackEngagement('mobile_header_register_click');
                    try {
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                      }
                    } catch (_) {}
                    signIn('auth0', { callbackUrl: '/webapp' });
                  }
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : t('nav.register', 'Get Started')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default LandingHeader;
