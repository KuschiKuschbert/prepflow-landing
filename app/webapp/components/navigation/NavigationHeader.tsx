'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import AutosaveGlobalIndicator from '../AutosaveGlobalIndicator';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { LogoutButton } from '../LogoutButton';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { useSession } from 'next-auth/react';
import { Search, Settings2, User } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { prefetchRoute } from '@/lib/cache/prefetch-config';

interface NavigationHeaderProps {
  className?: string;
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
  // New prop for Settings Drawer (Mobile)
  onUserClick: () => void;
  // Ref for user button (for bubble animation positioning)
  userButtonRef?: React.RefObject<HTMLButtonElement | null>;
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
 * @returns {JSX.Element} Navigation header
 */
export function NavigationHeader({
  className = '',
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
  onUserClick,
  userButtonRef,
}: NavigationHeaderProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

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

  // Close desktop user menu when clicking outside
  useEffect(() => {
    if (!isDesktopUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Open user settings"]')
      ) {
        setIsDesktopUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDesktopUserMenuOpen]);

  const handleUserAvatarClick = () => {
    if (isDesktop) {
      setIsDesktopUserMenuOpen(!isDesktopUserMenuOpen);
    } else {
      onUserClick(); // Trigger Mobile Drawer
    }
  };

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
        <div className="desktop:space-x-3 relative flex items-center space-x-2">
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

          {/* User Avatar Trigger (Handles both Mobile Drawer & Desktop Popover) */}
          {/* Always show on mobile, only show on desktop if userName exists */}
          {(userName || !isDesktop) && (
            <>
              <button
                ref={userButtonRef}
                onClick={handleUserAvatarClick}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD] to-[#29E7CD]/50 text-xs font-bold text-black shadow-md transition-transform hover:scale-105 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
                aria-label="Open user settings"
                aria-expanded={isDesktopUserMenuOpen}
              >
                {userName ? (
                  userName[0].toUpperCase()
                ) : (
                  <Icon icon={User} size="sm" className="text-black" aria-hidden={true} />
                )}
              </button>

              {/* Desktop "Google Drive Style" Floating Bubble */}
              {isDesktop && isDesktopUserMenuOpen && (
                <div
                  ref={desktopMenuRef}
                  className="animate-scale-in absolute top-full right-0 z-50 mt-3 w-[350px] origin-top-right rounded-[28px] border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-2xl"
                >
                  {/* Header: Centered Profile */}
                  <div className="flex flex-col items-center space-y-2 pb-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD] to-[#29E7CD]/50 text-xl font-bold text-black shadow-inner">
                        {userName ? (
                          userName[0].toUpperCase()
                        ) : (
                          <Icon icon={User} size="sm" className="text-black" aria-hidden={true} />
                        )}
                      </div>
                      {/* Camera icon overlay (optional) */}
                      <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#1f1f1f] bg-[#2a2a2a] text-white">
                        <div className="h-2 w-2 rounded-full bg-[#29E7CD]" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-white">
                        Hi, {userName || 'User'}!
                      </div>
                      <div className="text-sm text-gray-400">{userEmail}</div>
                    </div>

                    <Link
                      href="/webapp/settings"
                      onClick={() => setIsDesktopUserMenuOpen(false)}
                      className="mt-2 inline-flex items-center justify-center rounded-full border border-gray-600 px-6 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#2a2a2a]"
                    >
                      Manage your Account
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-[#2a2a2a]" />

                  {/* List Options */}
                  <div className="space-y-1">
                    <Link
                      href="/webapp/settings"
                      onClick={() => setIsDesktopUserMenuOpen(false)}
                      onMouseEnter={() => prefetchRoute('/webapp/settings')}
                      className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                    >
                      <Icon icon={Settings2} size="sm" className="text-gray-400" />
                      <span>Settings</span>
                    </Link>

                    <div className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white">
                      <div className="flex items-center space-x-3">
                        <span className="flex h-4 w-4 items-center justify-center">🌐</span>
                        <span>Language</span>
                      </div>
                      <div className="ml-auto">
                        <LanguageSwitcher />
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center pt-2">
                      <div className="w-full">
                        <LogoutButton />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex justify-center text-[10px] text-gray-500">
                    <Link href="/privacy" className="mx-2 hover:text-gray-300">
                      Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="mx-2 hover:text-gray-300">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
