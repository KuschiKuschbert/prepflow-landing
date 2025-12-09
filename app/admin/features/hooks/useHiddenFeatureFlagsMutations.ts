import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { HiddenFeatureFlag } from '../types';

/**
 * Hook for hidden feature flag mutations (toggle unlock/enable, delete).
 * Handles API calls for updating hidden feature flags.
 *
 * @param {Function} refresh - Function to refresh flags after mutation
 * @returns {Object} Mutation functions
 * @returns {Function} returns.toggleHiddenFlag - Function to toggle unlock or enable state
 * @returns {Function} returns.deleteHiddenFlag - Function to delete a hidden flag
 */
export function useHiddenFeatureFlagsMutations(refresh: () => Promise<void>) {
  const { showSuccess, showError } = useNotification();

  const toggleHiddenFlag = useCallback(
    async (flag: HiddenFeatureFlag, field: 'is_unlocked' | 'is_enabled') => {
      try {
        const updateData: Record<string, boolean> = {};
        updateData[field] = !flag[field];

        const response = await fetch('/api/admin/features/hidden', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feature_key: flag.feature_key,
            ...updateData,
          }),
        });

        if (response.ok) {
          const newValue = !flag[field];
          showSuccess(
            `Hidden feature flag ${flag.feature_key} ${field} ${newValue ? 'enabled' : 'disabled'}`,
          );
          await refresh();
        } else {
          showError('Failed to update hidden feature flag');
        }
      } catch (error) {
        logger.error('Failed to toggle hidden flag:', error);
        showError('Failed to update hidden feature flag');
      }
    },
    [refresh, showSuccess, showError],
  );

  const deleteHiddenFlag = useCallback(
    async (flag: HiddenFeatureFlag) => {
      try {
        const response = await fetch('/api/admin/features/hidden', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feature_key: flag.feature_key }),
        });

        if (response.ok) {
          showSuccess('Hidden feature flag deleted');
          await refresh();
        } else {
          showError('Failed to delete hidden feature flag');
        }
      } catch (error) {
        logger.error('Failed to delete hidden flag:', error);
        showError('Failed to delete hidden feature flag');
      }
    },
    [refresh, showSuccess, showError],
  );

  return {
    toggleHiddenFlag,
    deleteHiddenFlag,
  };
}
