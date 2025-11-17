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
        <h3 className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
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
