'use client';

import { AlertCircle, TriangleAlert } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface DashboardErrorAlertProps {
  variant: 'critical' | 'warning';
  title: string;
  message: string;
  retryLabel: string;
  onRetry: () => void;
  disabled: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  critical: {
    icon: AlertCircle,
    borderClass: 'border-[var(--color-error)]/50',
    backgroundClass: 'bg-[var(--color-error)]/10',
    textClass: 'text-[var(--color-error)]',
    buttonClass: 'border-[var(--color-error)]/50 bg-[var(--color-error)]/20 text-[var(--color-error)] hover:bg-[var(--color-error)]/30',
  },
  warning: {
    icon: TriangleAlert,
    borderClass: 'border-[var(--color-warning)]/50',
    backgroundClass: 'bg-[var(--color-warning)]/10',
    textClass: 'text-[var(--color-warning)]',
    buttonClass: 'border-[var(--color-warning)]/50 bg-[var(--color-warning)]/20 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/30',
  },
} as const;

export function DashboardErrorAlert({
  variant,
  title,
  message,
  retryLabel,
  onRetry,
  disabled,
  className = 'mb-4',
}: DashboardErrorAlertProps) {
  const { icon, borderClass, backgroundClass, textClass, buttonClass } = VARIANT_STYLES[variant];

  return (
    <div
      className={`${className} rounded-lg border ${borderClass} ${backgroundClass} px-4 py-3 ${textClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon icon={icon} size="sm" className="flex-shrink-0" aria-hidden={true} />
            <span className="font-medium">{title}</span>
          </div>
          <p className="mt-1 text-sm">{message}</p>
        </div>
        <button
          onClick={onRetry}
          disabled={disabled}
          className={`ml-4 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
          aria-label={retryLabel}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
