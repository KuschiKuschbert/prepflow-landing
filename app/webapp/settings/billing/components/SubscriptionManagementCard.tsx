'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

interface SubscriptionManagementCardProps {
  isActive: boolean;
  cancelAtPeriodEnd: boolean;
  extending: boolean;
  cancelling: boolean;
  reactivating: boolean;
  onExtend: () => void;
  onCancel: (immediate: boolean) => void;
  onReactivate: () => void;
}

/**
 * Subscription management card component
 */
export function SubscriptionManagementCard({
  isActive,
  cancelAtPeriodEnd,
  extending,
  cancelling,
  reactivating,
  onExtend,
  onCancel,
  onReactivate,
}: SubscriptionManagementCardProps) {
  if (!isActive) return null;

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription Management</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Extend, cancel, or reactivate your subscription
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {!cancelAtPeriodEnd && (
          <>
            <Button
              onClick={onExtend}
              disabled={extending}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Icon icon={Calendar} size="sm" />
              {extending ? 'Extending...' : 'Extend Subscription'}
            </Button>
            <Button
              onClick={() => onCancel(false)}
              disabled={cancelling}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon icon={XCircle} size="sm" />
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </>
        )}
        {cancelAtPeriodEnd && (
          <Button
            onClick={onReactivate}
            disabled={reactivating}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Icon icon={CheckCircle} size="sm" />
            {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
          </Button>
        )}
      </div>

      {cancelAtPeriodEnd && (
        <p className="text-xs text-[var(--foreground-subtle)]">
          Your subscription is scheduled to cancel. Click &quot;Reactivate&quot; to keep your
          subscription active.
        </p>
      )}
    </div>
  );
}
