/**
 * Per-Source Progress Grid Component
 * Displays progress for each source in a grid layout
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, Clock } from 'lucide-react';
import { formatSourceName, formatTime } from '../utils/scraper-formatters';
import type { ComprehensiveSourceStatus } from '../types';

interface PerSourceProgressGridProps {
  sources: Record<string, ComprehensiveSourceStatus>;
}

export function PerSourceProgressGrid({ sources }: PerSourceProgressGridProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Per-Source Progress</h3>
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 grid grid-cols-1 gap-4">
        {Object.entries(sources || {}).map(([source, stats]: [string, ComprehensiveSourceStatus]) => (
          <div
            key={source}
            className="group rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg"
          >
            {/* Source Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stats.isComplete ? (
                  <Icon
                    icon={CheckCircle2}
                    size="sm"
                    className="text-green-400"
                    aria-hidden={true}
                  />
                ) : (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]" />
                )}
                <span className="font-semibold text-[var(--foreground)]">
                  {formatSourceName(source)}
                </span>
              </div>
              <span className="text-xs font-medium text-[var(--foreground-muted)]">
                {stats.progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>

            {/* Compact Stats */}
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-[var(--foreground-muted)]">Scraped</div>
                <div className="font-semibold text-[#29E7CD]">
                  {stats.scraped?.toLocaleString() || 0}
                </div>
              </div>
              <div>
                <div className="text-[var(--foreground-muted)]">Failed</div>
                <div className="font-semibold text-[var(--color-error)]">
                  {stats.failed?.toLocaleString() || 0}
                </div>
              </div>
              <div>
                <div className="text-[var(--foreground-muted)]">Left</div>
                <div className="font-semibold text-[var(--foreground)]">
                  {stats.remaining?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            {/* Time Remaining - Compact */}
            {stats.remaining > 0 &&
              stats.estimatedTimeRemaining &&
              stats.estimatedTimeRemaining > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-[var(--surface)] px-2 py-1.5">
                  <Icon icon={Clock} size="xs" className="text-[#29E7CD]" aria-hidden={true} />
                  <span className="text-xs font-medium text-[var(--foreground-muted)]">
                    {formatTime(stats.estimatedTimeRemaining)}
                  </span>
                </div>
              )}

            {/* Complete Badge */}
            {stats.isComplete && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                <Icon icon={CheckCircle2} size="xs" aria-hidden={true} />
                <span>Complete</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
