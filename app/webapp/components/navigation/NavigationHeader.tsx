'use client';

import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { BrandMark } from '@/components/BrandMark';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import { LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { getAvatarUrl, getDefaultAvatar } from '@/lib/user-avatar';
import { Search, Settings, Settings2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AutosaveGlobalIndicator from '../AutosaveGlobalIndicator';
import { LogoutButton } from '../LogoutButton';

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
  // Ref for user button (for popover positioning)
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
  userButtonRef,
}: NavigationHeaderProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];
  const { avatar: userAvatar } = useUserAvatar();
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const internalUserButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(
    null,
  );

  // Use provided ref or internal ref
  const buttonRef = userButtonRef || internalUserButtonRef;

  // Get avatar URL or default initials
  const avatarUrl = getAvatarUrl(userAvatar);
  const defaultInitials = getDefaultAvatar(userName || userEmail || '');

  // Auto-hide header on mobile/tablet when scrolling down (not desktop)
  // Uses custom breakpoint: desktop = 1025px+ (from tailwind.config.ts)
  const { direction, isAtTop } = useScrollDirection();
  const isDesktop = useMediaQuery('(min-width: 1025px)'); // Match custom desktop breakpoint
  const [isVisible, setIsVisible] = useState(true);
  const [seasonalEffect, setSeasonalEffect] = useState<string | null>(null);

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

  // Check for seasonal effects
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSeasonal = () => {
      const seasonal = document.documentElement.getAttribute('data-seasonal');
      setSeasonalEffect(seasonal);
    };

    checkSeasonal();

    // Listen for changes to data-seasonal attribute
    const observer = new MutationObserver(() => {
      checkSeasonal();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-seasonal'],
    });

    return () => observer.disconnect();
  }, []);

  // Banner text mapping
  const getBannerText = (effect: string | null): string | null => {
    if (!effect) return null;
    const banners: Record<string, string> = {
      lightsaber: 'May the 4th be with you',
      toque: "Happy Chef's Day! 👨‍🍳",
      santaHat: 'Merry Chaosmas, Chef! 🎅',
      newYear: 'Happy New Year! 🎉',
      australiaDay: 'Happy Australia Day! 🇦🇺',
      valentines: "Happy Valentine's Day! 💝",
      anzac: 'Lest We Forget 🇦🇺🇳🇿',
      easter: 'Happy Easter! 🐰',
      independenceDay: 'Happy 4th of July! 🇺🇸',
      halloween: 'Happy Halloween! 🎃',
      boxingDay: 'Happy Boxing Day! 🎁',
      newYearsEve: "Happy New Year's Eve! 🥳",
      mothersDay: "Happy Mother's Day! 💐",
      fathersDay: "Happy Father's Day! 👔",
      labourDay: 'Happy Labour Day! 🛠️',
      royalBirthday: "Happy [King's/Queen's] Birthday! 👑",
    };
    return banners[effect] || null;
  };

  // Banner color mapping
  const getBannerColor = (effect: string | null): string => {
    if (!effect) return '#FFE81F';
    const colors: Record<string, string> = {
      lightsaber: '#FFE81F',
      toque: '#FFD700',
      santaHat: '#DC2626',
      newYear: '#FFD700',
      australiaDay: '#006633',
      valentines: '#FF1493',
      anzac: '#8B0000',
      easter: '#FFB6C1',
      independenceDay: '#DC2626',
      halloween: '#FF8C00',
      boxingDay: '#FFD700',
      newYearsEve: '#FFD700',
      mothersDay: '#FF1493',
      fathersDay: '#00308F',
      labourDay: '#FF8C00',
      royalBirthday: '#8A2BE2',
    };
    return colors[effect] || '#FFE81F';
  };

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (!isDesktopUserMenuOpen || !buttonRef?.current) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef?.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + 12, // mt-3 = 12px
        right: window.innerWidth - buttonRect.right,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isDesktopUserMenuOpen, buttonRef]);

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
    setIsDesktopUserMenuOpen(!isDesktopUserMenuOpen);
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
        !isDesktop && 'transition-transform duration-300',
        className,
      )}
      style={{
        // Only apply transform on mobile/tablet (< 1025px)
        transform: !isDesktop && !isVisible ? 'translateY(-100%)' : 'translateY(0)',
        transitionTimingFunction: !isDesktop ? 'var(--easing-standard)' : undefined,
      }}
    >
      <div className="desktop:px-4 relative flex items-center justify-between px-3 py-2">
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
            {/* Seasonal Banner - Next to autosave indicator */}
            {seasonalEffect && isDesktop && getBannerText(seasonalEffect) && (
              <div className="pf-seasonal-banner pointer-events-none ml-2">
                <span
                  className="pf-seasonal-text desktop:text-sm text-xs font-bold tracking-wider uppercase"
                  style={{ color: getBannerColor(seasonalEffect) }}
                >
                  {getBannerText(seasonalEffect)}
                </span>
              </div>
            )}
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
            <div className="relative">
              <div
                className={cn(
                  'rounded-full transition-all duration-200',
                  isDesktopUserMenuOpen &&
                    'bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px]',
                )}
              >
                <button
                  ref={buttonRef}
                  onClick={handleUserAvatarClick}
                  className="relative flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF6B00]/50 text-xs font-bold text-black shadow-md transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
                  style={{
                    transitionTimingFunction: 'var(--easing-standard)',
                  }}
                  aria-label="Open user settings"
                  aria-expanded={isDesktopUserMenuOpen}
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={userName || 'User avatar'}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{defaultInitials}</span>
                  )}
                </button>
              </div>

              {/* User Menu Popover - Works on both mobile and desktop */}
              {isDesktopUserMenuOpen && dropdownPosition && (
                <div
                  ref={desktopMenuRef}
                  className="fixed z-[70] w-[350px] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl"
                  style={{
                    animation: 'scale-in-bubble 0.25s var(--easing-emphasized) forwards',
                    top: `${dropdownPosition.top}px`,
                    right: `${dropdownPosition.right}px`,
                  }}
                >
                  <div className="rounded-xl bg-[#1f1f1f]/95 p-4">
                    {/* Header: Centered Profile */}
                    <div className="flex flex-col items-center space-y-2 pb-4">
                      <div className="relative">
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF6B00]/50 text-xl font-bold text-black shadow-inner">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={userName || 'User avatar'}
                              fill
                              sizes="64px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : userName ? (
                            userName[0].toUpperCase()
                          ) : (
                            <Icon icon={User} size="sm" className="text-black" aria-hidden={true} />
                          )}
                        </div>
                        {/* Camera icon overlay (optional) */}
                        <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#1f1f1f] bg-[#2a2a2a] text-white">
                          <div className="h-2 w-2 rounded-full bg-[#FF6B00]" />
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
                        className="mt-2 inline-flex items-center justify-center rounded-full border border-gray-600 px-6 py-2 text-sm font-medium text-[#FF6B00] transition-colors hover:bg-[#2a2a2a]"
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

                      <Link
                        href="/webapp/setup"
                        onClick={() => setIsDesktopUserMenuOpen(false)}
                        onMouseEnter={() => prefetchRoute('/webapp/setup')}
                        className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                      >
                        <Icon icon={Settings} size="sm" className="text-gray-400" />
                        <span>Setup</span>
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
