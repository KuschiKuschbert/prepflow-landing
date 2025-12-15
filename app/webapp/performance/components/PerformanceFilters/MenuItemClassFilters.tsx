/**
 * Menu item class filter chips.
 */
'use client';

import { PerformanceFilters as PerformanceFiltersType } from '../../types';
import { PerformanceItem } from '../../types';

const MENU_ITEM_CLASSES = ["Chef's Kiss", 'Hidden Gem', 'Bargain Bucket', 'Burnt Toast'] as const;

interface MenuItemClassFiltersProps {
  filters: PerformanceFiltersType;
  performanceItems: PerformanceItem[];
  onFilterChange: (key: keyof PerformanceFiltersType, value: any) => void;
}

export function MenuItemClassFilters({ filters, performanceItems, onFilterChange }: MenuItemClassFiltersProps) {
  const handleMenuItemClassToggle = (className: string) => {
    const currentClasses = filters.menuItemClass || [];
    const newClasses = currentClasses.includes(className) ? currentClasses.filter(c => c !== className) : [...currentClasses, className];
    onFilterChange('menuItemClass', newClasses);
  };

  const classCounts = MENU_ITEM_CLASSES.reduce((acc, className) => {
    acc[className] = performanceItems.filter(item => item.menu_item_class === className).length;
    return acc;
  }, {} as Record<string, number>);

  const hasActiveFilters = (filters.menuItemClass?.length || 0) > 0 || filters.searchTerm.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {MENU_ITEM_CLASSES.map(className => {
        const isActive = filters.menuItemClass?.includes(className) || false;
        const count = classCounts[className];
        const shortLabel = className === "Chef's Kiss" ? 'Kiss' : className === 'Hidden Gem' ? 'Gem' : className === 'Bargain Bucket' ? 'Bargain' : 'Toast';
        return (
          <button
            key={className}
            onClick={() => handleMenuItemClassToggle(className)}
            className={`rounded-full px-1.5 py-0.5 text-xs font-medium transition-all ${
              isActive
                ? className === "Chef's Kiss"
                  ? 'border-2 border-green-500 bg-green-500/20 text-green-400'
                  : className === 'Hidden Gem'
                    ? 'border-2 border-blue-500 bg-blue-500/20 text-blue-400'
                    : className === 'Bargain Bucket'
                      ? 'border-2 border-yellow-500 bg-yellow-500/20 text-yellow-400'
                      : 'border-2 border-red-500 bg-red-500/20 text-red-400'
                : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-[#29E7CD]'
            }`}
            title={className}
          >
            {shortLabel}
            <span className={`ml-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>({count})</span>
          </button>
        );
      })}
      {hasActiveFilters && (
        <button
          onClick={() => {
            onFilterChange('menuItemClass', []);
            onFilterChange('searchTerm', '');
          }}
          className="px-1 text-xs text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
        >
          Clear
        </button>
      )}
    </div>
  );
}
