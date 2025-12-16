'use client';

import { Icon } from '@/components/ui/Icon';
import {
  AlertTriangle,
  Thermometer,
  Package,
  BookOpen,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useKitchenAlerts } from './hooks/useKitchenAlerts';

interface Alert {
  id: string;
  type: 'temperature' | 'stock' | 'recipe' | 'compliance' | 'equipment';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

export default function KitchenAlerts() {
  const { alerts, loading } = useKitchenAlerts();

  if (loading) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
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

  if (alerts.length === 0) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="tablet:h-12 tablet:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={AlertCircle} size="md" className="text-[var(--primary)]" aria-hidden={true} />
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

  // Sort alerts by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedAlerts = [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'stock':
        return Package;
      case 'recipe':
        return BookOpen;
      case 'compliance':
        return ClipboardCheck;
      case 'equipment':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-[var(--color-error)]/50',
          bg: 'bg-[var(--color-error)]/10',
          text: 'text-[var(--color-error)]',
          iconBg: 'from-red-500/20 to-red-500/10',
        };
      case 'warning':
        return {
          border: 'border-[var(--color-warning)]/50',
          bg: 'bg-[var(--color-warning)]/10',
          text: 'text-[var(--color-warning)]',
          iconBg: 'from-yellow-500/20 to-yellow-500/10',
        };
      case 'info':
        return {
          border: 'border-[var(--color-info)]/50',
          bg: 'bg-[var(--color-info)]/10',
          text: 'text-[var(--color-info)]',
          iconBg: 'from-blue-500/20 to-blue-500/10',
        };
    }
  };

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
          Kitchen Alerts
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground)]/60">
          Action items requiring attention
        </p>
      </div>

      <div className="tablet:space-y-4 space-y-3">
        {sortedAlerts.map(alert => {
          const colors = getSeverityColor(alert.severity);
          const IconComponent = getIcon(alert.type);

          return (
            <div
              key={alert.id}
              className={`rounded-xl border ${colors.border} ${colors.bg} tablet:rounded-2xl tablet:p-4 p-3`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${colors.iconBg}`}
                >
                  <Icon icon={IconComponent} size="sm" className={colors.text} aria-hidden={true} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3
                      className={`text-fluid-sm tablet:text-fluid-base font-medium ${colors.text}`}
                    >
                      {alert.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                          : alert.severity === 'warning'
                            ? 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]'
                            : 'bg-[var(--color-info)]/20 text-[var(--color-info)]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-[var(--foreground)]/80">
                    {alert.message}
                  </p>
                  <Link
                    href={alert.actionHref}
                    className={`text-fluid-xs tablet:px-4 tablet:py-2 tablet:text-fluid-sm inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      alert.severity === 'critical'
                        ? 'bg-[var(--color-error)]/20 text-[var(--color-error)] hover:bg-[var(--color-error)]/30'
                        : alert.severity === 'warning'
                          ? 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/30'
                          : 'bg-[var(--color-info)]/20 text-[var(--color-info)] hover:bg-[var(--color-info)]/30'
                    }`}
                  >
                    {alert.actionLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
