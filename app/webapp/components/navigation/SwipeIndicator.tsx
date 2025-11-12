'use client';

import { ChevronUp } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface SwipeIndicatorProps {
  isAtTop: boolean;
  dragProgress: number;
  upwardMovement: number;
  isDragging: boolean;
  direction: 'up' | 'down' | 'both';
}

export function SwipeIndicator({
  isAtTop,
  dragProgress,
  upwardMovement,
  isDragging,
  direction,
}: SwipeIndicatorProps) {
  // Show upward indicator when at top
  const showUpward = isAtTop && direction !== 'down';
  // Show downward indicator when dragging down or not at top
  const showDownward = (direction === 'down' || !isAtTop) && dragProgress > 0;

  // Calculate opacity based on progress
  const upwardOpacity = Math.min(1, upwardMovement / 15);
  const downwardOpacity = dragProgress;

  const scale = isDragging && upwardMovement > 0 ? 1 + upwardOpacity * 0.15 : 1;
  const translateY = isDragging && upwardMovement > 0 ? -upwardMovement * 0.3 : 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-12 z-10 flex items-start justify-center">
      <div className="flex flex-col items-center gap-2">
        {/* Upward swipe indicator (when at top) - only show when actively dragging up */}
        {showUpward && isDragging && upwardMovement > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border border-[#29E7CD]/40 bg-[#29E7CD]/15 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-200"
            style={{
              opacity: Math.max(0.9, upwardOpacity),
              transform: `translateY(${translateY}px) scale(${scale})`,
              boxShadow: `0 4px 12px rgba(41, 231, 205, ${upwardOpacity * 0.3})`,
            }}
          >
            <Icon icon={ChevronUp} size="xs" className="text-[#29E7CD] transition-transform duration-200" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-[#29E7CD]">
              {upwardMovement > 12 ? 'Release to close' : 'Swipe up to close'}
            </span>
          </div>
        )}

        {/* Downward swipe progress indicator */}
        {showDownward && dragProgress > 0.05 && (
          <div className="relative w-20 overflow-hidden rounded-full bg-[#2a2a2a]/60 backdrop-blur-sm">
            <div
              className="h-1.5 bg-gradient-to-r from-[#29E7CD] via-[#3B82F6] to-[#D925C7] transition-all duration-150 ease-out"
              style={{
                width: `${Math.min(100, downwardOpacity * 100)}%`,
              }}
            />
            {/* Glow effect when near threshold */}
            {dragProgress > 0.8 && (
              <div
                className="absolute inset-0 rounded-full bg-[#29E7CD]/30 blur-sm"
                style={{
                  opacity: (dragProgress - 0.8) * 5,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
