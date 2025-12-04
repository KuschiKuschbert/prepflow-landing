'use client';

import { Icon } from '@/components/ui/Icon';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { prefersReducedMotion } from '@/lib/arcadeGuards';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { useNavigationItems } from './nav-items';
import { NavItem } from './NavItem';
import { NewButton } from './NewButton';

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  // Check if we're on dashboard - initialize collapsed state accordingly
  const isDashboardInitial = pathname === '/webapp';
  const [isCollapsed, setIsCollapsed] = useState(!isDashboardInitial); // Start collapsed on non-dashboard pages
  const [isHovered, setIsHovered] = useState(false);
  const [persistentCollapsedState, setPersistentCollapsedState] = useState(!isDashboardInitial); // Start collapsed on non-dashboard pages

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

  // Check if we're on dashboard
  const isDashboard = pathname === '/webapp';

  // Prevent hydration mismatch by only rendering navigation after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Determine if sidebar should appear expanded
  // Dashboard: always expanded. Other pages: expanded if not collapsed or hovered
  const isExpanded = isDashboard ? true : !isCollapsed || isHovered;

  // Load collapsed state from localStorage
  // On dashboard, always start expanded regardless of saved state
  // On other pages, always start collapsed (hover-only expansion)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // On dashboard, always start expanded
      if (isDashboard) {
        setIsCollapsed(false);
        setPersistentCollapsedState(false);
      } else {
        // On other pages, always start collapsed (hover-only)
        setIsCollapsed(true);
        // Still load saved state for toggle button, but it won't affect hover behavior
        const saved = localStorage.getItem('sidebar-collapsed');
        setPersistentCollapsedState(saved === 'true');
      }
      setHasInitialized(true);
    }
  }, [isDashboard]);

  // Update CSS variable for sidebar width based on expanded state
  // This ensures main content shifts when sidebar expands/collapses
  // Runs immediately on mount and whenever isExpanded changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      // Desktop sidebar widths match Tailwind classes:
      // Expanded: w-80 = 320px = 20rem (desktop), w-64 = 256px = 16rem (tablet), w-64 = 256px = 16rem (mobile)
      // Collapsed: w-16 = 64px = 4rem (all sizes)
      // For desktop (≥1025px), use 20rem when expanded, 4rem when collapsed
      // The CSS will handle responsive widths via media queries
      const width = isExpanded ? '20rem' : '4rem';
      root.style.setProperty('--sidebar-actual-width', width);
    }
  }, [isExpanded]);

  // Dispatch sidebar-toggle event when expanded state changes (for other components)
  // Only dispatch after initialization to avoid setState during render
  useEffect(() => {
    if (typeof window !== 'undefined' && hasInitialized && mounted) {
      window.dispatchEvent(
        new CustomEvent('sidebar-toggle', {
          detail: { collapsed: !isExpanded, expanded: isExpanded },
        }),
      );
    }
  }, [isExpanded, hasInitialized, mounted]);

  // Handle mouse enter - always expand on hover (except dashboard where it's always expanded)
  const handleMouseEnter = useCallback(() => {
    if (isDashboard) return; // Dashboard stays expanded, no hover effect needed
    setIsHovered(true);
    setIsCollapsed(false);
  }, [isDashboard]);

  // Handle mouse leave - always collapse on non-dashboard pages
  const handleMouseLeave = useCallback(() => {
    if (isDashboard) return; // Dashboard stays expanded, no collapse on leave
    setIsHovered(false);
    // Always collapse on mouse leave (hover-only expansion)
    setIsCollapsed(true);
  }, [isDashboard]);

  // Handle manual toggle (button click)
  // On dashboard, toggle doesn't do anything (always expanded)
  // On other pages, toggle persists the state
  const handleToggleCollapse = useCallback(() => {
    if (isDashboard) return; // Dashboard can't be collapsed
    const newCollapsedState = !persistentCollapsedState;
    setPersistentCollapsedState(newCollapsedState);
    setIsCollapsed(newCollapsedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newCollapsedState));
    }
  }, [persistentCollapsedState, isDashboard]);

  // Auto-expand category if it contains active item
  useEffect(() => {
    if (!mounted) return;
    const activeCategory = Object.entries(groupedItems).find(([category, items]) => {
      if (category === 'primary') return false;
      return items.some(item => isActive(item.href));
    })?.[0];
    if (activeCategory) {
      setExpandedCategory(activeCategory);
    }
  }, [pathname, mounted, groupedItems, isActive]);

  // Handle category toggle - collapse others when opening new one
  const handleCategoryToggle = (category: string) => {
    setExpandedCategory(prev => (prev === category ? null : category));
  };

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
              // Primary items shown directly without category header
              if (category === 'primary') {
                return (
                  <div key={category} className="mb-4 space-y-0.5">
                    {items.map((item, index) => {
                      const reducedMotion = prefersReducedMotion();
                      return (
                        <div
                          key={item.href}
                          style={{
                            animationName: isExpanded && !reducedMotion ? 'fadeInUp' : 'none',
                            animationDuration: isExpanded && !reducedMotion ? '0.3s' : '0s',
                            animationTimingFunction:
                              isExpanded && !reducedMotion ? 'var(--easing-standard)' : 'ease',
                            animationFillMode: isExpanded && !reducedMotion ? 'forwards' : 'none',
                            animationDelay:
                              isExpanded && !reducedMotion ? `${index * 20}ms` : '0ms',
                            opacity: isExpanded && !reducedMotion ? 0 : 1,
                          }}
                        >
                          <NavItem
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            color={item.color}
                            isActive={isActive(item.href)}
                            onTrack={trackNavigation}
                            iconSize="md"
                            showLabel={isExpanded}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              }
              // Secondary groups shown as expandable sections
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
          <div className={`border-t border-[#2a2a2a] ${isExpanded ? 'p-2' : 'p-2'}`}>
            <button
              onClick={handleToggleCollapse}
              className={`flex min-h-[44px] w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-[#2a2a2a]/50 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none ${
                isExpanded ? 'justify-start' : 'justify-center'
              }`}
              aria-label={persistentCollapsedState ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!persistentCollapsedState}
              style={{
                transitionTimingFunction: 'var(--easing-standard)',
              }}
            >
              <Icon
                icon={persistentCollapsedState ? ChevronRight : ChevronLeft}
                size="sm"
                className="text-gray-400 transition-transform duration-200"
                style={{
                  transitionTimingFunction: 'var(--easing-standard)',
                }}
                aria-hidden={true}
              />
              {isExpanded && (
                <span className="ml-2 text-xs font-medium text-gray-400">
                  {persistentCollapsedState ? 'Expand' : 'Collapse'}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
