import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { formatDate } from '../utils';
import type { SubscriptionData } from '../types';

interface UseBillingCancelProps {
  subscriptionData: SubscriptionData | null;
  refreshSubscription: () => Promise<void>;
}

/**
 * Hook for cancelling subscription
 */
export function useBillingCancel({ subscriptionData, refreshSubscription }: UseBillingCancelProps) {
  const { showError, showSuccess } = useNotification();
  const { showConfirm } = useConfirm();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = useCallback(
    async (immediate: boolean) => {
      const expiresAt = subscriptionData?.subscription.expires_at
        ? new Date(subscriptionData.subscription.expires_at)
        : null;
      const expiresDate = expiresAt
        ? formatDate(subscriptionData!.subscription.expires_at)
        : 'the end of your billing period';

      // Check if user is EU customer (will be updated after API response)
      // For now, show standard message - API will return isEU status
      const confirmed = await showConfirm({
        title: immediate ? 'Cancel Subscription Immediately' : 'Cancel Subscription',
        message: immediate
          ? `Cancel your subscription immediately? You'll lose access right away. This can't be undone.`
          : `Cancel your subscription at the end of your billing period? You'll keep access until ${expiresDate}, then your subscription will be cancelled.`,
        variant: immediate ? 'danger' : 'warning',
        confirmLabel: immediate ? 'Cancel Now' : 'Schedule Cancellation',
        cancelLabel: 'Keep Subscription',
      });

      if (!confirmed) return;

      setCancelling(true);
      try {
        const response = await fetch('/api/billing/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ immediate }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to cancel subscription');
        }

        showSuccess(data.message || 'Subscription cancellation processed');
        await refreshSubscription();
      } catch (error) {
        logger.error('Failed to cancel subscription:', error);
        showError(error instanceof Error ? error.message : 'Failed to cancel subscription');
      } finally {
        setCancelling(false);
      }
    },
    [subscriptionData, showConfirm, showSuccess, showError, refreshSubscription],
  );

  return {
    cancelling,
    handleCancel,
  };
}
