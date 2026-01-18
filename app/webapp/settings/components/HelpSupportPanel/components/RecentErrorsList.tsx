'use client';
import type { UserError } from '../types';
import { SEVERITY_COLORS } from '../constants';
import { formatRelativeTime } from '../utils/formatRelativeTime';

interface RecentErrorsListProps {
  errors: UserError[];
  loading: boolean;
  onReportError: (error: UserError) => void;
}

/**
 * Recent errors list component
 */
export function RecentErrorsList({ errors, loading, onReportError }: RecentErrorsListProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
        <div className="animate-pulse text-sm text-[var(--foreground-muted)]">
          Loading errors...
        </div>
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">No recent errors. Great job!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {errors.map(error => (
        <div
          key={error.id}
          className="flex items-start justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 transition-colors hover:bg-[var(--muted)]/40"
        >
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${SEVERITY_COLORS[error.severity] || SEVERITY_COLORS.medium}`}
              >
                {error.severity}
              </span>
              <span className="text-xs text-[var(--foreground-subtle)]">
                {formatRelativeTime(error.created_at)}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-[var(--foreground-secondary)]">
              {error.error_message.length > 100
                ? `${error.error_message.substring(0, 100)}...`
                : error.error_message}
            </p>
          </div>
          <button
            onClick={() => onReportError(error)}
            className="ml-4 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--button-active-text)] transition-opacity hover:opacity-90"
          >
            Report
          </button>
        </div>
      ))}
    </div>
  );
}
