/**
 * Status Indicator Card Component
 * Displays current scraping status with controls
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Loader2, Pause, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ComprehensiveJobStatus } from '../types';

interface StatusIndicatorCardProps {
  isRunning: boolean;
  comprehensiveStatus: ComprehensiveJobStatus;
  onStopComprehensive?: () => void;
  onResumeComprehensive?: () => void;
  disabled?: boolean;
}

export function StatusIndicatorCard({
  isRunning,
  comprehensiveStatus,
  onStopComprehensive,
  onResumeComprehensive,
  disabled = false,
}: StatusIndicatorCardProps) {
  const [isResuming, setIsResuming] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon
            icon={isRunning ? Loader2 : Sparkles}
            size="lg"
            className={`${isRunning ? 'animate-spin' : ''} text-[#29E7CD]`}
            aria-hidden={true}
          />
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {isResuming
                ? 'Resuming scraping...'
                : isRunning
                  ? 'Scraping in Progress'
                  : comprehensiveStatus.overall?.totalRemaining &&
                      comprehensiveStatus.overall.totalRemaining > 0
                    ? 'Scraping Paused'
                    : 'Scraping Status'}
            </h3>
            {isRunning && comprehensiveStatus.overall && (
              <p className="text-sm text-[var(--foreground-muted)]">
                {comprehensiveStatus.overall.totalScraped.toLocaleString()} of{' '}
                {comprehensiveStatus.overall.totalDiscovered.toLocaleString()} recipes scraped (
                {comprehensiveStatus.overall.overallProgressPercent.toFixed(1)}%)
              </p>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {isRunning && onStopComprehensive && (
            <button
              onClick={onStopComprehensive}
              disabled={disabled}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
              aria-label="Pause scraping"
            >
              <Icon icon={Pause} size="sm" aria-hidden={true} />
              <span className="tablet:inline hidden">Pause</span>
            </button>
          )}
          {!isRunning &&
            comprehensiveStatus.overall?.totalRemaining &&
            comprehensiveStatus.overall.totalRemaining > 0 &&
            onResumeComprehensive && (
              <button
                onClick={async () => {
                  setIsResuming(true);
                  try {
                    await onResumeComprehensive();
                  } finally {
                    setTimeout(() => setIsResuming(false), 1000);
                  }
                }}
                disabled={isResuming || disabled}
                className="flex items-center gap-2 rounded-xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] transition-all hover:shadow-lg disabled:opacity-50"
                aria-label="Resume scraping"
              >
                {isResuming ? (
                  <>
                    <Icon
                      icon={Loader2}
                      size="sm"
                      className="animate-spin"
                      aria-hidden={true}
                    />
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

      {/* Progress Bar */}
      {isRunning && comprehensiveStatus.overall && (
        <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500 ease-out"
            style={{ width: `${comprehensiveStatus.overall.overallProgressPercent}%` }}
          />
        </div>
      )}

      {/* Quick Stats */}
      {comprehensiveStatus.overall && (
        <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
              Discovered
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {comprehensiveStatus.overall.totalDiscovered.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Scraped</div>
            <div className="text-2xl font-bold text-[#29E7CD]">
              {comprehensiveStatus.overall.totalScraped.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Failed</div>
            <div className="text-2xl font-bold text-[var(--color-error)]">
              {comprehensiveStatus.overall.totalFailed.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
              Remaining
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {comprehensiveStatus.overall.totalRemaining.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
