import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { FeatureFlag } from '../types';

/**
 * Hook for fetching regular feature flags from the admin API.
 *
 * @returns {Object} Feature flags fetch state and refresh function
 * @returns {FeatureFlag[]} returns.flags - Array of feature flags
 * @returns {boolean} returns.loading - Loading state
 * @returns {string | null} returns.error - Error message if any
 * @returns {Function} returns.fetchFlags - Function to manually fetch flags
 */
export function useFeatureFlagsFetch() {
  const { showError } = useNotification();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/features');
      const data = await response.json();

      if (response.ok && data.success !== false) {
        setFlags(data.flags || []);
        logger.dev('[Admin Features] Fetched flags:', data.flags?.length || 0);
      } else {
        const errorMessage = data.message || data.error || 'Failed to fetch feature flags';
        setError(errorMessage);
        logger.error('[Admin Features] API error:', {
          status: response.status,
          error: errorMessage,
          details: data.details,
        });
        showError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch feature flags';
      setError(errorMessage);
      logger.error('[Admin Features] Fetch error:', error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return {
    flags,
    loading,
    error,
    fetchFlags,
  };
}
