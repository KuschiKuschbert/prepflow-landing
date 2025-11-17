'use client';

import { Search, X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface RecipeSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

export function RecipeSearchBar({ searchTerm, onSearchChange, onClear }: RecipeSearchBarProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <div className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400">
        <Icon icon={Search} size="sm" aria-hidden={true} />
      </div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-8 py-2 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD]/50 focus:bg-[#0a0a0a] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
      />
      {searchTerm && (
        <button
          onClick={onClear}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
          aria-label="Clear search"
        >
          <Icon icon={X} size="sm" aria-hidden={true} />
        </button>
      )}
    </div>
  );
}
