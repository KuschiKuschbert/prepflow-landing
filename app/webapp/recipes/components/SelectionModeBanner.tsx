'use client';

interface SelectionModeBannerProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onExitSelectionMode: () => void;
}

export function SelectionModeBanner({
  isSelectionMode,
  selectedCount,
  onExitSelectionMode,
}: SelectionModeBannerProps) {
  if (!isSelectionMode) return null;

  return (
    <div className="tablet:hidden border-b border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
          <span className="text-sm font-medium text-[var(--primary)]">
            Selection Mode - {selectedCount} selected
          </span>
        </div>
        <button
          onClick={onExitSelectionMode}
          className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
