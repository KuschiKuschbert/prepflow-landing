'use client';
import { AchievementsDropdown } from '@/components/Arcade/AchievementsDropdown';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { useCatchTheDocketTrigger } from '@/hooks/useCatchTheDocketTrigger';
import { useLogoInteractions } from '@/hooks/useLogoInteractions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { isArcadeDisabled, isTouchDevice, prefersReducedMotion } from '@/lib/arcadeGuards';
import { useTranslation } from '@/lib/useTranslation';
import { usePathname } from 'next/navigation';
import { memo, useRef, useState } from 'react';
import TomatoToss from '../../../components/EasterEggs/TomatoToss';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNavigationActive } from './hooks/useNavigationActive';
import { BottomNavBar } from './navigation/BottomNavBar';
import { MobileFAB } from './navigation/MobileFAB';
import { MoreDrawer } from './navigation/MoreDrawer';
import { useNavigationItems } from './navigation/nav-items';
import { NavigationHeader } from './navigation/NavigationHeader';
import PersistentSidebar from './navigation/PersistentSidebar';
import { SearchModal } from './navigation/SearchModal';

// Utility function to ensure consistent class ordering
const _cn = (...classes: (string | undefined | null | false)[]): string => {
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
  const { t: _t } = useTranslation();
  const pathname = usePathname();
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const _menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Detect if we're on desktop (768px+) - only used for keyboard shortcuts, not layout
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Logo interactions hook
  const {
    showTomatoToss,
    setShowTomatoToss,
    showAchievements,
    setShowAchievements,
    handleLogoClick,
    handleLogoTouchStart,
    handleLogoTouchEnd,
    handleLogoMouseDown,
    handleLogoMouseUp,
    handleLogoMouseLeave,
    shouldPreventNavigation,
  } = useLogoInteractions();

  // CatchTheDocket trigger hook
  const { showDocketOverlay, setShowDocketOverlay } = useCatchTheDocketTrigger();

  // Navigation items organized by category
  const navigationItems: NavigationItem[] = useNavigationItems() as NavigationItem[];

  // Filter items based on search query
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Keyboard shortcuts
  useKeyboardShortcuts(isDesktop, () => setIsSearchOpen(true));

  // Active state logic
  const isActive = useNavigationActive(pathname);

  return (
    <>
      <NavigationHeader
        className={className}
        onSearchClick={() => setIsSearchOpen(true)}
        isSearchOpen={isSearchOpen}
        pathname={pathname}
        navigationItems={navigationItems}
        isActive={isActive}
        handleLogoClick={handleLogoClick}
        handleLogoTouchStart={handleLogoTouchStart}
        handleLogoTouchEnd={handleLogoTouchEnd}
        handleLogoMouseDown={handleLogoMouseDown}
        handleLogoMouseUp={handleLogoMouseUp}
        handleLogoMouseLeave={handleLogoMouseLeave}
        shouldPreventNavigation={shouldPreventNavigation}
        onAchievementsClick={() => setShowAchievements(true)}
      />

      {/* Desktop: Persistent Sidebar - CSS handles visibility */}
      <div className="desktop:block hidden">
        <PersistentSidebar />
      </div>

      {/* Mobile: Bottom Navigation Bar - CSS handles visibility */}
      <div className="desktop:hidden block">
        <BottomNavBar
          onMenuClick={() => setIsMoreDrawerOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
        />
      </div>

      {/* Mobile: Floating Action Button - CSS handles visibility */}
      <div className="desktop:hidden block">
        <MobileFAB />
      </div>

      {/* Mobile: More Drawer - CSS handles visibility */}
      <div className="desktop:hidden block">
        <MoreDrawer
          isOpen={isMoreDrawerOpen}
          onClose={() => setIsMoreDrawerOpen(false)}
          onOpen={() => setIsMoreDrawerOpen(true)}
          onSearchClick={() => {
            setIsMoreDrawerOpen(false);
            setIsSearchOpen(true);
          }}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        query={searchQuery}
        onChange={setSearchQuery}
        onClose={() => setIsSearchOpen(false)}
        filtered={filteredItems}
      />

      {/* Tomato Toss Easter Egg */}
      {showTomatoToss && <TomatoToss onClose={() => setShowTomatoToss(false)} />}

      {/* Achievements Dropdown */}
      <AchievementsDropdown isOpen={showAchievements} onClose={() => setShowAchievements(false)} />

      {/* Global CatchTheDocket overlay */}
      {showDocketOverlay && !prefersReducedMotion() && !isArcadeDisabled() && !isTouchDevice() && (
        <CatchTheDocket isLoading={true} onLoadComplete={() => setShowDocketOverlay(false)} />
      )}
    </>
  );
});

export default ModernNavigation;
