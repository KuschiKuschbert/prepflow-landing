'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

/**
 * Component for displaying error banner
 */
export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-4 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
      <div className="flex items-start gap-3">
        <Icon icon={AlertCircle} size="md" className="mt-0.5 text-[var(--color-error)]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-error)]">{error}</p>
          <button
            onClick={onRetry}
            className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-error)]/30 bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/30"
          >
            <Icon icon={RefreshCw} size="xs" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
