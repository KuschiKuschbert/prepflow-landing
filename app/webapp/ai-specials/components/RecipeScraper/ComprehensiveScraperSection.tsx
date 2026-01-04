/**
 * Comprehensive Scraper Section Component
 * Modern, clean UI for comprehensive scraping progress
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import {
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  RefreshCw,
  Square,
  TrendingUp,
  XCircle,
  Gauge,
} from 'lucide-react';
import { useState } from 'react';

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
    estimatedTimeRemaining?: number; // in seconds
  };
}

interface ComprehensiveScraperSectionProps {
  comprehensiveScraping: boolean;
  comprehensiveStatus: ComprehensiveJobStatus | null;
  onStartComprehensive: () => void;
  onStopComprehensive?: () => void;
  onRefreshStatus?: () => void;
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

const formatSourceName = (source: string): string => {
  return source.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function ComprehensiveScraperSection({
  comprehensiveScraping,
  comprehensiveStatus,
  onStartComprehensive,
  onStopComprehensive,
  onRefreshStatus,
}: ComprehensiveScraperSectionProps) {
  const isRunning = comprehensiveScraping || (comprehensiveStatus?.isRunning ?? false);
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleConvertUnits = async (dryRun: boolean = false) => {
    setConverting(true);
    setConversionResult(null);
    try {
      const response = await fetch(`/api/recipe-scraper/convert-units${dryRun ? '?dry=1' : ''}`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        setConversionResult(
          dryRun
            ? `Dry run: Would convert ${result.data.convertedRecipes} recipes (${result.data.totalIngredientsConverted} ingredients)`
            : `✅ Converted ${result.data.convertedRecipes} recipes (${result.data.totalIngredientsConverted} ingredients)`,
        );
        if (!dryRun && onRefreshStatus) {
          // Refresh status after conversion
          setTimeout(() => {
            onRefreshStatus?.();
          }, 1000);
        }
      } else {
        setConversionResult(`Error: ${result.message || 'Conversion failed'}`);
      }
    } catch (error) {
      setConversionResult(`Error: ${error instanceof Error ? error.message : 'Conversion failed'}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="desktop:p-8 rounded-3xl border border-[#29E7CD]/20 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="desktop:text-3xl mb-2 text-2xl font-bold text-[var(--foreground)]">
          Comprehensive Database Scraping
        </h2>
        <p className="desktop:text-base text-sm text-[var(--foreground-muted)]">
          Scrape ALL recipes from AllRecipes, Food Network, Epicurious, Bon Appétit, Tasty, Serious
          Eats, Food52, Simply Recipes, Smitten Kitchen, The Kitchn, and Delish automatically.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={onStartComprehensive}
          disabled={isRunning || converting}
          className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? (
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
        {onStopComprehensive && (
          <button
            onClick={onStopComprehensive}
            disabled={!isRunning || converting}
            className="rounded-xl border-2 border-[var(--color-error)] bg-transparent px-6 py-3 font-semibold text-[var(--color-error)] transition-all hover:bg-[var(--color-error)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={Square} className="mr-2 inline" aria-hidden={true} />
            Stop Scraping
          </button>
        )}
        {onRefreshStatus && (
          <button
            onClick={onRefreshStatus}
            disabled={converting}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh scraper status"
          >
            <Icon icon={RefreshCw} className="inline" aria-hidden={true} />
          </button>
        )}
        <button
          onClick={() => handleConvertUnits(false)}
          disabled={converting || isRunning}
          className="rounded-xl border border-[#29E7CD]/50 bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all hover:bg-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50"
          title="Convert all recipes to Australian units (ml, l, gm, kg)"
        >
          {converting ? (
            <>
              <Icon icon={Loader2} className="mr-2 inline animate-spin" aria-hidden={true} />
              Converting...
            </>
          ) : (
            <>
              <Icon icon={Gauge} className="mr-2 inline" aria-hidden={true} />
              Convert to Australian Units
            </>
          )}
        </button>
      </div>

      {/* Conversion Result */}
      {conversionResult && (
        <div
          className={`mb-4 rounded-xl border p-4 ${
            conversionResult.startsWith('✅')
              ? 'border-green-500/50 bg-green-500/10 text-green-400'
              : conversionResult.startsWith('Dry run')
                ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10 text-[#29E7CD]'
                : 'border-[var(--color-error)]/50 bg-[var(--color-error)]/10 text-[var(--color-error)]'
          }`}
        >
          <div className="text-sm font-medium">{conversionResult}</div>
        </div>
      )}

      {/* Progress Dashboard */}
      {comprehensiveStatus && (
        <div className="space-y-6">
          {/* Overall Progress - Hero Card */}
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
                <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Scraped
                </div>
                <div className="text-2xl font-bold text-[#29E7CD]">
                  {comprehensiveStatus.overall?.totalScraped.toLocaleString() || 0}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--surface)] p-4">
                <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Failed
                </div>
                <div className="text-2xl font-bold text-[var(--color-error)]">
                  {comprehensiveStatus.overall?.totalFailed.toLocaleString() || 0}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--surface)] p-4">
                <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Remaining
                </div>
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
                        <Icon
                          icon={Clock}
                          size="md"
                          className="text-[#29E7CD]"
                          aria-hidden={true}
                        />
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

          {/* Per-Source Progress - Grid Layout */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              Per-Source Progress
            </h3>
            <div className="tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 grid grid-cols-1 gap-4">
              {Object.entries(comprehensiveStatus.sources || {}).map(
                ([source, stats]: [string, any]) => (
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
                          <Icon
                            icon={Clock}
                            size="xs"
                            className="text-[#29E7CD]"
                            aria-hidden={true}
                          />
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
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
