'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { useNavigationItems } from './nav-items';
import { NewButton } from './NewButton';
import { useSidebarState } from './PersistentSidebar/hooks/useSidebarState';
import { useCategoryExpansion } from './PersistentSidebar/hooks/useCategoryExpansion';
import { PrimaryItemsSection } from './PersistentSidebar/components/PrimaryItemsSection';
import { SidebarCollapseButton } from './PersistentSidebar/components/SidebarCollapseButton';

/**
 * Persistent sidebar component for desktop navigation.
 * Displays navigation items grouped by category with collapsible sections.
 * Only visible on desktop (≥1025px).
 *
 * @component
 * @returns {JSX.Element} Persistent sidebar
 */
export default function PersistentSidebar() {
  const pathname = usePathname();
  const { trackNavigation } = useNavigationTracking();
  const [mounted, setMounted] = useState(false);
  const allItems = useNavigationItems();

  // Group items by category
  const groupedItems = useMemo(
    () =>
      allItems.reduce(
        (acc, item) => {
          const category = item.category || 'other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, typeof allItems>,
      ),
    [allItems],
  );

  const isActive = useCallback(
    (href: string) => {
      if (href === '/webapp') return pathname === '/webapp';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sidebar state management
  const {
    isExpanded,
    isDashboard,
    persistentCollapsedState,
    handleMouseEnter,
    handleMouseLeave,
    handleToggleCollapse,
  } = useSidebarState();

  // Category expansion management
  const { expandedCategory, handleCategoryToggle } = useCategoryExpansion(
    groupedItems,
    isActive,
    mounted,
  );

  return (
    <aside
      className={`fixed top-[var(--header-height-desktop)] bottom-0 left-0 z-40 border-r border-[#2a2a2a] bg-[#1f1f1f] transition-all duration-300 ${
        isExpanded
          ? 'tablet:w-72 desktop:w-80 desktop:rounded-r-3xl desktop:bg-gradient-to-r desktop:from-[#29E7CD]/20 desktop:via-[#D925C7]/20 desktop:to-[#29E7CD]/20 desktop:p-[1px] w-64'
          : 'desktop:w-16 w-16'
      }`}
      style={{
        transitionTimingFunction: 'var(--easing-standard)',
      }}
      role="navigation"
      aria-label="Main navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="desktop:rounded-r-3xl desktop:bg-[#1f1f1f] flex h-full flex-col overflow-hidden">
        {/* New Button */}
        <div
          className={`flex items-center border-b border-[#2a2a2a] ${isExpanded ? 'tablet:p-2 desktop:p-3 justify-start p-2' : 'justify-center p-2'}`}
        >
          <NewButton isCollapsed={!isExpanded} />
        </div>

        {/* Collapsible content */}
        <div
          className={`flex-1 overflow-y-auto ${isExpanded ? 'tablet:p-4 desktop:p-5 p-3' : 'tablet:px-4 desktop:px-5 tablet:py-2 desktop:py-2 px-3 py-2'}`}
        >
          {mounted &&
            Object.entries(groupedItems).map(([category, items]) => {
              if (category === 'primary') {
                return (
                  <PrimaryItemsSection
                    key={category}
                    items={items}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    onTrack={trackNavigation}
                  />
                );
              }
              return (
                <ExpandableCategorySection
                  key={category}
                  category={category}
                  items={items}
                  isActive={isActive}
                  onTrack={trackNavigation}
                  isExpanded={expandedCategory === category}
                  onToggle={handleCategoryToggle}
                  isCollapsed={!isExpanded}
                />
              );
            })}
        </div>

        {/* Collapse/Expand Button - Hidden on dashboard (always expanded) */}
        {!isDashboard && (
          <SidebarCollapseButton
            isExpanded={isExpanded}
            persistentCollapsedState={persistentCollapsedState}
            onToggle={handleToggleCollapse}
          />
        )}
      </div>
    </aside>
  );
}
