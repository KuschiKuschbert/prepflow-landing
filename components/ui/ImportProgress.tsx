'use client';

import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ImportProgressState {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  currentItem?: string;
  errors?: Array<{ row: number; error: string }>;
  isComplete: boolean;
}

interface ImportProgressProps {
  progress: ImportProgressState;
  onCancel?: () => void;
  title?: string;
}

/**
 * Import progress indicator component
 * Shows progress bar, current item, and error summary
 *
 * @component
 * @param {ImportProgressProps} props - Component props
 * @returns {JSX.Element} Import progress component
 *
 * @example
 * ```tsx
 * <ImportProgress
 *   progress={{
 *     total: 100,
 *     processed: 50,
 *     successful: 45,
 *     failed: 5,
 *     currentItem: "Ingredient 50",
 *     isComplete: false
 *   }}
 *   onCancel={() => setIsImporting(false)}
 * />
 * ```
 */
export function ImportProgress({
  progress,
  onCancel,
  title = 'Importing...',
}: ImportProgressProps) {
  const progressPercent = progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new errors appear
  useEffect(() => {
    if (progressRef.current && progress.errors && progress.errors.length > 0) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight;
    }
  }, [progress.errors]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        {onCancel && !progress.isComplete && (
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Cancel import"
          >
            <Icon icon={X} size="sm" aria-hidden={true} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--foreground-secondary)]">
            {progress.processed} of {progress.total} processed
          </span>
          <span className="text-[var(--foreground-muted)]">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--tertiary)] to-[var(--accent)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Item */}
      {progress.currentItem && !progress.isComplete && (
        <div className="mb-4 text-sm text-[var(--foreground-muted)]">
          <span className="font-medium">Processing:</span> {progress.currentItem}
        </div>
      )}

      {/* Status Summary */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-[var(--muted)]/50 p-3">
          <div className="text-2xl font-bold text-[var(--foreground)]">{progress.processed}</div>
          <div className="text-xs text-[var(--foreground-muted)]">Processed</div>
        </div>
        <div className="rounded-lg bg-[var(--color-success)]/10 p-3">
          <div className="flex items-center gap-1.5">
            <Icon
              icon={CheckCircle2}
              size="sm"
              className="text-[var(--color-success)]"
              aria-hidden={true}
            />
            <span className="text-2xl font-bold text-[var(--color-success)]">
              {progress.successful}
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)]">Successful</div>
        </div>
        {progress.failed > 0 && (
          <div className="rounded-lg bg-[var(--color-error)]/10 p-3">
            <div className="flex items-center gap-1.5">
              <Icon
                icon={AlertCircle}
                size="sm"
                className="text-[var(--color-error)]"
                aria-hidden={true}
              />
              <span className="text-2xl font-bold text-[var(--color-error)]">
                {progress.failed}
              </span>
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">Failed</div>
          </div>
        )}
      </div>

      {/* Errors List */}
      {progress.errors && progress.errors.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-error)]">
            <Icon icon={AlertCircle} size="sm" aria-hidden={true} />
            <span>Errors ({progress.errors.length})</span>
          </div>
          <div
            ref={progressRef}
            className="max-h-40 overflow-y-auto rounded-lg bg-[var(--muted)]/50 p-3"
          >
            <div className="space-y-1 text-xs">
              {progress.errors.map((error, index) => (
                <div key={index} className="text-[var(--color-error)]">
                  <span className="font-medium">Row {error.row}:</span> {error.error}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {progress.isComplete && (
        <div className="mt-4 rounded-lg bg-[var(--color-success)]/10 p-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
            <Icon icon={CheckCircle2} size="sm" aria-hidden={true} />
            <span className="font-medium">
              Import complete! {progress.successful} items imported successfully.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
