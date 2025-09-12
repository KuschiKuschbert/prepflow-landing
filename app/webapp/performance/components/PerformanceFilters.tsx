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
      [key]: value
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300 mb-2">Search</label>
        <input
          type="text"
          placeholder="Search dishes..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent text-base"
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300 mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent text-base"
        >
          <option value="gross_profit_percentage">Gross Profit %</option>
          <option value="number_sold">Number Sold</option>
          <option value="popularity_percentage">Popularity %</option>
          <option value="name">Name</option>
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300 mb-2">Order</label>
        <select
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          className="px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent text-base"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
