/**
 * Hook for discovering feature flags from codebase
 */

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { DiscoveredFlag } from '../types';

export function useFlagDiscovery() {
  const { showSuccess, showError } = useNotification();
  const [discovering, setDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [discoveredFlags, setDiscoveredFlags] = useState<{
    regular: DiscoveredFlag[];
    hidden: DiscoveredFlag[];
  }>({ regular: [], hidden: [] });

  const discoverFlags = useCallback(async () => {
    setDiscovering(true);
    setDiscoveryError(null);
    try {
      logger.dev('[Admin Features] Starting discovery...');
      const response = await fetch('/api/admin/features/discover');
      const data = await response.json();

      logger.dev('[Admin Features] Discovery response:', {
        ok: response.ok,
        success: data.success,
        total: data.total,
        regular: data.regular?.length || 0,
        hidden: data.hidden?.length || 0,
      });

      if (response.ok && data.success !== false) {
        setDiscoveredFlags({
          regular: data.regular || [],
          hidden: data.hidden || [],
        });
        const total = data.total || 0;
        if (total > 0) {
          showSuccess(
            `Discovered ${total} feature flags in codebase (${data.regular?.length || 0} regular, ${data.hidden?.length || 0} hidden)`,
          );
        } else {
          showError('No feature flags found in codebase. Check server logs for details.');
        }
      } else {
        const errorMessage = data.message || data.error || 'Failed to discover feature flags';
        setDiscoveryError(errorMessage);
        logger.error('[Admin Features] Discovery API error:', {
          status: response.status,
          error: errorMessage,
          data,
        });
        showError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to discover feature flags';
      setDiscoveryError(errorMessage);
      logger.error('[Admin Features] Discovery fetch error:', error);
      showError(errorMessage);
    } finally {
      setDiscovering(false);
    }
  }, [showSuccess, showError]);

  return {
    discovering,
    discoveryError,
    discoveredFlags,
    discoverFlags,
    setDiscoveredFlags,
  };
}
