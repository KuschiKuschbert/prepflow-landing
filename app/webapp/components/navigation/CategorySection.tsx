'use client';

import React from 'react';
import { NavItem } from './NavItem';
import type { NavigationItemConfig } from './nav-items';

interface CategorySectionProps {
  category: string;
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  onItemClick?: (href: string) => void;
  showLabels?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

const categoryLabels: Record<string, string> = {
  core: 'Core Features',
  operations: 'Operations',
  inventory: 'Inventory',
  kitchen: 'Kitchen',
  tools: 'Tools',
  other: 'Other',
};

export function CategorySection({
  category,
  items,
  isActive,
  onItemClick,
  showLabels = true,
  iconSize = 'md',
  compact = false,
}: CategorySectionProps) {
  return (
    <div className="mb-3">
      {showLabels && (
        <h3 className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
          {categoryLabels[category] || category}
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
            iconSize={iconSize}
            showLabel={showLabels}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
