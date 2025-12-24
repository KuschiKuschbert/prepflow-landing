import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

/**
 * Hook for invalidating tier configuration cache.
 * Clears cached tier data to force fresh fetch from database.
 *
 * @returns {Object} Cache invalidation state and function
 * @returns {boolean} returns.invalidating - Loading state for invalidation operation
 * @returns {Function} returns.invalidateCache - Function to invalidate tier cache
 */
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
      logger.error('[useCacheInvalidation.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

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
