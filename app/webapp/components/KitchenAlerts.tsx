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
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[#2a2a2a]" />
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-[#2a2a2a]" />
            <div className="h-16 rounded-xl bg-[#2a2a2a]" />
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="tablet:h-12 tablet:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <Icon icon={AlertCircle} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
          <div>
            <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
              Kitchen Alerts
            </h2>
            <p className="text-fluid-xs tablet:text-fluid-sm text-gray-400">
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
          border: 'border-red-500/50',
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          iconBg: 'from-red-500/20 to-red-500/10',
        };
      case 'warning':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-400',
          iconBg: 'from-yellow-500/20 to-yellow-500/10',
        };
      case 'info':
        return {
          border: 'border-blue-500/50',
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          iconBg: 'from-blue-500/20 to-blue-500/10',
        };
    }
  };

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
          Kitchen Alerts
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-gray-400">
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
                          ? 'bg-red-500/20 text-red-400'
                          : alert.severity === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-gray-300">
                    {alert.message}
                  </p>
                  <Link
                    href={alert.actionHref}
                    className={`text-fluid-xs tablet:px-4 tablet:py-2 tablet:text-fluid-sm inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : alert.severity === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
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
