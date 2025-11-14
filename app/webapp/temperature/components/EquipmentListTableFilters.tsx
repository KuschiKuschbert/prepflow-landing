'use client';

import { Icon } from '@/components/ui/Icon';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface EquipmentListTableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onPageChange: (page: number) => void;
}

export function EquipmentListTableFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange,
  temperatureTypes,
  onPageChange,
}: EquipmentListTableFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col gap-3 tablet:flex-row">
        <div className="relative flex-1">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search equipment, location, or type..."
            value={searchQuery}
            onChange={e => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-500 transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                onPageChange(1);
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
            >
              <Icon icon={X} size="sm" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            showFilters || filterType !== 'all' || filterStatus !== 'all'
              ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
              : 'border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white'
          }`}
        >
          <Icon icon={Filter} size="sm" />
          Filters
          {(filterType !== 'all' || filterStatus !== 'all') && (
            <span className="ml-1 rounded-full bg-[#29E7CD] px-2 py-0.5 text-xs font-semibold text-black">
              {[filterType !== 'all' ? 1 : 0, filterStatus !== 'all' ? 1 : 0].reduce(
                (a, b) => a + b,
                0,
              )}
            </span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-3 border-t border-[#2a2a2a] pt-3 tablet:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Equipment Type</label>
            <select
              value={filterType}
              onChange={e => {
                onFilterTypeChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            >
              <option value="all">All Types</option>
              {temperatureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Status</label>
            <select
              value={filterStatus}
              onChange={e => {
                onFilterStatusChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="inRange">In Range</option>
              <option value="outOfRange">Out of Range</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
