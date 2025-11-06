'use client';
import { useTranslation } from '@/lib/useTranslation';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigationItems } from './navigation/nav-items';
import { SearchModal } from './navigation/SearchModal';
import { Sidebar } from './navigation/Sidebar';
import { NavigationHeader } from './navigation/NavigationHeader';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Logo interactions hook
  const { showTomatoToss, setShowTomatoToss, showAchievements, setShowAchievements } =
    useLogoInteractions();

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

  // Close sidebar when clicking/touching outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    // Support both mouse and touch events for mobile compatibility
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
      <NavigationHeader
        className={className}
        menuButtonRef={menuButtonRef}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onSearchClick={() => setIsSearchOpen(true)}
        isSearchOpen={isSearchOpen}
        pathname={pathname}
        navigationItems={navigationItems}
        isActive={isActive}
      />

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
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

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
