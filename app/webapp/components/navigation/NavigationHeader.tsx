'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import AutosaveGlobalIndicator from '../AutosaveGlobalIndicator';
import Link from 'next/link';
import { useRef } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { LogoutButton } from '../LogoutButton';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { useSession } from 'next-auth/react';
import { Search } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
  shouldPreventNavigation: React.RefObject<boolean>;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

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
        'md:h-[var(--header-height-desktop)]',
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 md:px-4">
        <div className="flex items-center space-x-2 md:space-x-3">
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
                src="/images/prepflow-logo.svg"
                alt="PrepFlow Logo"
                width={24}
                height={24}
                className="flex h-6 min-h-[44px] w-6 min-w-[44px] cursor-pointer touch-manipulation items-center justify-center"
                onClick={handleLogoClick}
                onTouchStart={handleLogoTouchStart}
                onTouchEnd={handleLogoTouchEnd}
                onMouseDown={handleLogoMouseDown}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseLeave}
              />
            </Link>
            <Link href="/webapp" className="hidden md:inline">
              <span className="text-lg font-semibold text-white">PrepFlow</span>
            </Link>
            <AutosaveGlobalIndicator />
          </div>
        </div>
        <div
          className={cn(
            'hidden',
            'items-center',
            'space-x-2',
            'text-sm',
            'text-gray-400',
            'md:flex',
          )}
        >
          <Link href="/webapp" className={cn('transition-colors', 'hover:text-[#29E7CD]')}>
            Dashboard
          </Link>
          {pathname !== '/webapp' && (
            <>
              <span>/</span>
              <span className="text-[#29E7CD]">
                {navigationItems.find(item => isActive(item.href))?.label || 'Page'}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button
            onClick={onSearchClick}
            className={cn(
              'rounded-lg',
              'p-1.5',
              'min-h-[44px]',
              'min-w-[44px]',
              'transition-colors',
              'hover:bg-[#2a2a2a]/50',
            )}
            aria-label="Open search"
            aria-controls="search-modal"
            aria-expanded={isSearchOpen}
          >
            <Icon icon={Search} size="md" className="text-gray-400" aria-hidden={true} />
          </button>
          <NavbarStats />
          <div className="hidden items-center space-x-2 md:flex">
            {userName && (
              <span
                className="text-xs text-gray-400"
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
