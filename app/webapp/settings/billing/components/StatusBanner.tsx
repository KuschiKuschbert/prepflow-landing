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
          ? 'border-yellow-500/30 bg-yellow-500/10'
          : isCancelled
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-blue-500/30 bg-blue-500/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          icon={isPastDue || isCancelled ? AlertCircle : CheckCircle}
          size="md"
          className={isPastDue ? 'text-yellow-400' : isCancelled ? 'text-red-400' : 'text-blue-400'}
          aria-hidden={true}
        />
        <div className="flex-1">
          <p className="font-semibold text-white">
            {isPastDue ? 'Payment Failed' : isCancelled ? 'Subscription Cancelled' : 'Trial Period'}
          </p>
          <p className="text-sm text-gray-300">
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
