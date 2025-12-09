import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

interface UseBillingReactivateProps {
  refreshSubscription: () => Promise<void>;
}

/**
 * Hook for reactivating subscription
 */
export function useBillingReactivate({ refreshSubscription }: UseBillingReactivateProps) {
  const { showError, showSuccess } = useNotification();
  const { showConfirm } = useConfirm();
  const [reactivating, setReactivating] = useState(false);

  const handleReactivate = useCallback(async () => {
    const confirmed = await showConfirm({
      title: 'Reactivate Subscription',
      message:
        "Reactivate your subscription? Your subscription will continue as normal and you won't lose access.",
      variant: 'info',
      confirmLabel: 'Reactivate',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    setReactivating(true);
    try {
      const response = await fetch('/api/billing/reactivate-subscription', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to reactivate subscription');
      }

      showSuccess(data.message || 'Subscription reactivated successfully');
      await refreshSubscription();
    } catch (error) {
      logger.error('Failed to reactivate subscription:', error);
      showError(error instanceof Error ? error.message : 'Failed to reactivate subscription');
    } finally {
      setReactivating(false);
    }
  }, [showConfirm, showSuccess, showError, refreshSubscription]);

  return {
    reactivating,
    handleReactivate,
  };
}
