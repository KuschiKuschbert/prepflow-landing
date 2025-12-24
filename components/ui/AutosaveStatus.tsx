'use client';

import React from 'react';
import { SaveStatus } from '@/hooks/useAutosave';

interface AutosaveStatusProps {
  status: SaveStatus;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  position?: 'top-right' | 'inline';
}

export function AutosaveStatus({
  status,
  error,
  onRetry,
  className = '',
  position = 'inline',
}: AutosaveStatusProps) {
  if (status === 'idle' && !error) {
    return null;
  }

  const containerClasses =
    position === 'top-right'
      ? `fixed top-20 right-4 z-50 ${className}`
      : `inline-flex items-center ${className}`;

  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={`Autosave status: ${status}`}
    >
      {status === 'saving' && (
        <div className="text-fluid-sm flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-[var(--foreground-secondary)]">
          <svg
            className="h-4 w-4 animate-spin text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Saving...</span>
        </div>
      )}

      {status === 'saved' && (
        <div className="text-fluid-sm flex items-center gap-2 rounded-lg bg-[var(--color-success)]/10 px-3 py-1.5 text-[var(--color-success)]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Saved</span>
        </div>
      )}

      {status === 'error' && (
        <div className="text-fluid-sm flex items-center gap-2 rounded-lg bg-[var(--color-error)]/10 px-3 py-1.5 text-[var(--color-error)]">
          <svg
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="mr-2 max-w-md truncate" title={error || 'Save failed'}>
            {error || 'Save failed'}
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-fluid-xs flex-shrink-0 rounded px-2 py-0.5 font-medium hover:bg-[var(--color-error)]/20 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
              aria-label="Retry save"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
