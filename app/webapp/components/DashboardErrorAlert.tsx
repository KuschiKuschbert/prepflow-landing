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
    borderClass: 'border-red-500/50',
    backgroundClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    buttonClass: 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30',
  },
  warning: {
    icon: TriangleAlert,
    borderClass: 'border-yellow-500/50',
    backgroundClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-400',
    buttonClass: 'border-yellow-500/50 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30',
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
  const { icon, borderClass, backgroundClass, textClass, buttonClass } =
    VARIANT_STYLES[variant];

  return (
    <div
      className={`${className} rounded-lg border ${borderClass} ${backgroundClass} px-4 py-3 ${textClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon icon={icon} size="sm" className="flex-shrink-0" aria-hidden="true" />
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
