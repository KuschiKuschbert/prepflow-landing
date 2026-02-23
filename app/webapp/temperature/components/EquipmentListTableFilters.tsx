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
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      {/* Search and Filter Toggle */}
      <div className="tablet:flex-row flex flex-col gap-3">
        <div className="relative flex-1">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-subtle)]"
          />
          <input
            type="text"
            placeholder="Search equipment, location, or type..."
            value={searchQuery}
            onChange={e => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pr-4 pl-10 text-sm text-[var(--foreground)] placeholder-gray-500 transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                onPageChange(1);
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground)]"
            >
              <Icon icon={X} size="sm" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            showFilters || filterType !== 'all' || filterStatus !== 'all'
              ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
              : 'border-[var(--border)] bg-[var(--muted)] text-[var(--foreground-secondary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)]'
          }`}
        >
          <Icon icon={Filter} size="sm" />
          Filters
          {(filterType !== 'all' || filterStatus !== 'all') && (
            <span className="ml-1 rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs font-semibold text-[var(--button-active-text)]">
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
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-3">
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--foreground-muted)]">
              Equipment Type
            </label>
            <select
              value={filterType}
              onChange={e => {
                onFilterTypeChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
            >
              <option value="all">All Types</option>
              {temperatureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--foreground-muted)]">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={e => {
                onFilterStatusChange(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
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
