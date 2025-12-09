import { useEffect, useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { SubscriptionData } from '../types';

/**
 * Hook for fetching and managing subscription data
 */
export function useSubscriptionData() {
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  const refreshSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      logger.error('Failed to refresh subscription:', error);
    }
  };

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (!response.ok) {
          throw new Error('Failed to load subscription');
        }

        const data = await response.json();
        setSubscriptionData(data);
      } catch (error) {
        logger.error('Failed to load subscription:', error);
        showError('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [showError]);

  return {
    loading,
    subscriptionData,
    refreshSubscription,
  };
}
