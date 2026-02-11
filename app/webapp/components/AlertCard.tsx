'use client';

import { Icon } from '@/components/ui/Icon';
import {
    AlertTriangle,
    BookOpen,
    ClipboardCheck,
    LucideIcon,
    Package,
    Thermometer,
} from 'lucide-react';
import Link from 'next/link';

interface Alert {
  id: string;
  type: 'temperature' | 'stock' | 'recipe' | 'compliance' | 'equipment';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

interface AlertCardProps {
  alert: Alert;
}

const ALERT_ICONS: Record<Alert['type'], LucideIcon> = {
  temperature: Thermometer,
  stock: Package,
  recipe: BookOpen,
  compliance: ClipboardCheck,
  equipment: AlertTriangle,
};

const SEVERITY_STYLES = {
  critical: {
    border: 'border-[var(--color-error)]/50',
    bg: 'bg-[var(--color-error)]/10',
    text: 'text-[var(--color-error)]',
    iconBg: 'from-red-500/20 to-red-500/10',
    badge: 'bg-[var(--color-error)]/20 text-[var(--color-error)]',
    action: 'bg-[var(--color-error)]/20 text-[var(--color-error)] hover:bg-[var(--color-error)]/30',
  },
  warning: {
    border: 'border-[var(--color-warning)]/50',
    bg: 'bg-[var(--color-warning)]/10',
    text: 'text-[var(--color-warning)]',
    iconBg: 'from-yellow-500/20 to-yellow-500/10',
    badge: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
    action:
      'bg-[var(--color-warning)]/20 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/30',
  },
  info: {
    border: 'border-[var(--color-info)]/50',
    bg: 'bg-[var(--color-info)]/10',
    text: 'text-[var(--color-info)]',
    iconBg: 'from-blue-500/20 to-blue-500/10',
    badge: 'bg-[var(--color-info)]/20 text-[var(--color-info)]',
    action: 'bg-[var(--color-info)]/20 text-[var(--color-info)] hover:bg-[var(--color-info)]/30',
  },
} as const;

/** Renders a single alert card */
export function AlertCard({ alert }: AlertCardProps) {
  const styles = SEVERITY_STYLES[alert.severity];
  const IconComponent = ALERT_ICONS[alert.type] || AlertTriangle;

  return (
    <div
      className={`relative overflow-hidden rounded-xl glass-panel border border-[var(--border)]/30 tablet:rounded-2xl tablet:p-4 p-3 transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-lg`}
    >
      {/* Background glow based on severity */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${styles.iconBg} opacity-5`} />
      <div className="flex items-start gap-3">
        <div
          className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${styles.iconBg}`}
        >
          <Icon icon={IconComponent} size="sm" className={styles.text} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className={`text-fluid-sm tablet:text-fluid-base font-medium ${styles.text}`}>
              {alert.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${styles.badge}`}
            >
              {alert.severity}
            </span>
          </div>
          <p className="text-fluid-xs tablet:text-fluid-sm mb-3 text-[var(--foreground-secondary)]">
            {alert.message}
          </p>
          <Link
            href={alert.actionHref}
            className={`text-fluid-xs tablet:px-4 tablet:py-2 tablet:text-fluid-sm inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition-colors ${styles.action}`}
          >
            {alert.actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
