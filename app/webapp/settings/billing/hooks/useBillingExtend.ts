import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

interface UseBillingExtendProps {
  refreshSubscription: () => Promise<void>;
}

/**
 * Hook for extending subscription
 */
export function useBillingExtend({ refreshSubscription }: UseBillingExtendProps) {
  const { showError, showSuccess } = useNotification();
  const { showConfirm } = useConfirm();
  const [extending, setExtending] = useState(false);

  const handleExtend = useCallback(async () => {
    const confirmed = await showConfirm({
      title: 'Extend Subscription',
      message:
        'Extend your subscription by 1 month? This will add an additional billing period to your current subscription.',
      variant: 'info',
      confirmLabel: 'Extend',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    setExtending(true);
    try {
      const response = await fetch('/api/billing/extend-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to extend subscription');
      }

      showSuccess(data.message || 'Subscription extended successfully');
      await refreshSubscription();
    } catch (error) {
      logger.error('Failed to extend subscription:', error);
      showError(error instanceof Error ? error.message : 'Failed to extend subscription');
    } finally {
      setExtending(false);
    }
  }, [showConfirm, showSuccess, showError, refreshSubscription]);

  return {
    extending,
    handleExtend,
  };
}
