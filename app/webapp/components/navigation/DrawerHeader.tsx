'use client';

interface DrawerHeaderProps {
  onClose: () => void;
  onContentTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function DrawerHeader({
  onClose,
  onContentTouchStart,
  onTouchMove,
  onTouchEnd,
}: DrawerHeaderProps) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-between border-b border-[#2a2a2a]/20 px-3 py-2 select-none"
      onTouchStart={onContentTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="text-base font-semibold text-white/90">Navigation</h2>
      <button
        onClick={onClose}
        className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg transition-colors hover:bg-[#2a2a2a]/30"
        aria-label="Close navigation"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
