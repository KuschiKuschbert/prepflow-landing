'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle } from 'lucide-react';
import { AlertCard } from './AlertCard';
import { DashboardWidget } from './DashboardWidget';
import { useKitchenAlerts } from './hooks/useKitchenAlerts';

function LoadingState() {
  return (
    <DashboardWidget title="Kitchen Alerts" icon={AlertCircle} className="h-full">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 rounded bg-[var(--muted)]" />
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-[var(--muted)]/50" />
          <div className="h-16 rounded-xl bg-[var(--muted)]/50" />
        </div>
      </div>
    </DashboardWidget>
  );
}

export default function KitchenAlerts() {
  const { alerts, loading } = useKitchenAlerts();

  if (loading) return <LoadingState />;
  if (alerts.length === 0) {
    return (
      <DashboardWidget title="Kitchen Alerts" icon={AlertCircle} className="h-full">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={AlertCircle} size="md" className="text-[var(--primary)]" aria-hidden />
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]">No active alerts</p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            All clear! Kitchen is running smoothly.
          </p>
        </div>
      </DashboardWidget>
    );
  }

  // Sort alerts by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedAlerts = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  return (
    <DashboardWidget title="Kitchen Alerts" icon={AlertCircle} className="h-full">
      <div className="tablet:space-y-4 space-y-3">
        {sortedAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </DashboardWidget>
  );
}
