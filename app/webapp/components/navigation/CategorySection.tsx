'use client';

import { NavItem } from './NavItem';
import type { NavigationItemConfig } from './nav-items';

interface CategorySectionProps {
  category: string;
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  onItemClick?: (href: string) => void;
  onTrack?: (href: string) => void;
  showLabels?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

/**
 * Get category display label.
 *
 * @param {string} category - Category name
 * @returns {string} Display label for the category
 */
export function getCategoryLabel(category: string): string {
  // Unified category labels (same across all workflows)
  const categoryLabels: Record<string, string> = {
    primary: 'Primary',
    kitchen: 'Kitchen',
    team: 'Team',
    inventory: 'Inventory',
    tools: 'Tools',
    other: 'Other',
  };

  // Fallback to legacy labels for backward compatibility
  const legacyLabels: Record<string, string> = {
    core: 'Core Features',
    operations: 'Operations',
    'morning-prep': 'Morning Prep',
    service: 'Service',
    'end-of-day': 'End of Day',
    planning: 'Planning',
    tools: 'Tools',
    setup: 'Setup',
    analysis: 'Analysis',
    menu: 'Menu',
    overview: 'Overview',
  };

  return categoryLabels[category] || legacyLabels[category] || category;
}

/**
 * Category section component for navigation items.
 * Groups navigation items by category.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.category - Category name
 * @param {Array} props.items - Navigation items in this category
 * @param {Function} props.isActive - Function to check if href is active
 * @param {Function} [props.onItemClick] - Optional click handler
 * @param {Function} [props.onTrack] - Optional tracking callback
 * @param {boolean} [props.showLabels=true] - Whether to show item labels
 * @param {'sm' | 'md' | 'lg'} [props.iconSize='md'] - Icon size
 * @param {boolean} [props.compact=false] - Whether to use compact mode
 * @returns {JSX.Element} Category section
 */
export function CategorySection({
  category,
  items,
  isActive,
  onItemClick,
  onTrack,
  showLabels = true,
  iconSize = 'md',
  compact = false,
}: CategorySectionProps) {
  return (
    <div className="mb-3">
      {showLabels && (
        <h3
          className="mb-1.5 text-[10px] font-semibold tracking-wider text-[var(--foreground)]/40 uppercase"
          suppressHydrationWarning
        >
          {getCategoryLabel(category)}
        </h3>
      )}
      <div className="space-y-0.5">
        {items.map(item => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            color={item.color}
            isActive={isActive(item.href)}
            onClick={onItemClick ? () => onItemClick(item.href) : undefined}
            onTrack={onTrack}
            iconSize={iconSize}
            showLabel={showLabels}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
