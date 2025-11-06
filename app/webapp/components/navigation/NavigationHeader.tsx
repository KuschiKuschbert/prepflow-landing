'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import AutosaveGlobalIndicator from '../AutosaveGlobalIndicator';
import Link from 'next/link';
import { useRef } from 'react';
import OptimizedImage from '../../../../components/OptimizedImage';
import { LogoutButton } from '../LogoutButton';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { useLogoInteractions } from '@/hooks/useLogoInteractions';

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
}: NavigationHeaderProps) {
  const {
    handleLogoClick,
    handleLogoTouchEnd,
    handleLogoMouseDown,
    handleLogoMouseUp,
    handleLogoMouseLeave,
  } = useLogoInteractions();

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
          <button
            ref={menuButtonRef}
            onClick={onMenuClick}
            className={cn(
              'rounded-lg',
              'p-1.5',
              'min-h-[44px]',
              'min-w-[44px]',
              'transition-colors',
              'hover:bg-[#2a2a2a]/50',
            )}
            aria-label="Toggle navigation sidebar"
            aria-controls="app-sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <Link href="/webapp" className="flex items-center">
              <button
                onClick={handleLogoClick}
                onTouchEnd={handleLogoTouchEnd}
                onMouseDown={handleLogoMouseDown}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseLeave}
                className="flex min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation items-center justify-center"
                aria-label="PrepFlow Logo"
              >
                <OptimizedImage
                  src="/images/prepflow-logo.png"
                  alt="PrepFlow Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </button>
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
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <NavbarStats />
          <div className="hidden items-center space-x-2 md:flex">
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
