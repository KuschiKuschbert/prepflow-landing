'use client';

interface ActiveFilterChipsProps {
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  onClearSearch: () => void;
  onClearSupplier: () => void;
  onClearStorage: () => void;
}

export function ActiveFilterChips({
  searchTerm,
  supplierFilter,
  storageFilter,
  onClearSearch,
  onClearSupplier,
  onClearStorage,
}: ActiveFilterChipsProps) {
  if (!searchTerm && !supplierFilter && !storageFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-400">Active:</span>
      {searchTerm && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
          <span>🔍</span>
          <span>{searchTerm}</span>
          <button
            onClick={onClearSearch}
            className="ml-1 text-[#29E7CD]/70 transition-colors hover:text-[#29E7CD]"
            aria-label="Remove search filter"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {supplierFilter && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-medium text-[#3B82F6]">
          <span>🏪</span>
          <span>{supplierFilter}</span>
          <button
            onClick={onClearSupplier}
            className="ml-1 text-[#3B82F6]/70 transition-colors hover:text-[#3B82F6]"
            aria-label="Remove supplier filter"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {storageFilter && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D925C7]/30 bg-[#D925C7]/10 px-3 py-1 text-xs font-medium text-[#D925C7]">
          <span>📍</span>
          <span>{storageFilter}</span>
          <button
            onClick={onClearStorage}
            className="ml-1 text-[#D925C7]/70 transition-colors hover:text-[#D925C7]"
            aria-label="Remove storage filter"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
