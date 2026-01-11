/**
 * Comprehensive Scraper Section Component
 * Modern, clean UI for comprehensive scraping progress
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Square,
  TrendingUp,
  XCircle,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { useState, useMemo } from 'react';

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
  startedAt?: string;
  lastUpdated: string;
}

interface ComprehensiveScraperSectionProps {
  comprehensiveScraping: boolean;
  comprehensiveStatus: ComprehensiveJobStatus | null;
  onStartComprehensive: () => void;
  onStopComprehensive?: () => void;
  onResumeComprehensive?: () => void;
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

const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const getHealthColor = (health?: string): string => {
  switch (health) {
    case 'healthy':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const getHealthIcon = (health?: string) => {
  switch (health) {
    case 'healthy':
      return CheckCircle2;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

export function ComprehensiveScraperSection({
  comprehensiveScraping,
  comprehensiveStatus,
  onStartComprehensive,
  onStopComprehensive,
  onResumeComprehensive,
  onRefreshStatus,
}: ComprehensiveScraperSectionProps) {
  const isRunning = comprehensiveScraping || (comprehensiveStatus?.isRunning ?? false);
  const [isResuming, setIsResuming] = useState(false);
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Calculate diagnostics
  const diagnostics = useMemo(() => {
    if (!comprehensiveStatus) return null;

    const now = Date.now();
    const startedAt = comprehensiveStatus.startedAt
      ? new Date(comprehensiveStatus.startedAt).getTime()
      : null;
    const lastUpdated = comprehensiveStatus.lastUpdated
      ? new Date(comprehensiveStatus.lastUpdated).getTime()
      : null;

    // Processing duration
    const processingDuration =
      startedAt && isRunning ? Math.floor((now - startedAt) / 1000) : undefined;

    // Check if stuck (no progress updates for > 5 minutes while running)
    const STUCK_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const isStuck = isRunning && lastUpdated && now - lastUpdated > STUCK_THRESHOLD ? true : false;
    const stuckReason = isStuck
      ? `No progress updates for ${Math.floor((now - lastUpdated!) / 60000)} minutes`
      : undefined;

    // Calculate health status based on error rate and progress
    const totalAttempts =
      (comprehensiveStatus.overall?.totalScraped || 0) +
      (comprehensiveStatus.overall?.totalFailed || 0);
    const errorRate =
      totalAttempts > 0 ? (comprehensiveStatus.overall?.totalFailed || 0) / totalAttempts : 0;
    const progressRate = comprehensiveStatus.overall?.overallProgressPercent || 0;

    let healthStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    if (errorRate > 0.5 || (isStuck && isRunning)) {
      healthStatus = 'error';
    } else if (
      errorRate > 0.2 ||
      (progressRate === 0 && isRunning && processingDuration && processingDuration > 300)
    ) {
      healthStatus = 'warning';
    }

    // Last error (would need to be tracked separately, for now use failed count as indicator)
    const lastError =
      comprehensiveStatus.overall?.totalFailed && comprehensiveStatus.overall.totalFailed > 0
        ? `${comprehensiveStatus.overall.totalFailed} recipes failed to scrape`
        : undefined;

    // Last scraped recipe (would need to be tracked separately, for now use total scraped)
    const lastScrapedRecipe =
      comprehensiveStatus.overall?.totalScraped && comprehensiveStatus.overall.totalScraped > 0
        ? `${comprehensiveStatus.overall.totalScraped} recipes scraped successfully`
        : undefined;

    return {
      isStuck,
      stuckReason,
      healthStatus,
      processingDuration,
      lastError,
      lastScrapedRecipe,
    };
  }, [comprehensiveStatus, isRunning]);

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

      {/* Status Indicator Card (similar to ProcessingStatus) */}
      {comprehensiveStatus && (
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
                  disabled={converting}
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
                    disabled={isResuming || converting}
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
                <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Scraped
                </div>
                <div className="text-2xl font-bold text-[#29E7CD]">
                  {comprehensiveStatus.overall.totalScraped.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--background)] p-4">
                <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                  Failed
                </div>
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
      )}

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

          {/* Diagnostics Panel */}
          {diagnostics && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                  <Icon icon={AlertCircle} size="md" aria-hidden={true} />
                  Diagnostics
                </h4>
                <button
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                  aria-label={showDiagnostics ? 'Hide diagnostics' : 'Show diagnostics'}
                >
                  {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
                </button>
              </div>

              {showDiagnostics && (
                <div className="space-y-3">
                  {/* Health Status */}
                  {diagnostics.healthStatus && (
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface)] p-3">
                      <Icon
                        icon={getHealthIcon(diagnostics.healthStatus)}
                        size="sm"
                        className={getHealthColor(diagnostics.healthStatus)}
                        aria-hidden={true}
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-[var(--foreground-muted)]">
                          Health Status
                        </div>
                        <div
                          className={`text-sm font-semibold ${getHealthColor(diagnostics.healthStatus)}`}
                        >
                          {diagnostics.healthStatus.charAt(0).toUpperCase() +
                            diagnostics.healthStatus.slice(1)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Duration */}
                  {diagnostics.processingDuration !== undefined && (
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface)] p-3">
                      <Icon icon={Clock} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-[var(--foreground-muted)]">
                          Processing Duration
                        </div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {formatDuration(diagnostics.processingDuration)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stuck Warning */}
                  {diagnostics.isStuck && (
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <div className="flex items-start gap-2">
                        <Icon
                          icon={AlertTriangle}
                          size="sm"
                          className="text-yellow-400"
                          aria-hidden={true}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-yellow-400">Scraper Stuck</div>
                          {diagnostics.stuckReason && (
                            <div className="mt-1 text-xs text-yellow-300">
                              {diagnostics.stuckReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Scraped Recipe */}
                  {diagnostics.lastScrapedRecipe && (
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface)] p-3">
                      <Icon
                        icon={CheckCircle2}
                        size="sm"
                        className="text-green-400"
                        aria-hidden={true}
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-[var(--foreground-muted)]">
                          Last Scraped
                        </div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">
                          {diagnostics.lastScrapedRecipe}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Error */}
                  {diagnostics.lastError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                      <div className="flex items-start gap-2">
                        <Icon
                          icon={AlertCircle}
                          size="sm"
                          className="text-red-400"
                          aria-hidden={true}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-red-400">Last Error</div>
                          <div className="mt-1 text-xs text-red-300">{diagnostics.lastError}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
