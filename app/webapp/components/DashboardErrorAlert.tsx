'use client';

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
    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    borderClass: 'border-red-500/50',
    backgroundClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    buttonClass: 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30',
  },
  warning: {
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
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
  const { iconPath, borderClass, backgroundClass, textClass, buttonClass } =
    VARIANT_STYLES[variant];

  return (
    <div
      className={`${className} rounded-lg border ${borderClass} ${backgroundClass} px-4 py-3 ${textClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
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


