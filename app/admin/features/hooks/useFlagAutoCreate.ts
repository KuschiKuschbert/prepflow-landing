/**
 * Hook for auto-creating discovered feature flags
 */

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { DiscoveredFlag } from '../types';

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
        const response = await fetch('/api/admin/features/auto-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flags: allDiscovered.map(f => ({
              flag_key: f.flagKey,
              type: f.type,
              description: `Discovered from ${f.file}:${f.line}`,
            })),
          }),
        });

        const data = await response.json();

        if (response.ok && data.success !== false) {
          showSuccess(`Created ${data.created} flags, skipped ${data.skipped} existing flags`);
          onSuccess?.();
        } else {
          showError('Failed to auto-create feature flags');
        }
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
