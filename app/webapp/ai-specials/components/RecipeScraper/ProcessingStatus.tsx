/**
 * Processing Status Component
 * Displays real-time formatting/processing status with diagnostics
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { QuotaWarning } from './ProcessingStatus/components/QuotaWarning';
import { StatusCard } from './ProcessingStatus/components/StatusCard';
import { StatsGrid } from './ProcessingStatus/components/StatsGrid';
import { DiagnosticsPanel } from './ProcessingStatus/components/DiagnosticsPanel';

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
  processingDuration?: number;
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

  return (
    <div className="space-y-4">
      {geminiQuota && !geminiQuota.available && <QuotaWarning geminiQuota={geminiQuota} />}

      <StatusCard
        isProcessing={isProcessing}
        isPaused={isPaused}
        isResuming={isResuming}
        totalProcessed={totalProcessed}
        totalRecipes={totalRecipes}
        progressPercent={progressPercent}
        onPause={onPause}
        onResume={onResume}
      />

      <StatsGrid
        activeProcessing={activeProcessing}
        queueLength={queueLength}
        totalProcessed={totalProcessed}
        totalRecipes={totalRecipes}
      />

      {skippedFormatted !== undefined && skippedFormatted > 0 && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Icon icon={CheckCircle2} size="sm" className="text-green-400" aria-hidden={true} />
            <span>
              <span className="font-semibold text-green-400">
                {skippedFormatted.toLocaleString()}
              </span>{' '}
              recipes already formatted (skipped)
            </span>
          </div>
        </div>
      )}

      <DiagnosticsPanel
        healthStatus={healthStatus}
        processingDuration={processingDuration}
        isStuck={isStuck}
        stuckReason={stuckReason}
        lastProcessedRecipe={lastProcessedRecipe}
        lastError={lastError}
        aiProvider={aiProvider}
        aiProviderModel={aiProviderModel}
      />
    </div>
  );
}
