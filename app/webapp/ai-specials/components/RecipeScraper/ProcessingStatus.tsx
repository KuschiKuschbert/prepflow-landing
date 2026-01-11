/**
 * Processing Status Component
 * Displays real-time formatting/processing status with diagnostics
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Pause,
  Play,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ProcessingStatus {
  isProcessing: boolean;
  isPaused: boolean;
  queueLength: number;
  activeProcessing: number;
  totalProcessed: number;
  totalRecipes: number;
  skippedFormatted?: number;
  progressPercent: number;
  aiProvider?: string;
  aiProviderModel?: string;
  lastError?: string;
  lastProcessedRecipe?: string;
  isStuck?: boolean;
  stuckReason?: string;
  healthStatus?: 'healthy' | 'warning' | 'error';
  processingDuration?: number; // in seconds
  startedAt?: string;
  geminiQuota?: {
    available: boolean;
    error?: string;
    quotaInfo?: string;
  };
}

interface ProcessingStatusProps {
  processing: ProcessingStatus | null;
  isResuming?: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

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

export function ProcessingStatus({
  processing,
  isResuming = false,
  onPause,
  onResume,
}: ProcessingStatusProps) {
  if (!processing) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
          <Icon icon={Sparkles} size="md" aria-hidden={true} />
          <span>No processing status available</span>
        </div>
      </div>
    );
  }

  const {
    isProcessing,
    isPaused,
    queueLength,
    activeProcessing,
    totalProcessed,
    totalRecipes,
    skippedFormatted,
    progressPercent,
    aiProvider,
    aiProviderModel,
    lastError,
    lastProcessedRecipe,
    isStuck,
    stuckReason,
    healthStatus,
    processingDuration,
    geminiQuota,
  } = processing;

  const HealthIcon = getHealthIcon(healthStatus);

  return (
    <div className="space-y-4">
      {/* Quota Status Warning */}
      {geminiQuota && !geminiQuota.available && (
        <div
          className={`rounded-2xl border p-4 shadow-lg ${
            geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash')
              ? 'border-yellow-500/50 bg-yellow-500/10'
              : 'border-red-500/50 bg-red-500/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <Icon
              icon={
                geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash')
                  ? AlertCircle
                  : AlertTriangle
              }
              size="md"
              className={`mt-0.5 flex-shrink-0 ${
                geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash')
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
              aria-hidden={true}
            />
            <div className="flex-1">
              <h4
                className={`mb-1 font-semibold ${
                  geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash')
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {geminiQuota.quotaInfo?.includes('automatically use gemini-2.0-flash')
                  ? 'Daily Limit Reached - Auto Fallback Active'
                  : 'Gemini API Quota Exceeded'}
              </h4>
              <p className="mb-2 text-sm text-[var(--foreground-muted)]">
                {geminiQuota.quotaInfo || geminiQuota.error || 'Gemini API quota is not available'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://ai.dev/usage?tab=rate-limit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#29E7CD] hover:underline"
                >
                  Check Usage →
                </a>
                <span className="text-[var(--foreground-muted)]">•</span>
                <a
                  href="https://ai.google.dev/gemini-api/docs/rate-limits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#29E7CD] hover:underline"
                >
                  Rate Limits Docs →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Status Card */}
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
                  {totalProcessed} of {totalRecipes} recipes processed ({progressPercent.toFixed(1)}
                  %)
                </p>
              )}
            </div>
          </div>

          {/* Control Buttons */}
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
            {(isPaused || (!isProcessing && queueLength > 0)) && onResume && (
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

        {/* Progress Bar */}
        {isProcessing && (
          <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Active</div>
            <div className="text-2xl font-bold text-[#29E7CD]">{activeProcessing}</div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">In Queue</div>
            <div className="text-2xl font-bold text-[var(--foreground)]">{queueLength}</div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Processed</div>
            <div className="text-2xl font-bold text-[var(--foreground)]">{totalProcessed}</div>
          </div>
          <div className="rounded-xl bg-[var(--background)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">To Format</div>
            <div className="text-2xl font-bold text-[var(--foreground)]">{totalRecipes}</div>
          </div>
        </div>

        {/* Summary Info */}
        {skippedFormatted !== undefined && skippedFormatted > 0 && (
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <Icon icon={CheckCircle2} size="sm" className="text-green-400" aria-hidden={true} />
              <span>
                <span className="font-semibold text-green-400">
                  {skippedFormatted.toLocaleString()}
                </span>{' '}
                recipe{skippedFormatted !== 1 ? 's' : ''} already formatted (skipped)
              </span>
            </div>
          </div>
        )}

        {/* AI Provider Info */}
        {(aiProvider || aiProviderModel) && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--background)] px-4 py-2">
            <Icon icon={Zap} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            <span className="text-sm text-[var(--foreground-muted)]">Model:</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {aiProviderModel || aiProvider || 'Unknown'}
            </span>
          </div>
        )}
      </div>

      {/* Diagnostics Panel */}
      {(isStuck ||
        stuckReason ||
        healthStatus ||
        processingDuration ||
        lastError ||
        lastProcessedRecipe) && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Icon icon={AlertCircle} size="md" aria-hidden={true} />
            Diagnostics
          </h4>

          <div className="space-y-3">
            {/* Health Status */}
            {healthStatus && (
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background)] p-3">
                <Icon
                  icon={HealthIcon}
                  size="sm"
                  className={getHealthColor(healthStatus)}
                  aria-hidden={true}
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-[var(--foreground-muted)]">
                    Health Status
                  </div>
                  <div className={`text-sm font-semibold ${getHealthColor(healthStatus)}`}>
                    {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                  </div>
                </div>
              </div>
            )}

            {/* Processing Duration */}
            {processingDuration !== undefined && (
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background)] p-3">
                <Icon icon={Clock} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-[var(--foreground-muted)]">
                    Processing Duration
                  </div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    {formatDuration(processingDuration)}
                  </div>
                </div>
              </div>
            )}

            {/* Stuck Warning */}
            {isStuck && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Icon
                    icon={AlertTriangle}
                    size="sm"
                    className="text-yellow-400"
                    aria-hidden={true}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-yellow-400">Processing Stuck</div>
                    {stuckReason && (
                      <div className="mt-1 text-xs text-yellow-300">{stuckReason}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Last Processed Recipe */}
            {lastProcessedRecipe && (
              <div className="flex items-center gap-3 rounded-xl bg-[var(--background)] p-3">
                <Icon icon={CheckCircle2} size="sm" className="text-green-400" aria-hidden={true} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-[var(--foreground-muted)]">
                    Last Processed
                  </div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    {lastProcessedRecipe}
                  </div>
                </div>
              </div>
            )}

            {/* Last Error */}
            {lastError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Icon icon={AlertCircle} size="sm" className="text-red-400" aria-hidden={true} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-red-400">Last Error</div>
                    <div className="mt-1 text-xs text-red-300">{lastError}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
