'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AutosaveGlobalIndicator from './AutosaveGlobalIndicator';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import OptimizedImage from '../../../components/OptimizedImage';
import { LogoutButton } from './LogoutButton';
import { useNavigationItems } from './navigation/nav-items';
import { SearchModal } from './navigation/SearchModal';
import { Sidebar } from './navigation/Sidebar';
import TomatoToss from '../../../components/EasterEggs/TomatoToss';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { AchievementsDropdown } from '@/components/Arcade/AchievementsDropdown';
import { useLogoInteractions } from '@/hooks/useLogoInteractions';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { useCatchTheDocketTrigger } from '@/hooks/useCatchTheDocketTrigger';

// Utility function to ensure consistent class ordering
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
}

interface ModernNavigationProps {
  className?: string;
}

const ModernNavigation = memo(function ModernNavigation({ className = '' }: ModernNavigationProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Logo interactions hook
  const {
    showTomatoToss,
    setShowTomatoToss,
    showAchievements,
    setShowAchievements,
    handleLogoClick,
    handleLogoMouseDown,
    handleLogoMouseUp,
    handleLogoMouseLeave,
  } = useLogoInteractions();

  // CatchTheDocket trigger hook
  const { showDocketOverlay, setShowDocketOverlay } = useCatchTheDocketTrigger();

  // Navigation items organized by category
  const navigationItems: NavigationItem[] = useNavigationItems() as NavigationItem[];

  // Filter items based on search query
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, NavigationItem[]>,
  );

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus management: when closing sidebar, move focus back to menu button
  useEffect(() => {
    if (!isSidebarOpen) {
      const active = document.activeElement as HTMLElement | null;
      if (active && sidebarRef.current && sidebarRef.current.contains(active)) {
        menuButtonRef.current?.focus();
      }
    }
  }, [isSidebarOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'b':
            event.preventDefault();
            setIsSidebarOpen(!isSidebarOpen);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Compact Header */}
      <header
        role="banner"
        className={cn('border-b', 'border-[#2a2a2a]', 'bg-[#1f1f1f]', className)}
      >
        <div className="flex items-center justify-between px-3 py-2 md:px-4">
          {/* Left: Logo + Menu Button */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              ref={menuButtonRef}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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

            <Link href="/webapp" className="flex items-center space-x-2">
              <button
                onClick={handleLogoClick}
                onMouseDown={handleLogoMouseDown}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseLeave}
                className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center"
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
              <span className="hidden text-lg font-semibold text-white md:inline">PrepFlow</span>
              <AutosaveGlobalIndicator />
            </Link>
          </div>

          {/* Center: Breadcrumb */}
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

          {/* Right: Search, Stats, Language, User */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
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

            {/* Navbar Stats - compact on mobile */}
            <NavbarStats />

            {/* Language and Logout - hidden on mobile (available in sidebar) */}
            <div className="hidden items-center space-x-2 md:flex">
              <LanguageSwitcher />
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        sidebarRef={sidebarRef}
        grouped={groupedItems}
        isActive={isActive}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        query={searchQuery}
        onChange={setSearchQuery}
        onClose={() => setIsSearchOpen(false)}
        filtered={filteredItems}
      />

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Tomato Toss Easter Egg */}
      {showTomatoToss && <TomatoToss onClose={() => setShowTomatoToss(false)} />}

      {/* Achievements Dropdown */}
      <AchievementsDropdown isOpen={showAchievements} onClose={() => setShowAchievements(false)} />

      {/* Global CatchTheDocket overlay */}
      {showDocketOverlay && (
        <CatchTheDocket isLoading={true} onLoadComplete={() => setShowDocketOverlay(false)} />
      )}
    </>
  );
});

export default ModernNavigation;
