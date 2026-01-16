/**
 * Menu item class filter chips.
 */
'use client';

import { PerformanceFilters as PerformanceFiltersType, PerformanceItem } from '../../types';

const MENU_ITEM_CLASSES = ["Chef's Kiss", 'Hidden Gem', 'Bargain Bucket', 'Burnt Toast'] as const;

interface MenuItemClassFiltersProps {
  filters: PerformanceFiltersType;
  performanceItems: PerformanceItem[];
  onFilterChange: (key: keyof PerformanceFiltersType, value: string | string[]) => void;
}

export function MenuItemClassFilters({
  filters,
  performanceItems,
  onFilterChange,
}: MenuItemClassFiltersProps) {
  const handleMenuItemClassToggle = (className: string) => {
    const currentClasses = filters.menuItemClass || [];
    const newClasses = currentClasses.includes(className)
      ? currentClasses.filter(c => c !== className)
      : [...currentClasses, className];
    onFilterChange('menuItemClass', newClasses);
  };

  const classCounts = MENU_ITEM_CLASSES.reduce(
    (acc, className) => {
      acc[className] = performanceItems.filter(item => item.menu_item_class === className).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hasActiveFilters =
    (filters.menuItemClass?.length || 0) > 0 || filters.searchTerm.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {MENU_ITEM_CLASSES.map(className => {
        const isActive = filters.menuItemClass?.includes(className) || false;
        const count = classCounts[className];
        const shortLabel =
          className === "Chef's Kiss"
            ? 'Kiss'
            : className === 'Hidden Gem'
              ? 'Gem'
              : className === 'Bargain Bucket'
                ? 'Bargain'
                : 'Toast';
        return (
          <button
            key={className}
            onClick={() => handleMenuItemClassToggle(className)}
            className={`rounded-full px-1.5 py-0.5 text-xs font-semibold transition-all ${
              isActive
                ? className === "Chef's Kiss"
                  ? 'border-2 border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
                  : className === 'Hidden Gem'
                    ? 'border-2 border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info)]'
                    : className === 'Bargain Bucket'
                      ? 'border-2 border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                      : 'border-2 border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]'
                : 'border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground-muted)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)]'
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
          className="px-1 text-xs text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
        >
          Clear
        </button>
      )}
    </div>
  );
}
