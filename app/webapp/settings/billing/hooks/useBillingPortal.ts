import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

/**
 * Hook for billing portal actions
 */
export function useBillingPortal() {
  const { showError } = useNotification();
  const [openingPortal, setOpeningPortal] = useState(false);

  const handleOpenPortal = useCallback(async () => {
    setOpeningPortal(true);
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('Failed to open billing portal:', error);
      showError(error instanceof Error ? error.message : 'Failed to open billing portal');
      setOpeningPortal(false);
    }
  }, [showError]);

  return {
    openingPortal,
    handleOpenPortal,
  };
}
