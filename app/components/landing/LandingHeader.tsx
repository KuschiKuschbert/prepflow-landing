'use client';
/**
 * Landing page header component
 */

import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';
import { BrandMark } from '../../../components/BrandMark';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { MagneticButton } from '../../../components/ui/MagneticButton';
import { BUTTON_STYLES } from '../../../lib/tailwind-utils';
import { useTranslation } from '../../../lib/useTranslation';
interface LandingHeaderProps {
  trackEngagement?: (event: string) => void;
}

const LandingHeader = React.memo(function LandingHeader({
  trackEngagement = () => {},
}: LandingHeaderProps) {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="tablet:px-6 tablet:py-4 mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo - More prominent with animations */}
          <Link href="/" className="flex shrink-0 items-center">
            <BrandMark
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={64}
              height={64}
              className="tablet:h-20 tablet:w-20 desktop:h-24 desktop:w-24 h-16 w-16"
              floating={true}
              glowOnHover={true}
              animationIntensity={0.8}
            />
            <span className="sr-only">PrepFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop:flex hidden items-center space-x-8">
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
            <Link
              href="/webapp/guide"
              className="rounded text-gray-300 transition-colors hover:text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
              aria-label="View PrepFlow guides"
            >
              Guide
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="desktop:flex hidden items-center gap-4">
            <LanguageSwitcher className="mr-4" />
            {!isLoading &&
              (isAuthenticated ? (
                <MagneticButton
                  className={BUTTON_STYLES.primary}
                  onClick={() => {
                    trackEngagement('header_go_to_dashboard_click');
                    window.location.href = '/webapp';
                  }}
                  strength={0.3}
                  maxDistance={10}
                >
                  Go to Dashboard
                </MagneticButton>
              ) : (
                <>
                  <MagneticButton
                    className={BUTTON_STYLES.secondary}
                    onClick={() => {
                      trackEngagement('header_sign_in_click');
                      try {
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                        }
                      } catch (err) {
                        // SessionStorage might fail in private mode - log but continue
                        logger.dev(
                          '[LandingHeader] Error accessing sessionStorage (non-blocking):',
                          {
                            error: err instanceof Error ? err.message : String(err),
                          },
                        );
                      }
                      window.location.href = '/api/auth/login?returnTo=/webapp';
                    }}
                    strength={0.3}
                    maxDistance={10}
                  >
                    {t('nav.signIn', 'Sign in')}
                  </MagneticButton>
                  <MagneticButton
                    className={BUTTON_STYLES.primary}
                    onClick={() => {
                      trackEngagement('header_register_click');
                      try {
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem('PF_AUTH_IN_PROGRESS', '1');
                        }
                      } catch (err) {
                        // SessionStorage might fail in private mode - log but continue
                        logger.dev(
                          '[LandingHeader] Error accessing sessionStorage (non-blocking):',
                          {
                            error: err instanceof Error ? err.message : String(err),
                          },
                        );
                      }
                      window.location.href = '/api/auth/login?returnTo=/webapp';
                    }}
                    strength={0.3}
                    maxDistance={10}
                  >
                    {t('nav.register', 'Register')}
                  </MagneticButton>
                </>
              ))}
          </div>

          {/* Mobile Header - Simplified: Just logo and CTA */}
          <div className="desktop:hidden flex flex-1 items-center justify-end gap-2">
            {!isLoading && (
              <MagneticButton
                className="text-fluid-xs flex min-h-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#29E7CD]/25 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
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
                    } catch (err) {
                      // SessionStorage might fail in private mode - log but continue
                      logger.dev('[LandingHeader] Error accessing sessionStorage (non-blocking):', {
                        error: err instanceof Error ? err.message : String(err),
                      });
                    }
                    window.location.href = '/api/auth/login?returnTo=/webapp';
                  }
                }}
                strength={0.25}
                maxDistance={8}
              >
                {isAuthenticated ? 'Go to Dashboard' : t('nav.register', 'Get Started')}
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default LandingHeader;
