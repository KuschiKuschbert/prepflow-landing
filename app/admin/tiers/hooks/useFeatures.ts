import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { FeatureMapping } from '../types';
import { logger } from '@/lib/logger';

/**
 * Hook for managing feature-to-tier mappings.
 * Handles fetching and updating feature mappings for subscription tiers.
 *
 * @returns {Object} Feature mapping management state and functions
 * @returns {FeatureMapping[]} returns.features - Array of feature mappings
 * @returns {boolean} returns.loading - Loading state
 * @returns {string | null} returns.error - Error message if any
 * @returns {Function} returns.fetchFeatures - Function to fetch feature mappings
 * @returns {Function} returns.updateFeature - Function to update a feature mapping
 */
export function useFeatures() {
  const { showSuccess, showError } = useNotification();
  const [features, setFeatures] = useState<FeatureMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/tiers/features');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.mappings || []);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to fetch feature mappings';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      logger.error('[useFeatures.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch feature mappings';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateFeature = useCallback(
    async (feature: FeatureMapping) => {
      try {
        const response = await fetch('/api/admin/tiers/features', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feature),
        });

        if (response.ok) {
          showSuccess(`Feature ${feature.feature_key} updated successfully`);
          fetchFeatures();
          return true;
        } else {
          const errorData = await response.json();
          showError(errorData.error || 'Failed to update feature mapping');
          return false;
        }
      } catch (error) {
        logger.error('[useFeatures.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        showError('Failed to update feature mapping');
        return false;
      }
    },
    [fetchFeatures, showSuccess, showError],
  );

  return {
    features,
    loading,
    error,
    fetchFeatures,
    updateFeature,
  };
}
