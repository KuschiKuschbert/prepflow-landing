import { Icon } from '@/components/ui/Icon';
import { CheckCircle } from 'lucide-react';
import { formatDate } from '../utils';
import type { SubscriptionData } from '../types';

interface CurrentPlanCardProps {
  subscriptionData: SubscriptionData;
}

/**
 * Current plan card component
 */
export function CurrentPlanCard({ subscriptionData }: CurrentPlanCardProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Current Plan</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Your active subscription details
        </p>
      </div>

      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <p className="text-xs text-[var(--foreground-subtle)]">Plan</p>
          <p className="text-lg font-semibold text-[var(--foreground)] capitalize">
            {subscriptionData.subscription.tier}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <p className="text-xs text-[var(--foreground-subtle)]">Status</p>
          <div className="flex items-center gap-2">
            <Icon
              icon={CheckCircle}
              size="sm"
              className={
                subscriptionData.subscription.status === 'active'
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-warning)]'
              }
              aria-hidden={true}
            />
            <p className="text-lg font-semibold text-[var(--foreground)] capitalize">
              {subscriptionData.subscription.status}
            </p>
          </div>
        </div>
        {subscriptionData.subscription.expires_at && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
            <p className="text-xs text-[var(--foreground-subtle)]">Renewal Date</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {formatDate(subscriptionData.subscription.expires_at)}
            </p>
          </div>
        )}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4">
          <p className="text-xs text-[var(--foreground-subtle)]">Member Since</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatDate(subscriptionData.subscription.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
