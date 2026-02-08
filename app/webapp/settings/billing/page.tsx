'use client';

import { useConfirm } from '@/hooks/useConfirm';
import { BillingActionsCard } from './components/BillingActionsCard';
import { CurrentPlanCard } from './components/CurrentPlanCard';
import { ReactivateCancelledCard } from './components/ReactivateCancelledCard';
import { ScheduledCancellationBanner } from './components/ScheduledCancellationBanner';
import { StatusBanner } from './components/StatusBanner';
import { SubscriptionManagementCard } from './components/SubscriptionManagementCard';
import { TierComparisonCard } from './components/TierComparisonCard';
import { UsageMetricsCard } from './components/UsageMetricsCard';
import { useBillingCancel } from './hooks/useBillingCancel';
import { useBillingExtend } from './hooks/useBillingExtend';
import { useBillingPortal } from './hooks/useBillingPortal';
import { useBillingReactivate } from './hooks/useBillingReactivate';
import { useBillingUpgrade } from './hooks/useBillingUpgrade';
import { useSubscriptionData } from './hooks/useSubscriptionData';

export default function BillingSettingsPage() {
  const { loading, subscriptionData, refreshSubscription } = useSubscriptionData();

  const { showConfirm: _showConfirm, ConfirmDialog } = useConfirm();
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
      <div className="large-desktop:max-w-[1400px] mx-auto max-w-[1400px] p-6 text-[var(--foreground)] xl:max-w-[1400px] 2xl:max-w-[1600px]">
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
      <div className="large-desktop:max-w-[1400px] mx-auto max-w-[1400px] p-6 text-[var(--foreground)] xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <h1 className="text-fluid-xl tablet:text-fluid-2xl mb-4 font-bold">
          Billing & Subscription
        </h1>

        <StatusBanner isActive={isActive} isPastDue={isPastDue} isCancelled={isCancelled} />

        <ScheduledCancellationBanner
          cancelAtPeriodEnd={cancelAtPeriodEnd}
          isActive={isActive}
          expiresAt={subscriptionData?.subscription.expires_at || null}
        />

        {subscriptionData && (
          <SubscriptionDetails
            subscriptionData={subscriptionData}
            isActive={isActive}
            isCancelled={isCancelled}
            cancelAtPeriodEnd={cancelAtPeriodEnd}
            extending={extending}
            cancelling={cancelling}
            reactivating={reactivating}
            openingPortal={openingPortal}
            onUpgrade={handleUpgrade}
            onExtend={handleExtend}
            onCancel={handleCancel}
            onReactivate={handleReactivate}
            onOpenPortal={handleOpenPortal}
          />
        )}
      </div>
    </>
  );
}

function SubscriptionDetails({
  subscriptionData,
  isActive,
  isCancelled,
  cancelAtPeriodEnd,
  extending,
  cancelling,
  reactivating,
  openingPortal,
  onUpgrade,
  onExtend,
  onCancel,
  onReactivate,
  onOpenPortal,
}: any) {
  return (
    <>
      <CurrentPlanCard subscriptionData={subscriptionData} />

      <UsageMetricsCard subscriptionData={subscriptionData} />

      <TierComparisonCard subscriptionData={subscriptionData} onUpgrade={onUpgrade} />

      <SubscriptionManagementCard
        isActive={isActive}
        cancelAtPeriodEnd={cancelAtPeriodEnd}
        extending={extending}
        cancelling={cancelling}
        reactivating={reactivating}
        onExtend={onExtend}
        onCancel={onCancel}
        onReactivate={onReactivate}
      />

      <ReactivateCancelledCard
        isCancelled={isCancelled}
        cancelAtPeriodEnd={cancelAtPeriodEnd}
        reactivating={reactivating}
        onReactivate={onReactivate}
      />

      <BillingActionsCard openingPortal={openingPortal} onOpenPortal={onOpenPortal} />
    </>
  );
}
