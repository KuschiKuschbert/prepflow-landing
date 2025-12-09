import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { TierSlug } from '@/lib/tier-config';

/**
 * Hook for billing upgrade actions
 */
export function useBillingUpgrade() {
  const { showError } = useNotification();

  const handleUpgrade = useCallback(
    async (tier: TierSlug) => {
      try {
        const response = await fetch('/api/billing/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to create checkout session');
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        logger.error('Failed to upgrade:', error);
        showError(error instanceof Error ? error.message : 'Failed to upgrade subscription');
      }
    },
    [showError],
  );

  return {
    handleUpgrade,
  };
}
