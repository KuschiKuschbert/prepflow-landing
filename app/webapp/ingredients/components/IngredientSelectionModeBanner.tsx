'use client';

interface IngredientSelectionModeBannerProps {
  isSelectionMode: boolean;
  onExitSelectionMode: () => void;
}

export function IngredientSelectionModeBanner({
  isSelectionMode,
  onExitSelectionMode,
}: IngredientSelectionModeBannerProps) {
  if (!isSelectionMode) return null;

  return (
    <div className="border-b border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 px-6 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]" />
          <span className="text-sm font-medium text-[#29E7CD]">
            Selection Mode - Tap items to select
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
