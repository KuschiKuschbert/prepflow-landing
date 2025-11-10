'use client';

interface DrawerHeaderProps {
  onClose: () => void;
  onContentTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  isAtTop?: boolean;
  upwardMovement?: number;
}

export function DrawerHeader({
  onClose,
  onContentTouchStart,
  onTouchMove,
  onTouchEnd,
  isAtTop = false,
  upwardMovement = 0,
}: DrawerHeaderProps) {
  const showUpwardHint = isAtTop && upwardMovement === 0;

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-between border-b border-[#2a2a2a]/20 px-3 py-2 select-none"
      onTouchStart={onContentTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        borderBottomColor:
          upwardMovement > 0
            ? `rgba(41, 231, 205, ${0.2 + (upwardMovement / 15) * 0.3})`
            : 'rgba(42, 42, 42, 0.2)',
      }}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-white/90">Navigation</h2>
        {/* Subtle upward arrow hint when at top */}
        {showUpwardHint && (
          <svg
            className="h-3 w-3 animate-pulse text-[#29E7CD]/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
      </div>
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
