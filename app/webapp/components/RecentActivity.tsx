'use client';

import { ApiErrorDisplay } from '@/components/ui/ApiErrorDisplay';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { Clock, RefreshCw } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { useRecentActivity } from './hooks/useRecentActivity';
import { RecentActivityItem } from './RecentActivityItem';

function RecentActivityContent() {
  const { activities, loading, error, refetch } = useRecentActivity();

  // Show loading state only if we have no data and are loading
  if (loading && !activities) {
    return (
      <DashboardWidget title="Recent Activity" icon={Clock} className="h-full">
        <LoadingSkeleton variant="list" count={5} height="64px" />
      </DashboardWidget>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardWidget title="Recent Activity" icon={Clock} className="h-full">
        <ApiErrorDisplay
          error={ApiErrorHandler.createError(error)}
          context="Recent Activity"
          onRetry={refetch}
          className="p-1"
        />
      </DashboardWidget>
    );
  }

  // Show empty state
  if (!activities || activities.length === 0) {
    return (
      <DashboardWidget title="Recent Activity" icon={Clock} className="h-full">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
            <Icon
              icon={Clock}
              size="lg"
              className="text-[var(--button-active-text)]"
              aria-hidden={true}
            />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
            No Recent Activity
          </h2>
          <p className="text-sm text-[var(--foreground-subtle)]">
            Start by adding some ingredients or recipes to see recent activity here.
          </p>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      title="Recent Activity"
      icon={Clock}
      className="h-full"
      headerAction={
        <button
          onClick={refetch}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--primary)] transition-all hover:bg-[var(--surface-hover)] active:scale-95"
          title="Refresh activity"
          aria-label="Refresh activity"
        >
          <Icon icon={RefreshCw} size="sm" className={loading ? 'animate-spin' : ''} />
        </button>
      }
    >
      <div className="space-y-4">
        {activities.slice(0, 5).map(activity => (
          <RecentActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </DashboardWidget>
  );
}

export default function RecentActivity() {
  return (
    <ErrorBoundary>
      <RecentActivityContent />
    </ErrorBoundary>
  );
}
