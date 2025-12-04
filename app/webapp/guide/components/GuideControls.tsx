/**
 * Guide navigation controls component.
 * Provides previous/next buttons and progress indicator.
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GuideControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  className?: string;
}

export function GuideControls({
  onPrevious,
  onNext,
  onComplete,
  isFirstStep,
  isLastStep,
  progress,
  className = '',
}: GuideControlsProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-sm text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous step"
      >
        <Icon icon={ChevronLeft} size="sm" aria-hidden={true} />
        Previous
      </button>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
          <div
            className="h-full bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${progress}%`}
          />
        </div>
      </div>

      {isLastStep ? (
        <button
          onClick={onComplete || onNext}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-6 py-2 text-sm font-medium text-black transition-all hover:shadow-lg hover:shadow-[#FF6B00]/25"
          aria-label="Complete guide"
        >
          Complete
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] px-4 py-2 text-sm font-medium text-black transition-all hover:shadow-lg hover:shadow-[#FF6B00]/25"
          aria-label="Next step"
        >
          Next
          <Icon icon={ChevronRight} size="sm" aria-hidden={true} />
        </button>
      )}
    </div>
  );
}
