'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Settings, Link2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { ConnectionWorkflow } from './ConnectionWorkflow';
import { useSquareStatus } from '../../hooks/useSquareStatus';

// Memoized StatusCard component to prevent re-creation on every render
const StatusCard = ({
  title,
  value,
  icon: IconComponent,
  color,
}: {
  title: string;
  value: string | React.ReactNode;
  icon: typeof CheckCircle2;
  color: string;
}) => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <div className="flex items-center gap-3">
      <Icon icon={IconComponent} size="md" className={color} />
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--foreground-muted)]">{title}</p>
        <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  </div>
);

export function OverviewSection() {
  const { status, loading, error } = useSquareStatus();
  const { showError } = useNotification();

  // Memoize status cards to prevent unnecessary re-renders
  const statusCards = useMemo(() => {
    if (!status) return null;

    return (
      <>
        <StatusCard
          title="Connection Status"
          value={status.configured && status.credentialsValid ? 'Connected' : 'Not Connected'}
          icon={status.configured && status.credentialsValid ? CheckCircle2 : XCircle}
          color={
            status.configured && status.credentialsValid ? 'text-green-400' : 'text-red-400'
          }
        />
        <StatusCard
          title="Environment"
          value={status.config?.square_environment === 'production' ? 'Production' : 'Sandbox'}
          icon={Settings}
          color="text-[var(--primary)]"
        />
        <StatusCard
          title="Initial Sync"
          value={status.config?.initial_sync_completed ? 'Completed' : 'Pending'}
          icon={status.config?.initial_sync_completed ? CheckCircle2 : AlertCircle}
          color={status.config?.initial_sync_completed ? 'text-green-400' : 'text-yellow-400'}
        />
        <StatusCard
          title="Auto Sync"
          value={status.config?.auto_sync_enabled ? 'Enabled' : 'Disabled'}
          icon={RefreshCw}
          color={status.config?.auto_sync_enabled ? 'text-green-400' : 'text-gray-400'}
        />
        <StatusCard
          title="Recent Errors"
          value={status.errorCount}
          icon={AlertCircle}
          color={status.errorCount > 0 ? 'text-red-400' : 'text-green-400'}
        />
        <StatusCard
          title="Last Sync"
          value={
            status.config?.last_full_sync_at
              ? new Date(status.config.last_full_sync_at).toLocaleDateString()
              : 'Never'
          }
          icon={RefreshCw}
          color="text-[var(--primary)]"
        />
      </>
    );
  }, [status]);

  if (loading) {
    return <LoadingSkeleton variant="card" className="h-64" />;
  }

  if (error || !status) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <Icon icon={AlertCircle} size="lg" className="mx-auto mb-4 text-[var(--foreground-muted)]" />
        <p className="text-[var(--foreground-muted)]">{error || 'Failed to load Square status'}</p>
      </div>
    );
  }

  // Show connection workflow if not connected
  if (!status.configured || !status.credentialsValid) {
    return (
      <div className="space-y-6">
        <ConnectionWorkflow
          onConnectClick={() => {
            // Navigate to configuration section
            window.location.hash = '#configuration';
            setTimeout(() => {
              const element = document.querySelector('#square-credentials');
              if (element) {
                const headerHeight = window.innerWidth >= 1025 ? 64 : 56;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 20;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }, 300);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Overview</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Monitor your Square POS integration status and recent activity
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {statusCards}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
          <a
            href="#configuration"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--surface-variant)]"
          >
            <Icon icon={Settings} size="sm" className="text-[var(--primary)]" />
            <span className="font-medium text-[var(--foreground)]">Configure Connection</span>
          </a>
          <a
            href="#sync"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--surface-variant)]"
          >
            <Icon icon={RefreshCw} size="sm" className="text-[var(--primary)]" />
            <span className="font-medium text-[var(--foreground)]">Manual Sync</span>
          </a>
          <a
            href="#mappings"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--surface-variant)]"
          >
            <Icon icon={Link2} size="sm" className="text-[var(--primary)]" />
            <span className="font-medium text-[var(--foreground)]">View Mappings</span>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      {status.recentSyncs && status.recentSyncs.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Recent Activity</h3>
          <div className="space-y-2">
            {status.recentSyncs.slice(0, 5).map((sync: any) => (
              <div
                key={sync.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{sync.operation_type}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {new Date(sync.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    sync.status === 'success'
                      ? 'bg-green-500/10 text-green-400'
                      : sync.status === 'error'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  {sync.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
