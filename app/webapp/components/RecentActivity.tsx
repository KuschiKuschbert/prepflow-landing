'use client';

import { ApiErrorDisplay } from '@/components/ui/ApiErrorDisplay';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { Clock, RefreshCw } from 'lucide-react';
import { useRecentActivity } from './hooks/useRecentActivity';
import { RecentActivityItem } from './RecentActivityItem';

function RecentActivityContent() {
  const { activities, loading, error, refetch } = useRecentActivity();

  // Show loading state only if we have no data and are loading
  if (loading && !activities) {
    return (
      <div className="glass-surface rounded-3xl border border-[var(--border)]/30 p-6 shadow-lg">
        <LoadingSkeleton variant="list" count={5} height="64px" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <ApiErrorDisplay
        error={ApiErrorHandler.createError(error)}
        context="Recent Activity"
        onRetry={refetch}
        className="glass-surface rounded-3xl border border-[var(--border)]/30 p-6 shadow-lg"
      />
    );
  }

  // Show empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="glass-surface rounded-3xl border border-[var(--border)]/30 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
            <Icon
              icon={Clock}
              size="lg"
              className="text-[var(--button-active-text)]"
              aria-hidden={true}
            />
          </div>
        </div>

        <h2 className="text-fluid-xl mb-2 text-center font-semibold text-[var(--foreground)]">
          No Recent Activity
        </h2>

        <p className="text-fluid-sm text-center text-[var(--foreground)]/60">
          Start by adding some ingredients or recipes to see recent activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="tablet:rounded-3xl tablet:p-6 glass-surface rounded-2xl border border-[var(--border)]/30 p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
          Recent Activity
        </h2>

        <button
          onClick={refetch}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--primary)] transition-colors duration-200 hover:text-[var(--accent)]"
          title="Refresh activity"
          aria-label="Refresh activity"
        >
          <Icon icon={RefreshCw} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        </button>
      </div>

      <div className="tablet:space-y-4 space-y-3">
        {activities.slice(0, 5).map(activity => (
          <RecentActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default function RecentActivity() {
  return (
    <ErrorBoundary>
      <RecentActivityContent />
    </ErrorBoundary>
  );
}
