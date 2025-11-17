'use client';

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
      <div className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search ingredients..."
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
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
