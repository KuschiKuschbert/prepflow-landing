/**
 * Hook for hidden feature flag mutations (toggle, delete)
 */

import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { HiddenFeatureFlag } from '../types';

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
