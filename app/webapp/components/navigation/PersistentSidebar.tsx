'use client';

import { usePathname } from 'next/navigation';
import { CategorySection } from './CategorySection';
import { ExpandableCategorySection } from './ExpandableCategorySection';
import { NavItem } from './NavItem';
import { useNavigationItems } from './nav-items';
import { NewButton } from './NewButton';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  // Prevent hydration mismatch by only rendering navigation after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="tablet:w-72 desktop:w-80 fixed top-[var(--header-height-desktop)] bottom-0 left-0 z-40 w-64 border-r border-[#2a2a2a] bg-[#1f1f1f] transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* New Button - positioned at top like Google Drive */}
        <div className="tablet:p-4 desktop:p-5 border-b border-[#2a2a2a] p-3">
          <NewButton />
        </div>

        {/* Collapsible content */}
        <div className="tablet:p-4 desktop:p-5 flex-1 overflow-y-auto p-3">
          {mounted &&
            Object.entries(groupedItems).map(([category, items]) => {
              // Primary items shown directly without category header
              if (category === 'primary') {
                return (
                  <div key={category} className="mb-4 space-y-0.5">
                    {items.map(item => (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        color={item.color}
                        isActive={isActive(item.href)}
                        onTrack={trackNavigation}
                        iconSize="md"
                        showLabel={true}
                      />
                    ))}
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
                />
              );
            })}
        </div>

        {/* Settings removed from footer - now in Header Profile Popup */}
      </div>
    </aside>
  );
}
