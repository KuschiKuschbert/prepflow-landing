'use client';

import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { getUserFirstName } from '@/lib/user-name';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { useNavigationItems } from './nav-items';
import { NewButton } from './NewButton';
import { PrimaryItemsSection } from './PersistentSidebar/components/PrimaryItemsSection';
import { SidebarCollapseButton } from './PersistentSidebar/components/SidebarCollapseButton';
import { useCategoryExpansion } from './PersistentSidebar/hooks/useCategoryExpansion';
import { useSidebarState } from './PersistentSidebar/hooks/useSidebarState';

const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

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
  const { user } = useUser();
  const displayName = getUserFirstName({ name: user?.name, email: user?.email });
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
      className={`fixed top-[var(--header-height-desktop)] bottom-0 left-0 z-40 transition-all duration-300 ${
        isExpanded
          ? 'tablet:w-72 desktop:w-80 desktop:rounded-r-3xl desktop:bg-gradient-to-r desktop:from-[var(--primary)]/10 desktop:via-[var(--accent)]/10 desktop:to-[var(--primary)]/10 desktop:p-[1px] w-64'
          : 'desktop:w-20 w-16'
      }`}
      style={{
        transitionTimingFunction: 'var(--easing-emphasized)',
      }}
      role="navigation"
      aria-label="Main navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="desktop:rounded-r-3xl glass-panel flex h-full flex-col overflow-hidden">
        {/* New Button */}
        <div
          className={`flex items-center border-b border-[var(--border)]/30 ${isExpanded ? 'tablet:p-4 desktop:p-5 justify-start p-3' : 'justify-center p-3'}`}
        >
          <NewButton isCollapsed={!isExpanded} />
        </div>

        {/* Collapsible content */}
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar ${isExpanded ? 'tablet:p-4 desktop:p-5 p-3' : 'p-2'}`}
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

        {/* User Info / Settings Section (Bottom) */}
        <div className="mt-auto border-t border-[var(--border)]/30 p-4">
          <div className={cn(
            "flex items-center gap-3 rounded-2xl p-2 transition-all duration-300",
            isExpanded ? "hover:bg-[var(--surface-variant)]" : "justify-center"
          )}>
            <div className="relative">
              {mounted && (
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[var(--primary)]/30">
                  {/* Reuse avatar logic or show initials */}
                  <div className="flex h-full w-full items-center justify-center bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)] text-center">
                    {displayName ? displayName[0].toUpperCase() : '?'}
                  </div>
                </div>
              )}
            </div>
            {isExpanded && mounted && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate text-[var(--foreground)]">{displayName || 'Chef'}</span>
                <span className="text-xs text-[var(--foreground-muted)] truncate">{user?.email || 'Kitchen'}</span>
              </div>
            )}
          </div>
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
