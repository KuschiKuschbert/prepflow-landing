/**
 * Comprehensive Scraper Section Component
 * Handles comprehensive scraping UI and progress display
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Download, Loader2 } from 'lucide-react';

interface ComprehensiveSourceStatus {
  discovered: number;
  scraped: number;
  failed: number;
  remaining: number;
  progressPercent: number;
  estimatedTimeRemaining?: number;
  isComplete: boolean;
}

interface ComprehensiveJobStatus {
  isRunning: boolean;
  sources: Record<string, ComprehensiveSourceStatus>;
  overall: {
    totalDiscovered: number;
    totalScraped: number;
    totalFailed: number;
    totalRemaining: number;
    overallProgressPercent: number;
  };
}

interface ComprehensiveScraperSectionProps {
  comprehensiveScraping: boolean;
  comprehensiveStatus: ComprehensiveJobStatus | null;
  onStartComprehensive: () => void;
}

const formatTime = (seconds?: number): string => {
  if (!seconds) return 'Calculating...';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function ComprehensiveScraperSection({
  comprehensiveScraping,
  comprehensiveStatus,
  onStartComprehensive,
}: ComprehensiveScraperSectionProps) {
  return (
    <div className="rounded-3xl border border-[#29E7CD]/20 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-6 shadow-lg">
      <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
        Comprehensive Database Scraping
      </h2>
      <p className="mb-4 text-sm text-[var(--foreground-muted)]">
        Scrape ALL recipes from AllRecipes, BBC Good Food, and Food Network automatically. This will
        discover and scrape every available recipe from all sources. Progress is saved and can be
        resumed if interrupted.
      </p>
      <button
        onClick={onStartComprehensive}
        disabled={comprehensiveScraping || (comprehensiveStatus?.isRunning ?? false)}
        className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {comprehensiveScraping || comprehensiveStatus?.isRunning ? (
          <>
            <Icon icon={Loader2} className="mr-2 inline animate-spin" aria-hidden={true} />
            Scraping in Progress...
          </>
        ) : (
          <>
            <Icon icon={Download} className="mr-2 inline" aria-hidden={true} />
            Start Comprehensive Scrape
          </>
        )}
      </button>

      {/* Progress Dashboard */}
      {comprehensiveStatus && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <h4 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
              Overall Progress
            </h4>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Overall Progress</span>
              <span className="font-semibold text-[var(--foreground)]">
                {comprehensiveStatus.overall?.overallProgressPercent || 0}%
              </span>
            </div>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
                style={{ width: `${comprehensiveStatus.overall?.overallProgressPercent || 0}%` }}
              />
            </div>
            <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[var(--foreground-muted)]">Discovered</div>
                <div className="text-lg font-semibold text-[var(--foreground)]">
                  {comprehensiveStatus.overall?.totalDiscovered || 0}
                </div>
              </div>
              <div>
                <div className="text-[var(--foreground-muted)]">Scraped</div>
                <div className="text-lg font-semibold text-[#29E7CD]">
                  {comprehensiveStatus.overall?.totalScraped || 0}
                </div>
              </div>
              <div>
                <div className="text-[var(--foreground-muted)]">Failed</div>
                <div className="text-lg font-semibold text-[var(--color-error)]">
                  {comprehensiveStatus.overall?.totalFailed || 0}
                </div>
              </div>
              <div>
                <div className="text-[var(--foreground-muted)]">Remaining</div>
                <div className="text-lg font-semibold text-[var(--foreground)]">
                  {comprehensiveStatus.overall?.totalRemaining || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Per-Source Progress */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-[var(--foreground)]">Per-Source Progress</h4>
            {Object.entries(comprehensiveStatus.sources || {}).map(
              ([source, stats]: [string, any]) => (
                <div
                  key={source}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-[var(--foreground)] capitalize">
                      {source.replace(/-/g, ' ')}
                    </span>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {stats.progressPercent}% {stats.isComplete && '(Complete)'}
                    </span>
                  </div>
                  <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
                      style={{ width: `${stats.progressPercent}%` }}
                    />
                  </div>
                  <div className="tablet:grid-cols-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[var(--foreground-muted)]">Discovered</div>
                      <div className="font-semibold text-[var(--foreground)]">
                        {stats.discovered || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--foreground-muted)]">Scraped</div>
                      <div className="font-semibold text-[#29E7CD]">{stats.scraped || 0}</div>
                    </div>
                    <div>
                      <div className="text-[var(--foreground-muted)]">Failed</div>
                      <div className="font-semibold text-[var(--color-error)]">
                        {stats.failed || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--foreground-muted)]">Remaining</div>
                      <div className="font-semibold text-[var(--foreground)]">
                        {stats.remaining || 0}
                      </div>
                    </div>
                  </div>
                  {stats.estimatedTimeRemaining && stats.estimatedTimeRemaining > 0 && (
                    <div className="mt-2 text-xs text-[var(--foreground-muted)]">
                      Estimated time remaining: {formatTime(stats.estimatedTimeRemaining)}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
