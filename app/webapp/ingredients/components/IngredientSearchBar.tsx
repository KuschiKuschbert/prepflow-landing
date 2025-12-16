'use client';

import { Icon } from '@/components/ui/Icon';
import { Search, X } from 'lucide-react';

interface IngredientSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

export function IngredientSearchBar({
  searchTerm,
  onSearchChange,
  onClear,
}: IngredientSearchBarProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <Icon
        icon={Search}
        size="sm"
        className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
        aria-hidden={true}
      />
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-10 pl-10 text-[var(--foreground)] placeholder-gray-500 transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
        aria-label="Search ingredients"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          aria-label="Clear search"
        >
          <Icon icon={X} size="sm" aria-hidden={true} />
        </button>
      )}
    </div>
  );
}
