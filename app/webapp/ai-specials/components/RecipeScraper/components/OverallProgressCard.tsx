/**
 * Overall Progress Card Component
 * Displays overall scraping progress with stats
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Clock, TrendingUp } from 'lucide-react';
import { formatTime } from '../utils/scraper-formatters';
import type { ComprehensiveJobStatus } from '../types';

interface OverallProgressCardProps {
  comprehensiveStatus: ComprehensiveJobStatus;
}

export function OverallProgressCard({ comprehensiveStatus }: OverallProgressCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Overall Progress</h3>
        <div className="flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1">
          <Icon icon={TrendingUp} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {comprehensiveStatus.overall?.overallProgressPercent || 0}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500 ease-out"
          style={{ width: `${comprehensiveStatus.overall?.overallProgressPercent || 0}%` }}
        />
      </div>

      {/* Stats Grid */}
      <div className="tablet:grid-cols-4 mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
            Discovered
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {comprehensiveStatus.overall?.totalDiscovered.toLocaleString() || 0}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Scraped</div>
          <div className="text-2xl font-bold text-[#29E7CD]">
            {comprehensiveStatus.overall?.totalScraped.toLocaleString() || 0}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Failed</div>
          <div className="text-2xl font-bold text-[var(--color-error)]">
            {comprehensiveStatus.overall?.totalFailed.toLocaleString() || 0}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-4">
          <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Remaining</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {comprehensiveStatus.overall?.totalRemaining.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Prominent Time Remaining */}
      {comprehensiveStatus.overall?.estimatedTimeRemaining &&
        comprehensiveStatus.overall.estimatedTimeRemaining > 0 && (
          <div className="rounded-xl border-2 border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#29E7CD]/20 p-2">
                  <Icon icon={Clock} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                </div>
                <div>
                  <div className="text-xs font-medium text-[var(--foreground-muted)]">
                    Estimated Time Remaining
                  </div>
                  <div className="text-xl font-bold text-[#29E7CD]">
                    {formatTime(comprehensiveStatus.overall.estimatedTimeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
