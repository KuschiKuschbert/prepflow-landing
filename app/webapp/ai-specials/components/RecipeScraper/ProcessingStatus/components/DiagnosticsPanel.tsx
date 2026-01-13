/**
 * Diagnostics Panel Component
 * Displays processing diagnostics and health information
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { formatDuration, getHealthColor, getHealthIcon } from '../utils';

interface DiagnosticsPanelProps {
  healthStatus?: 'healthy' | 'warning' | 'error';
  processingDuration?: number;
  isStuck?: boolean;
  stuckReason?: string;
  lastProcessedRecipe?: string;
  lastError?: string;
  aiProvider?: string;
  aiProviderModel?: string;
}

export function DiagnosticsPanel({
  healthStatus,
  processingDuration,
  isStuck,
  stuckReason,
  lastProcessedRecipe,
  lastError,
  aiProvider,
  aiProviderModel,
}: DiagnosticsPanelProps) {
  const HealthIcon = getHealthIcon(healthStatus);

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      {healthStatus && (
        <div className="flex items-center gap-3">
          <Icon
            icon={HealthIcon}
            size="sm"
            className={getHealthColor(healthStatus)}
            aria-hidden={true}
          />
          <div className="flex-1">
            <div className="text-xs font-medium text-[var(--foreground-muted)]">Health Status</div>
            <div className={`text-sm font-semibold ${getHealthColor(healthStatus)}`}>
              {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
            </div>
          </div>
        </div>
      )}

      {processingDuration !== undefined && (
        <div className="flex items-center gap-3">
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

      {isStuck && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
          <div className="flex items-start gap-2">
            <Icon icon={AlertTriangle} size="sm" className="text-yellow-400" aria-hidden={true} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-yellow-400">Processing Stuck</div>
              {stuckReason && <div className="mt-1 text-xs text-yellow-300">{stuckReason}</div>}
            </div>
          </div>
        </div>
      )}

      {lastProcessedRecipe && (
        <div className="flex items-center gap-3">
          <Icon icon={CheckCircle2} size="sm" className="text-green-400" aria-hidden={true} />
          <div className="flex-1">
            <div className="text-xs font-medium text-[var(--foreground-muted)]">Last Processed</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              {lastProcessedRecipe}
            </div>
          </div>
        </div>
      )}

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

      {aiProvider && (
        <div className="flex items-center gap-3">
          <Icon icon={CheckCircle2} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          <div className="flex-1">
            <div className="text-xs font-medium text-[var(--foreground-muted)]">AI Provider</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              {aiProvider} {aiProviderModel && `(${aiProviderModel})`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
