'use client';
/**
 * Landing page header component
 */

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { BrandMark } from '../../../components/BrandMark';
import { BUTTON_STYLES } from '../../../lib/tailwind-utils';
import { useTranslation } from '../../../lib/useTranslation';
interface LandingHeaderProps {
  trackEngagement: (event: string) => void;
}

const LandingHeader = React.memo(function LandingHeader({ trackEngagement }: LandingHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <BrandMark
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={1024}
              height={1024}
              className="h-[40px] w-[40px] md:h-12 md:w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.featuresAria', 'View PrepFlow features'))}
            >
              {t('nav.features', 'What it does')}
            </a>
            <a
              href="#how-it-works"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.howItWorksAria', 'Learn how PrepFlow works'))}
            >
              {t('nav.howItWorks', "How it's different")}
            </a>
            <a
              href="#benefits"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label="See what the features add up to"
            >
              Outcomes
            </a>
            {/* Pricing link removed for explainer-focused landing */}
            <a
              href="#faq"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.faqAria', 'Frequently asked questions'))}
            >
              {t('nav.faq', 'FAQ (the good bits)')}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher className="mr-4" />
            <button
              className={BUTTON_STYLES.secondary}
              onClick={() => {
                trackEngagement('header_sign_in_click');
                try {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                  }
                } catch (_) {}
                signIn('auth0', { callbackUrl: '/webapp' });
              }}
            >
              {t('nav.signIn', 'Sign in')}
            </button>
            <button
              className={BUTTON_STYLES.primary}
              onClick={() => {
                trackEngagement('header_register_click');
                try {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                  }
                } catch (_) {}
                signIn('auth0', { callbackUrl: '/webapp' });
              }}
            >
              {t('nav.register', 'Register')}
            </button>
          </div>

          {/* Mobile Header - Simplified: Just logo and CTA */}
          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            <button
              className="flex min-h-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              onClick={() => {
                trackEngagement('mobile_header_register_click');
                try {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                  }
                } catch (_) {}
                signIn('auth0', { callbackUrl: '/webapp' });
              }}
            >
              {t('nav.register', 'Get Started')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

export default LandingHeader;
