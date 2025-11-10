'use client';

interface DrawerHandleProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  dragProgress: number;
  isDragging: boolean;
}

export function DrawerHandle({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  dragProgress,
  isDragging,
}: DrawerHandleProps) {
  return (
    <div
      className="relative flex flex-shrink-0 cursor-grab items-center justify-center pt-2 pb-1.5 select-none active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Handle bar with visual feedback */}
      <div
        className="h-1 w-10 rounded-full transition-all duration-200"
        style={{
          backgroundColor: isDragging
            ? `rgba(41, 231, 205, ${0.3 + dragProgress * 0.7})`
            : 'rgba(156, 163, 175, 0.6)',
          width: isDragging ? `${10 + dragProgress * 20}px` : '40px',
          transform: `scaleY(${isDragging ? 1 + dragProgress * 0.3 : 1})`,
        }}
      />
      {/* Animated dots hint */}
      {!isDragging && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-1 pt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-1 w-1 animate-pulse rounded-full bg-gray-400/40"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
