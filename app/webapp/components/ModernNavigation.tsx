'use client';
import { AchievementsDropdown } from '@/components/Arcade/AchievementsDropdown';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { useCatchTheDocketTrigger } from '@/hooks/useCatchTheDocketTrigger';
import { useLogoInteractions } from '@/hooks/useLogoInteractions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { isArcadeDisabled, isTouchDevice, prefersReducedMotion } from '@/lib/arcadeGuards';
import { useTranslation } from '@/lib/useTranslation';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import TomatoToss from '../../../components/EasterEggs/TomatoToss';
import { BottomNavBar } from './navigation/BottomNavBar';
import { MobileNavigationDrawer } from './navigation/MobileNavigationDrawer';
import { useNavigationItems } from './navigation/nav-items';
import { NavigationHeader } from './navigation/NavigationHeader';
import PersistentSidebar from './navigation/PersistentSidebar';
import { SearchModal } from './navigation/SearchModal';
import { MobileFAB } from './navigation/MobileFAB';
import { NavigationErrorBoundary } from './navigation/NavigationErrorBoundary';

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

/**
 * Main navigation orchestrator component for PrepFlow webapp.
 * Manages all navigation components (header, sidebar, bottom nav, FAB, drawers, search).
 * Handles keyboard shortcuts (⌘K for search, ⌘B for sidebar toggle).
 * Includes error boundary and Easter egg interactions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Modern navigation component
 */
const ModernNavigation = memo(function ModernNavigation({ className = '' }: ModernNavigationProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

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
    // Handle hash URLs (e.g., /webapp/recipes#ingredients)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (pathname === path) {
        if (typeof window !== 'undefined') {
          return window.location.hash === `#${hash}`;
        }
        return false;
      }
      return pathname.startsWith(path);
    }
    return pathname.startsWith(href);
  };

  // Memoized callbacks for navigation components
  const handleMenuClick = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);


  return (
    <NavigationErrorBoundary>
      <NavigationHeader
        className={className}
        onSearchClick={handleSearchClick}
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
        userButtonRef={userButtonRef}
      />

      {/* Desktop: Persistent Sidebar - CSS handles visibility */}
      <div className="desktop:block hidden">
        <PersistentSidebar />
      </div>

      {/* Mobile: Bottom Navigation Bar - CSS handles visibility */}
      <div className="desktop:hidden block">
        <BottomNavBar onMenuClick={handleMenuClick} menuButtonRef={menuButtonRef} />
      </div>

      {/* Mobile: Floating Action Button - CSS handles visibility */}
      <div className="desktop:hidden block">
        <MobileFAB onSearchClick={handleSearchClick} />
      </div>

      {/* Mobile: Navigation Drawer - CSS handles visibility */}
      <div className="desktop:hidden block">
        <MobileNavigationDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          menuButtonRef={menuButtonRef}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        query={searchQuery}
        onChange={setSearchQuery}
        onClose={handleSearchClose}
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
    </NavigationErrorBoundary>
  );
});

export default ModernNavigation;
