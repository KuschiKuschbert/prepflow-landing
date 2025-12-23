'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface SubscriptionStatus {
  tier: string;
  status: string;
  expires_at: string | null;
  cancel_at_period_end?: boolean;
}

/**
 * Hook to monitor subscription status and show notifications on changes.
 * Polls subscription endpoint every 5 minutes when status is not active.
 *
 * @returns {Object} Hook return value
 * @returns {SubscriptionStatus | null} returns.subscription - Current subscription status
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Function} returns.refresh - Manual refresh function
 */
export function useSubscriptionStatus() {
  const { user } = useUser();
  const { showSuccess, showWarning, showError } = useNotification();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        const currentStatus = data.subscription;

        // Check for status changes and show notifications
        if (previousStatus && previousStatus !== currentStatus.status) {
          if (currentStatus.status === 'active' && previousStatus !== 'active') {
            showSuccess('Your subscription is now active!');
          } else if (currentStatus.status === 'past_due') {
            showWarning('Your payment failed. Please update your payment method.');
          } else if (currentStatus.status === 'cancelled') {
            showWarning('Your subscription has been cancelled.');
          }
        }

        setSubscription(currentStatus);
        setPreviousStatus(currentStatus.status);
      }
    } catch (error) {
      logger.error('[useSubscriptionStatus] Failed to fetch subscription:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: { endpoint: '/api/user/subscription', operation: 'fetchSubscription' },
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.email, previousStatus, showSuccess, showWarning]);

  useEffect(() => {
    fetchSubscription();

    // Poll every 5 minutes if status is not active
    const interval = setInterval(
      () => {
        if (subscription?.status !== 'active') {
          fetchSubscription();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchSubscription, subscription?.status]);

  return {
    subscription,
    isLoading,
    refresh: fetchSubscription,
  };
}
