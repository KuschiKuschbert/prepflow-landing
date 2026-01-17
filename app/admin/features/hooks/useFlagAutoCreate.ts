import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { DiscoveredFlag } from '../types';
import { createFlagsApi } from './helpers/createFlags';

/**
 * Hook for auto-creating discovered feature flags.
 * Creates feature flags from discovered flags found in the codebase.
 *
 * @param {Object} discoveredFlags - Discovered flags grouped by type
 * @param {DiscoveredFlag[]} discoveredFlags.regular - Regular discovered flags
 * @param {DiscoveredFlag[]} discoveredFlags.hidden - Hidden discovered flags
 * @returns {Object} Auto-create state and function
 * @returns {boolean} returns.autoCreating - Loading state for auto-create operation
 * @returns {Function} returns.autoCreateFlags - Function to create all discovered flags
 */
export function useFlagAutoCreate(discoveredFlags: {
  regular: DiscoveredFlag[];
  hidden: DiscoveredFlag[];
}) {
  const { showSuccess, showError } = useNotification();
  const [autoCreating, setAutoCreating] = useState(false);

  const autoCreateFlags = useCallback(
    async (onSuccess?: () => void) => {
      setAutoCreating(true);
      try {
        const allDiscovered = [...discoveredFlags.regular, ...discoveredFlags.hidden];
        const data = await createFlagsApi(allDiscovered);

        showSuccess(`Created ${data.created} flags, skipped ${data.skipped} existing flags`);
        onSuccess?.();
      } catch (error) {
        logger.error('Failed to auto-create flags:', error);
        showError('Failed to auto-create feature flags');
      } finally {
        setAutoCreating(false);
      }
    },
    [discoveredFlags, showSuccess, showError],
  );

  return {
    autoCreating,
    autoCreateFlags,
  };
}
