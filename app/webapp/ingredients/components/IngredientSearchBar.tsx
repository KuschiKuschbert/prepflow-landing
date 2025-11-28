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
        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        aria-hidden={true}
      />
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-10 pl-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
        aria-label="Search ingredients"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
          aria-label="Clear search"
        >
          <Icon icon={X} size="sm" aria-hidden={true} />
        </button>
      )}
    </div>
  );
}
