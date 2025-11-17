'use client';

import { useEffect, useRef, useState } from 'react';
import { PerformanceFilters as PerformanceFiltersType } from '../types';
import { PerformanceItem } from '../types';

interface PerformanceFiltersProps {
  filters: PerformanceFiltersType;
  performanceItems: PerformanceItem[];
  filteredAndSortedItems: PerformanceItem[];
  onFiltersChange: (filters: PerformanceFiltersType) => void;
}

const MENU_ITEM_CLASSES = ["Chef's Kiss", 'Hidden Gem', 'Bargain Bucket', 'Burnt Toast'] as const;

const QUICK_PRESETS = {
  'Show Hidden Gems': ['Hidden Gem'],
  'Show Bargain Buckets': ['Bargain Bucket'],
  'Show Burnt Toast': ['Burnt Toast'],
  "Show Chef's Kiss": ["Chef's Kiss"],
} as const;

export default function PerformanceFilters({
  filters,
  performanceItems,
  filteredAndSortedItems,
  onFiltersChange,
}: PerformanceFiltersProps) {
  const [isSticky, setIsSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (key: keyof PerformanceFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMenuItemClassToggle = (className: string) => {
    const currentClasses = filters.menuItemClass || [];
    const newClasses = currentClasses.includes(className)
      ? currentClasses.filter(c => c !== className)
      : [...currentClasses, className];

    handleFilterChange('menuItemClass', newClasses);
  };

  const handleQuickPreset = (preset: string[]) => {
    handleFilterChange('menuItemClass', preset);
  };

  // Calculate counts for each menu item class
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
    <div
      ref={filterRef}
      className={`tablet:mb-4 tablet:space-y-3 desktop:mb-6 desktop:space-y-4 mb-3 space-y-2 transition-all ${
        isSticky
          ? 'tablet:p-4 desktop:p-6 sticky top-0 z-40 rounded-b-xl border-b border-[#2a2a2a] bg-[#1f1f1f] p-3 shadow-lg'
          : ''
      }`}
    >
      {/* Result count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing <span className="font-semibold text-white">{filteredAndSortedItems.length}</span>{' '}
          of <span className="font-semibold text-white">{performanceItems.length}</span> items
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              handleFilterChange('menuItemClass', []);
              handleFilterChange('searchTerm', '');
            }}
            className="text-fluid-sm text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Quick Filter Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-300">Quick Filters</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(QUICK_PRESETS).map(([presetName, presetClasses]) => {
            const isActive = presetClasses.every(cls => filters.menuItemClass?.includes(cls));
            return (
              <button
                key={presetName}
                onClick={() => handleQuickPreset([...presetClasses])}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'border-2 border-[#29E7CD] bg-[#29E7CD]/20 text-[#29E7CD] shadow-lg shadow-[#29E7CD]/20'
                    : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-[#29E7CD]'
                }`}
              >
                {presetName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Class Chips */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-300">Filter by Class</label>
        <div className="flex flex-wrap gap-1.5">
          {MENU_ITEM_CLASSES.map(className => {
            const isActive = filters.menuItemClass?.includes(className) || false;
            const count = classCounts[className];

            return (
              <button
                key={className}
                onClick={() => handleMenuItemClassToggle(className)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? className === "Chef's Kiss"
                      ? 'border-2 border-green-500 bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                      : className === 'Hidden Gem'
                        ? 'border-2 border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20'
                        : className === 'Bargain Bucket'
                          ? 'border-2 border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                          : 'border-2 border-red-500 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20'
                    : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-[#29E7CD]'
                }`}
              >
                {className}
                <span className={`ml-2 ${isActive ? 'opacity-100' : 'opacity-60'}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-medium text-gray-300">Search</label>
          <input
            type="text"
            placeholder="Search dishes..."
            value={filters.searchTerm}
            onChange={e => handleFilterChange('searchTerm', e.target.value)}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-medium text-gray-300">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value="name">Dish Name</option>
            <option value="number_sold">Number Sold</option>
            <option value="popularity_percentage">Popularity %</option>
            <option value="total_revenue">Total Revenue</option>
            <option value="total_cost">Total Cost</option>
            <option value="total_profit">Total Profit</option>
            <option value="gross_profit_percentage">Gross Profit %</option>
            <option value="profit_category">Profit Category</option>
            <option value="popularity_category">Popularity Category</option>
            <option value="menu_item_class">Menu Item Class</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-medium text-gray-300">Order</label>
          <select
            value={filters.sortOrder}
            onChange={e => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
