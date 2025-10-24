'use client';

import { PerformanceFilters as PerformanceFiltersType } from '../types';

interface PerformanceFiltersProps {
  filters: PerformanceFiltersType;
  onFiltersChange: (filters: PerformanceFiltersType) => void;
}

export default function PerformanceFilters({ filters, onFiltersChange }: PerformanceFiltersProps) {
  const handleFilterChange = (key: keyof PerformanceFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-300">Search</label>
        <input
          type="text"
          placeholder="Search dishes..."
          value={filters.searchTerm}
          onChange={e => handleFilterChange('searchTerm', e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-base text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-300">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={e => handleFilterChange('sortBy', e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-base text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        >
          <option value="gross_profit_percentage">Gross Profit %</option>
          <option value="number_sold">Number Sold</option>
          <option value="popularity_percentage">Popularity %</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-300">Order</label>
        <select
          value={filters.sortOrder}
          onChange={e => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-base text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
