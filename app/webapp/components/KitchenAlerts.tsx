'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle } from 'lucide-react';
import { AlertCard } from './AlertCard';
import { useKitchenAlerts } from './hooks/useKitchenAlerts';

const CONTAINER_CLASSES =
  'tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg';

function LoadingState() {
  return (
    <div className={CONTAINER_CLASSES}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 rounded bg-[var(--surface)]" />
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-[var(--surface)]" />
          <div className="h-16 rounded-xl bg-[var(--surface)]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={CONTAINER_CLASSES}>
      <div className="flex items-center gap-3">
        <div className="tablet:h-12 tablet:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
          <Icon icon={AlertCircle} size="md" className="text-[var(--primary)]" aria-hidden />
        </div>
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
            Kitchen Alerts
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground)]/60">
            All clear! No alerts at this time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function KitchenAlerts() {
  const { alerts, loading } = useKitchenAlerts();

  if (loading) return <LoadingState />;
  if (alerts.length === 0) return <EmptyState />;

  // Sort alerts by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedAlerts = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  return (
    <div className={CONTAINER_CLASSES}>
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
          Kitchen Alerts
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground)]/60">
          Action items requiring attention
        </p>
      </div>

      <div className="tablet:space-y-4 space-y-3">
        {sortedAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
