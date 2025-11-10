'use client';

interface DrawerSearchButtonProps {
  onSearchClick: () => void;
}

export function DrawerSearchButton({ onSearchClick }: DrawerSearchButtonProps) {
  return (
    <div className="flex-shrink-0 border-b border-[#2a2a2a]/20 px-3 py-2">
      <button
        onClick={onSearchClick}
        className="flex w-full items-center space-x-2 rounded-lg border border-[#2a2a2a]/20 bg-[#2a2a2a]/15 px-3 py-2 text-left transition-colors hover:bg-[#2a2a2a]/30"
      >
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-xs text-gray-400">Search...</span>
      </button>
    </div>
  );
}
