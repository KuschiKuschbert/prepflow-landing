'use client';

import { useSubscriptionData } from './hooks/useSubscriptionData';
import { useBillingPortal } from './hooks/useBillingPortal';
import { useBillingUpgrade } from './hooks/useBillingUpgrade';
import { useBillingExtend } from './hooks/useBillingExtend';
import { useBillingCancel } from './hooks/useBillingCancel';
import { useBillingReactivate } from './hooks/useBillingReactivate';
import { useConfirm } from '@/hooks/useConfirm';
import { StatusBanner } from './components/StatusBanner';
import { ScheduledCancellationBanner } from './components/ScheduledCancellationBanner';
import { CurrentPlanCard } from './components/CurrentPlanCard';
import { UsageMetricsCard } from './components/UsageMetricsCard';
import { TierComparisonCard } from './components/TierComparisonCard';
import { SubscriptionManagementCard } from './components/SubscriptionManagementCard';
import { ReactivateCancelledCard } from './components/ReactivateCancelledCard';
import { BillingActionsCard } from './components/BillingActionsCard';

export default function BillingSettingsPage() {
  const { loading, subscriptionData, refreshSubscription } = useSubscriptionData();

  const { showConfirm, ConfirmDialog } = useConfirm();
  const { openingPortal, handleOpenPortal } = useBillingPortal();
  const { handleUpgrade } = useBillingUpgrade();
  const { extending, handleExtend } = useBillingExtend({ refreshSubscription });
  const { cancelling, handleCancel } = useBillingCancel({
    subscriptionData,
    refreshSubscription,
  });
  const { reactivating, handleReactivate } = useBillingReactivate({ refreshSubscription });

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-[var(--foreground)]">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--muted)]" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  const status = subscriptionData?.subscription.status || 'trial';
  const cancelAtPeriodEnd = subscriptionData?.subscription.cancel_at_period_end || false;
  const isActive = status === 'active';
  const isCancelled = status === 'cancelled';
  const isPastDue = status === 'past_due';

  return (
    <>
      <ConfirmDialog />
      <div className="mx-auto max-w-3xl p-6 text-[var(--foreground)]">
        <h1 className="mb-4 text-3xl font-bold">Billing & Subscription</h1>

        <StatusBanner isActive={isActive} isPastDue={isPastDue} isCancelled={isCancelled} />

        <ScheduledCancellationBanner
          cancelAtPeriodEnd={cancelAtPeriodEnd}
          isActive={isActive}
          expiresAt={subscriptionData?.subscription.expires_at || null}
        />

        {subscriptionData && (
          <>
            <CurrentPlanCard subscriptionData={subscriptionData} />

            <UsageMetricsCard subscriptionData={subscriptionData} />

            <TierComparisonCard subscriptionData={subscriptionData} onUpgrade={handleUpgrade} />

            <SubscriptionManagementCard
              isActive={isActive}
              cancelAtPeriodEnd={cancelAtPeriodEnd}
              extending={extending}
              cancelling={cancelling}
              reactivating={reactivating}
              onExtend={handleExtend}
              onCancel={handleCancel}
              onReactivate={handleReactivate}
            />

            <ReactivateCancelledCard
              isCancelled={isCancelled}
              cancelAtPeriodEnd={cancelAtPeriodEnd}
              reactivating={reactivating}
              onReactivate={handleReactivate}
            />

            <BillingActionsCard openingPortal={openingPortal} onOpenPortal={handleOpenPortal} />
          </>
        )}
      </div>
    </>
  );
}
