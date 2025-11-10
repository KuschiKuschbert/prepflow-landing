'use client';

import React from 'react';
import { NavItem } from './NavItem';
import type { NavigationItemConfig } from './nav-items';

interface CategorySectionProps {
  category: string;
  items: NavigationItemConfig[];
  isActive: (href: string) => boolean;
  onItemClick?: () => void;
  showLabels?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
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
}: CategorySectionProps) {
  return (
    <div className="mb-4 md:mb-6">
      {showLabels && (
        <h3 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase md:mb-3">
          {categoryLabels[category] || category}
        </h3>
      )}
      <div className="space-y-1">
        {items.map(item => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            color={item.color}
            isActive={isActive(item.href)}
            onClick={onItemClick}
            iconSize={iconSize}
            showLabel={showLabels}
          />
        ))}
      </div>
    </div>
  );
}
