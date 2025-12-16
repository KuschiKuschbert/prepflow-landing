import { Icon } from '@/components/ui/Icon';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface StatusBannerProps {
  isActive: boolean;
  isPastDue: boolean;
  isCancelled: boolean;
}

/**
 * Status banner component for subscription status
 */
export function StatusBanner({ isActive, isPastDue, isCancelled }: StatusBannerProps) {
  if (isActive) return null;

  return (
    <div
      className={`mb-6 rounded-2xl border p-4 ${
        isPastDue
          ? 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10'
          : isCancelled
            ? 'border-[var(--color-error)]/30 bg-[var(--color-error)]/10'
            : 'border-[var(--color-info)]/30 bg-[var(--color-info)]/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          icon={isPastDue || isCancelled ? AlertCircle : CheckCircle}
          size="md"
          className={isPastDue ? 'text-[var(--color-warning)]' : isCancelled ? 'text-[var(--color-error)]' : 'text-[var(--color-info)]'}
          aria-hidden={true}
        />
        <div className="flex-1">
          <p className="font-semibold text-[var(--foreground)]">
            {isPastDue ? 'Payment Failed' : isCancelled ? 'Subscription Cancelled' : 'Trial Period'}
          </p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {isPastDue
              ? 'Your payment failed. Please update your payment method to continue using PrepFlow.'
              : isCancelled
                ? 'Your subscription has been cancelled. You can reactivate it below.'
                : "You're currently on a trial period."}
          </p>
        </div>
      </div>
    </div>
  );
}
