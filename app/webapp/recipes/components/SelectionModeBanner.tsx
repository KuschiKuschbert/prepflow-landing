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
    <div className="tablet:hidden border-b border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]" />
          <span className="text-sm font-medium text-[#29E7CD]">
            Selection Mode - {selectedCount} selected
          </span>
        </div>
        <button
          onClick={onExitSelectionMode}
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
