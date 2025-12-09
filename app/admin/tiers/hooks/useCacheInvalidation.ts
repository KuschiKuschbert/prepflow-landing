/**
 * Hook for cache invalidation
 */

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export function useCacheInvalidation() {
  const { showSuccess, showError } = useNotification();
  const [invalidating, setInvalidating] = useState(false);

  const invalidateCache = useCallback(async () => {
    setInvalidating(true);
    try {
      const response = await fetch('/api/admin/tiers/cache', {
        method: 'POST',
      });

      if (response.ok) {
        showSuccess('Cache invalidated successfully');
        return true;
      } else {
        showError('Failed to invalidate cache');
        return false;
      }
    } catch (error) {
      showError('Failed to invalidate cache');
      return false;
    } finally {
      setInvalidating(false);
    }
  }, [showSuccess, showError]);

  return {
    invalidating,
    invalidateCache,
  };
}
