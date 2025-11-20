'use client';

import React from 'react';
import { NavItem } from './NavItem';
import type { NavigationItemConfig } from './nav-items';
import type { WorkflowType } from '@/lib/workflow/preferences';

interface CategorySectionProps {
  category: string;
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  onItemClick?: (href: string) => void;
  onTrack?: (href: string) => void;
  showLabels?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  workflow?: WorkflowType;
}

/**
 * Get category display label based on workflow type.
 *
 * @param {string} category - Category name
 * @param {WorkflowType} workflow - Current workflow type
 * @returns {string} Display label for the category
 */
function getCategoryLabel(category: string, workflow: WorkflowType = 'daily-operations'): string {
  const workflowLabels: Record<WorkflowType, Record<string, string>> = {
    'daily-operations': {
      'morning-prep': 'Morning Prep',
      service: 'Service',
      'end-of-day': 'End of Day',
      planning: 'Planning',
      tools: 'Tools',
      other: 'Other',
    },
    'setup-planning-operations': {
      setup: 'Setup',
      planning: 'Planning',
      operations: 'Operations',
      analysis: 'Analysis',
      tools: 'Tools',
      other: 'Other',
    },
    'menu-first': {
      menu: 'Menu',
      inventory: 'Inventory',
      operations: 'Operations',
      overview: 'Overview',
      tools: 'Tools',
      other: 'Other',
    },
  };

  // Fallback to legacy labels for backward compatibility
  const legacyLabels: Record<string, string> = {
    core: 'Core Features',
    operations: 'Operations',
    inventory: 'Inventory',
    kitchen: 'Kitchen',
    tools: 'Tools',
    other: 'Other',
  };

  return workflowLabels[workflow]?.[category] || legacyLabels[category] || category;
}

/**
 * Category section component for navigation items.
 * Groups navigation items by category with workflow-adaptive labels.
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
 * @param {WorkflowType} [props.workflow='daily-operations'] - Current workflow type
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
  workflow = 'daily-operations',
}: CategorySectionProps) {
  return (
    <div className="mb-3">
      {showLabels && (
        <h3
          className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-500 uppercase"
          suppressHydrationWarning
        >
          {getCategoryLabel(category, workflow)}
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
