import { useNotification } from '@/contexts/NotificationContext';
import { useCallback, useState } from 'react';
import type { TierConfiguration } from '../types';
import { logger } from '@/lib/logger';

/**
 * Hook for managing tier configurations.
 * Handles fetching, updating, and disabling subscription tiers.
 *
 * @returns {Object} Tier management state and functions
 * @returns {TierConfiguration[]} returns.tiers - Array of tier configurations
 * @returns {boolean} returns.loading - Loading state
 * @returns {string | null} returns.error - Error message if any
 * @returns {Function} returns.fetchTiers - Function to fetch tiers
 * @returns {Function} returns.updateTier - Function to update a tier
 * @returns {Function} returns.disableTier - Function to disable a tier
 */
export function useTiers() {
  const { showSuccess, showError } = useNotification();
  const [tiers, setTiers] = useState<TierConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTiers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/tiers');
      if (response.ok) {
        const data = await response.json();
        setTiers(data.tiers || []);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to fetch tiers';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      logger.error('[useTiers.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tiers';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateTier = useCallback(
    async (tier: TierConfiguration) => {
      try {
        const response = await fetch('/api/admin/tiers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tier),
        });
        if (response.ok) {
          showSuccess(`Tier ${tier.tier_slug} updated successfully`);
          fetchTiers();
          return true;
        }
        const errorData = await response.json();
        showError(errorData.error || 'Failed to update tier');
        return false;
      } catch (error) {
        logger.error('[useTiers.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

        showError('Failed to update tier');
        return false;
      }
    },
    [fetchTiers, showSuccess, showError],
  );

  const disableTier = useCallback(
    async (tierSlug: string) => {
      try {
        const response = await fetch(`/api/admin/tiers?tier_slug=${tierSlug}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          showSuccess(`Tier ${tierSlug} disabled successfully`);
          fetchTiers();
          return true;
        }
        const errorData = await response.json();
        showError(errorData.error || 'Failed to disable tier');
        return false;
      } catch (error) {
        logger.error('[useTiers.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

        showError('Failed to disable tier');
        return false;
      }
    },
    [fetchTiers, showSuccess, showError],
  );

  return {
    tiers,
    loading,
    error,
    fetchTiers,
    updateTier,
    disableTier,
  };
}
