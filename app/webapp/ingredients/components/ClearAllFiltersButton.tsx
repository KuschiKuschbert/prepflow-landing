'use client';

interface ClearAllFiltersButtonProps {
  activeFilterCount: number;
  onClearAll: () => void;
}

export function ClearAllFiltersButton({
  activeFilterCount,
  onClearAll,
}: ClearAllFiltersButtonProps) {
  if (activeFilterCount === 0) return null;

  return (
    <button
      onClick={onClearAll}
      className="flex items-center gap-1.5 rounded-lg border border-gray-600/30 bg-gray-600/10 px-2.5 py-2 text-xs font-medium text-[var(--foreground-muted)] transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-500/20 hover:text-[var(--foreground)]"
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span>Clear ({activeFilterCount})</span>
    </button>
  );
}
