'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import AutosaveGlobalIndicator from '@/app/webapp/components/AutosaveGlobalIndicator';
import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';

interface LogoSectionProps {
  shouldPreventNavigation: React.RefObject<boolean | null>;
  handleLogoClick: (e: React.MouseEvent) => void;
  handleLogoTouchStart: (e: React.TouchEvent) => void;
  handleLogoTouchEnd: (e: React.TouchEvent) => void;
  handleLogoMouseDown: () => void;
  handleLogoMouseUp: () => void;
  handleLogoMouseLeave: () => void;
  seasonalBannerText: string | null;
  seasonalBannerColor: string;
  isDesktop: boolean;
}

/**
 * Logo section component with seasonal banner
 */
export function LogoSection({
  shouldPreventNavigation,
  handleLogoClick,
  handleLogoTouchStart,
  handleLogoTouchEnd,
  handleLogoMouseDown,
  handleLogoMouseUp,
  handleLogoMouseLeave,
  seasonalBannerText,
  seasonalBannerColor,
  isDesktop,
}: LogoSectionProps) {
  return (
    <div className="desktop:space-x-3 flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <Link
          href="/webapp"
          className="flex items-center"
          onClick={e => {
            // Prevent navigation if Easter egg is triggered
            if (shouldPreventNavigation.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <BrandMark
            src="/images/prepflow-logo.png"
            alt="PrepFlow Logo"
            width={48}
            height={48}
            className="flex h-12 min-h-[44px] w-12 min-w-[44px] cursor-pointer touch-manipulation items-center justify-center"
            onClick={handleLogoClick}
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
            onMouseDown={handleLogoMouseDown}
            onMouseUp={handleLogoMouseUp}
            onMouseLeave={handleLogoMouseLeave}
          />
        </Link>
        <Link href="/webapp" className="desktop:inline hidden">
          <span
            className={`${LANDING_TYPOGRAPHY.lg} font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--primary)]`}
          >
            PrepFlow
          </span>
        </Link>
        <AutosaveGlobalIndicator />
        {/* Seasonal Banner - Next to autosave indicator */}
        {seasonalBannerText && isDesktop && (
          <div className="pf-seasonal-banner pointer-events-none ml-2">
            <span
              className="pf-seasonal-text desktop:text-sm text-xs font-bold tracking-wider uppercase"
              style={{ color: seasonalBannerColor }}
            >
              {seasonalBannerText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
