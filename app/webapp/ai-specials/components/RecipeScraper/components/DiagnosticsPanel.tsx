/**
 * Diagnostics Panel Component
 * Displays scraper diagnostics and health information
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { formatDuration } from '../utils/scraper-formatters';
import { getHealthColor, getHealthIcon } from '../utils/health-utils';

interface Diagnostics {
  isStuck: boolean;
  stuckReason?: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  processingDuration?: number;
  lastError?: string;
  lastScrapedRecipe?: string;
}

interface DiagnosticsPanelProps {
  diagnostics: Diagnostics;
}

export function DiagnosticsPanel({ diagnostics }: DiagnosticsPanelProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  return (
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
                    <div className="mt-1 text-xs text-yellow-300">{diagnostics.stuckReason}</div>
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
  );
}
