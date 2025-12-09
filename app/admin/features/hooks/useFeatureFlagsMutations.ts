import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { FeatureFlag } from '../types';

/**
 * Hook for regular feature flag mutations (toggle, delete, create).
 * Handles API calls for updating regular feature flags.
 *
 * @param {Function} refresh - Function to refresh flags after mutation
 * @returns {Object} Mutation functions
 * @returns {Function} returns.toggleFlag - Function to toggle flag enabled state
 * @returns {Function} returns.deleteFlag - Function to delete a flag
 * @returns {Function} returns.createFlag - Function to create a new flag
 */
export function useFeatureFlagsMutations(refresh: () => Promise<void>) {
  const { showSuccess, showError } = useNotification();

  const toggleFlag = useCallback(
    async (flag: FeatureFlag) => {
      try {
        const response = await fetch(`/api/admin/features/${flag.flag_key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enabled: !flag.enabled,
            user_id: flag.user_id,
          }),
        });

        if (response.ok) {
          showSuccess(`Feature flag ${flag.flag_key} ${!flag.enabled ? 'enabled' : 'disabled'}`);
          await refresh();
        } else {
          showError('Failed to update feature flag');
        }
      } catch (error) {
        logger.error('Failed to toggle flag:', error);
        showError('Failed to update feature flag');
      }
    },
    [refresh, showSuccess, showError],
  );

  const deleteFlag = useCallback(
    async (flag: FeatureFlag) => {
      try {
        const response = await fetch(`/api/admin/features/${flag.flag_key}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: flag.user_id }),
        });

        if (response.ok) {
          showSuccess('Feature flag deleted');
          await refresh();
        } else {
          showError('Failed to delete feature flag');
        }
      } catch (error) {
        logger.error('Failed to delete flag:', error);
        showError('Failed to delete feature flag');
      }
    },
    [refresh, showSuccess, showError],
  );

  const createFlag = useCallback(
    async (flagData: { flag_key: string; description: string; enabled: boolean }) => {
      try {
        const response = await fetch('/api/admin/features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flagData),
        });

        if (response.ok) {
          showSuccess('Feature flag created');
          await refresh();
          return true;
        } else {
          showError('Failed to create feature flag');
          return false;
        }
      } catch (error) {
        logger.error('Failed to create flag:', error);
        showError('Failed to create feature flag');
        return false;
      }
    },
    [refresh, showSuccess, showError],
  );

  return {
    toggleFlag,
    deleteFlag,
    createFlag,
  };
}
