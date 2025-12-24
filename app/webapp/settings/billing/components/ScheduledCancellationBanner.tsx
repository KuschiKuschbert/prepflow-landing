import { Icon } from '@/components/ui/Icon';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils';

interface ScheduledCancellationBannerProps {
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
  expiresAt: string | null;
}

/**
 * Scheduled cancellation banner component
 */
export function ScheduledCancellationBanner({
  cancelAtPeriodEnd,
  isActive,
  expiresAt,
}: ScheduledCancellationBannerProps) {
  if (!cancelAtPeriodEnd || !isActive) return null;

  return (
    <div className="mb-6 rounded-2xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 p-4">
      <div className="flex items-center gap-3">
        <Icon
          icon={Calendar}
          size="md"
          className="text-[var(--color-warning)]"
          aria-hidden={true}
        />
        <div className="flex-1">
          <p className="font-semibold text-[var(--foreground)]">Cancellation Scheduled</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            Your subscription will be cancelled on{' '}
            {expiresAt ? formatDate(expiresAt) : 'the end of your billing period'}. You can
            reactivate it anytime before then.
          </p>
        </div>
      </div>
    </div>
  );
}
