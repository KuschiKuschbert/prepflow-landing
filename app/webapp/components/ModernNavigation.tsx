'use client';
import { useTranslation } from '@/lib/useTranslation';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigationItems } from './navigation/nav-items';
import { SearchModal } from './navigation/SearchModal';
import { NavigationHeader } from './navigation/NavigationHeader';
import { BottomNavBar } from './navigation/BottomNavBar';
import { MoreDrawer } from './navigation/MoreDrawer';
import { PersistentSidebar } from './navigation/PersistentSidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TomatoToss from '../../../components/EasterEggs/TomatoToss';
import { AchievementsDropdown } from '@/components/Arcade/AchievementsDropdown';
import { useLogoInteractions } from '@/hooks/useLogoInteractions';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { useCatchTheDocketTrigger } from '@/hooks/useCatchTheDocketTrigger';
import { prefersReducedMotion, isArcadeDisabled, isTouchDevice } from '@/lib/arcadeGuards';

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
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Detect if we're on desktop (768px+)
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'b':
            // Toggle sidebar collapse on desktop (if we add that feature)
            // For now, just prevent default
            if (isDesktop) {
              event.preventDefault();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDesktop]);

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  return (
    <>
      <NavigationHeader
        className={className}
        menuButtonRef={menuButtonRef}
        onMenuClick={() => {}} // No burger menu anymore
        isSidebarOpen={false}
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
      />

      {/* Desktop: Persistent Sidebar */}
      {isDesktop && <PersistentSidebar />}

      {/* Mobile: Bottom Navigation Bar */}
      {!isDesktop && <BottomNavBar onMoreClick={() => setIsMoreDrawerOpen(true)} />}

      {/* Mobile: More Drawer */}
      {!isDesktop && (
        <MoreDrawer
          isOpen={isMoreDrawerOpen}
          onClose={() => setIsMoreDrawerOpen(false)}
          onSearchClick={() => {
            setIsMoreDrawerOpen(false);
            setIsSearchOpen(true);
          }}
        />
      )}

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
