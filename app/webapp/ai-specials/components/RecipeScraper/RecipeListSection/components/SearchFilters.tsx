/**
 * Search and Filter Component
 * Displays search input and filter dropdowns
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Filter } from 'lucide-react';
import { SOURCES, FORMAT_FILTERS } from '../utils';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sourceFilter: string;
  setSourceFilter: (filter: string) => void;
  formatFilter: 'all' | 'formatted' | 'unformatted';
  setFormatFilter: (filter: 'all' | 'formatted' | 'unformatted') => void;
  loadingRecipes: boolean;
  onFetchRecipes: () => void;
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  sourceFilter,
  setSourceFilter,
  formatFilter,
  setFormatFilter,
  loadingRecipes: _loadingRecipes,
  onFetchRecipes,
}: SearchFiltersProps) {
  return (
    <div className="tablet:flex-row mb-4 flex flex-col gap-3">
      <div className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onFetchRecipes();
            }
          }}
          placeholder="Search by ingredients (e.g., tomato, onion, garlic)"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
        />
      </div>
      <div className="tablet:flex-row flex flex-col gap-3">
        <div className="tablet:w-48">
          <div className="relative">
            <Icon
              icon={Filter}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 pl-10 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
            >
              {SOURCES.map(source => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tablet:w-48">
          <div className="relative">
            <Icon
              icon={Filter}
              size="sm"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
            <select
              value={formatFilter}
              onChange={e => {
                const newFilter = e.target.value as 'all' | 'formatted' | 'unformatted';
                setFormatFilter(newFilter);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 pl-10 text-[var(--foreground)] focus:ring-2 focus:ring-[#29E7CD]"
            >
              {FORMAT_FILTERS.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
