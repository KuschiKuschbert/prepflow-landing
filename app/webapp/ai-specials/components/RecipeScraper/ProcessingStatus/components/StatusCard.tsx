/**
 * Status Card Component
 * Main status display with controls
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Loader2, Pause, Play, Sparkles } from 'lucide-react';

interface StatusCardProps {
  isProcessing: boolean;
  isPaused: boolean;
  isResuming: boolean;
  totalProcessed: number;
  totalRecipes: number;
  progressPercent: number;
  onPause?: () => void;
  onResume?: () => void;
}

export function StatusCard({
  isProcessing,
  isPaused,
  isResuming,
  totalProcessed,
  totalRecipes,
  progressPercent,
  onPause,
  onResume,
}: StatusCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon
            icon={isProcessing && !isPaused ? Loader2 : Sparkles}
            size="lg"
            className={`${isProcessing && !isPaused ? 'animate-spin' : ''} text-[#29E7CD]`}
            aria-hidden={true}
          />
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {isResuming
                ? 'Resuming formatting...'
                : isPaused
                  ? 'Formatting Paused'
                  : isProcessing
                    ? 'Formatting in Progress'
                    : 'Formatting Status'}
            </h3>
            {isProcessing && !isPaused && (
              <p className="text-sm text-[var(--foreground-muted)]">
                {totalProcessed} of {totalRecipes} recipes processed ({progressPercent.toFixed(1)}%)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing && !isPaused && onPause && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
              aria-label="Pause formatting"
            >
              <Icon icon={Pause} size="sm" aria-hidden={true} />
              <span className="tablet:inline hidden">Pause</span>
            </button>
          )}
          {(isPaused || (!isProcessing && totalRecipes > 0)) && onResume && (
            <button
              onClick={onResume}
              disabled={isResuming}
              className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
              aria-label="Resume formatting"
            >
              {isResuming ? (
                <>
                  <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                  <span className="tablet:inline hidden">Resuming...</span>
                </>
              ) : (
                <>
                  <Icon icon={Play} size="sm" aria-hidden={true} />
                  <span className="tablet:inline hidden">Resume</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
