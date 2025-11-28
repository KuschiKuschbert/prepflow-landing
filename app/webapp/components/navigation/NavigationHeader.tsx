'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import AutosaveGlobalIndicator from '../AutosaveGlobalIndicator';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { LogoutButton } from '../LogoutButton';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { useSession } from 'next-auth/react';
import { Search, Menu } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';

interface NavigationHeaderProps {
  className?: string;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  onSearchClick: () => void;
  isSearchOpen: boolean;
  pathname: string;
  navigationItems: Array<{ href: string; label: string }>;
  isActive: (href: string) => boolean;
  // Logo interaction handlers from parent
  handleLogoClick: (e: React.MouseEvent) => void;
  handleLogoTouchStart: (e: React.TouchEvent) => void;
  handleLogoTouchEnd: (e: React.TouchEvent) => void;
  handleLogoMouseDown: () => void;
  handleLogoMouseUp: () => void;
  handleLogoMouseLeave: () => void;
  shouldPreventNavigation: React.RefObject<boolean | null>;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Navigation header component for webapp.
 * Displays logo, breadcrumbs (desktop), search button, and user info.
 * Auto-hides on mobile/tablet when scrolling down, shows on scroll up or at top.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {RefObject} props.menuButtonRef - Ref for menu button (legacy, not used)
 * @param {Function} props.onMenuClick - Menu click handler (legacy, no-op)
 * @param {boolean} props.isSidebarOpen - Whether sidebar is open (legacy, always false)
 * @param {Function} props.onSearchClick - Callback when search button is clicked
 * @param {boolean} props.isSearchOpen - Whether search modal is open
 * @param {string} props.pathname - Current pathname
 * @param {Array} props.navigationItems - Array of navigation items
 * @param {Function} props.isActive - Function to check if a href is active
 * @param {Function} props.handleLogoClick - Logo click handler
 * @param {Function} props.handleLogoTouchStart - Logo touch start handler
 * @param {Function} props.handleLogoTouchEnd - Logo touch end handler
 * @param {Function} props.handleLogoMouseDown - Logo mouse down handler
 * @param {Function} props.handleLogoMouseUp - Logo mouse up handler
 * @param {Function} props.handleLogoMouseLeave - Logo mouse leave handler
 * @param {RefObject} props.shouldPreventNavigation - Ref to prevent navigation (for easter eggs)
 * @returns {JSX.Element} Navigation header
 */
export function NavigationHeader({
  className = '',
  menuButtonRef,
  onMenuClick,
  isSidebarOpen,
  onSearchClick,
  isSearchOpen,
  pathname,
  navigationItems,
  isActive,
  handleLogoClick,
  handleLogoTouchStart,
  handleLogoTouchEnd,
  handleLogoMouseDown,
  handleLogoMouseUp,
  handleLogoMouseLeave,
  shouldPreventNavigation,
}: NavigationHeaderProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];

  // Auto-hide header on mobile/tablet when scrolling down (not desktop)
  // Uses custom breakpoint: desktop = 1025px+ (from tailwind.config.ts)
  const { direction, isAtTop } = useScrollDirection();
  const isDesktop = useMediaQuery('(min-width: 1025px)'); // Match custom desktop breakpoint
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Always show on desktop (1025px+)
    if (isDesktop) {
      setIsVisible(true);
      return;
    }

    // Auto-hide on mobile/tablet (< 1025px): show at top, hide on scroll down, show on scroll up
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop, isDesktop]);

  return (
    <header
      role="banner"
      className={cn(
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'z-50',
        'border-b',
        'border-[#2a2a2a]',
        'bg-[#1f1f1f]',
        'pt-[var(--safe-area-inset-top)]',
        'h-[var(--header-height-mobile)]',
        'desktop:h-[var(--header-height-desktop)]',
        // Auto-hide transition only on mobile/tablet (< 1025px)
        !isDesktop && 'transition-transform duration-300 ease-in-out',
        className,
      )}
      style={{
        // Only apply transform on mobile/tablet (< 1025px)
        transform: !isDesktop && !isVisible ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div className="desktop:px-4 flex items-center justify-between px-3 py-2">
        <div className="desktop:space-x-3 flex items-center space-x-2">
          {/* Burger menu button (mobile only) */}
          <button
            ref={menuButtonRef}
            onClick={onMenuClick}
            className="desktop:hidden flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-[#2a2a2a]/50 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            aria-label="Open account menu"
            aria-expanded={isSidebarOpen}
          >
            <Icon icon={Menu} size="md" className="text-gray-400" aria-hidden={true} />
          </button>
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
                className={`${LANDING_TYPOGRAPHY.lg} font-semibold text-white transition-colors hover:text-[#29E7CD]`}
              >
                PrepFlow
              </span>
            </Link>
            <AutosaveGlobalIndicator />
          </div>
        </div>
        <div className={cn('hidden', 'items-center', 'space-x-2', 'desktop:flex')}>
          <Link
            href="/webapp"
            className={`${LANDING_TYPOGRAPHY.sm} text-gray-400 transition-colors duration-200 hover:text-[#29E7CD]`}
          >
            Dashboard
          </Link>
          {pathname !== '/webapp' && (
            <>
              <span className={`${LANDING_TYPOGRAPHY.sm} text-gray-500`}>/</span>
              <span className={`${LANDING_TYPOGRAPHY.sm} font-medium text-[#29E7CD]`}>
                {navigationItems.find(item => isActive(item.href))?.label || 'Page'}
              </span>
            </>
          )}
        </div>
        <div className="desktop:space-x-3 flex items-center space-x-2">
          <button
            onClick={onSearchClick}
            className={cn(
              'rounded-lg',
              'p-1.5',
              'min-h-[44px]',
              'min-w-[44px]',
              'transition-colors',
              'hover:bg-[#2a2a2a]/50',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-[#29E7CD]',
              'focus:ring-offset-2',
              'focus:ring-offset-[#1f1f1f]',
            )}
            aria-label="Open search"
            aria-controls="search-modal"
            aria-expanded={isSearchOpen}
          >
            <Icon icon={Search} size="md" className="text-gray-400" aria-hidden={true} />
          </button>
          <NavbarStats />
          <div className="desktop:flex hidden items-center space-x-2">
            {userName && (
              <span
                className={`${LANDING_TYPOGRAPHY.xs} text-gray-400 transition-colors duration-200 hover:text-[#29E7CD]`}
                title={userEmail || 'Logged in user'}
                aria-label={`Logged in as ${userName}`}
              >
                {userName}
              </span>
            )}
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
