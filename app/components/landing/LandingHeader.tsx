'use client';
/**
 * Landing page header component
 */

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import React from 'react';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import OptimizedImage from '../../../components/OptimizedImage';
import { MobileNavigation } from '../../../components/ui/MobileNavigation';
import { BUTTON_STYLES } from '../../../lib/tailwind-utils';
import { useTranslation } from '../../../lib/useTranslation';

interface LandingHeaderProps {
  trackEngagement: (event: string) => void;
}

const LandingHeader = React.memo(function LandingHeader({ trackEngagement }: LandingHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <OptimizedImage
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={140}
              height={45}
              className="h-9 w-auto"
              priority={true}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.featuresAria', 'View PrepFlow features'))}
            >
              {t('nav.features', 'Features')}
            </a>
            <a
              href="#how-it-works"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.howItWorksAria', 'Learn how PrepFlow works'))}
            >
              {t('nav.howItWorks', 'How it works')}
            </a>
            {/* Pricing link removed for explainer-focused landing */}
            <a
              href="#faq"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label={String(t('nav.faqAria', 'Frequently asked questions'))}
            >
              {t('nav.faq', 'FAQ')}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher className="mr-4" />
            <button
              className={BUTTON_STYLES.secondary}
              onClick={() => {
                trackEngagement('header_sign_in_click');
                signIn('auth0', { callbackUrl: '/webapp' });
              }}
            >
              {t('nav.signIn', 'Sign in')}
            </button>
            <button
              className={BUTTON_STYLES.primary}
              onClick={() => {
                trackEngagement('header_register_click');
                signIn('auth0', { callbackUrl: '/webapp' });
              }}
            >
              {t('nav.register', 'Register')}
            </button>
          </div>

          {/* Mobile Header */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher className="scale-90" showFlag={true} showName={true} size="sm" />
            <MobileNavigation onEngagement={trackEngagement} />
          </div>
        </div>
      </div>
    </header>
  );
});

export default LandingHeader;
