import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { DiscoveredFlag } from '../types';

/**
 * Hook for discovering feature flags from codebase.
 * Scans the codebase for feature flag usage and returns discovered flags.
 *
 * @returns {Object} Discovery state and function
 * @returns {boolean} returns.discovering - Loading state for discovery operation
 * @returns {string | null} returns.discoveryError - Error message if discovery failed
 * @returns {Object} returns.discoveredFlags - Discovered flags grouped by type
 * @returns {DiscoveredFlag[]} returns.discoveredFlags.regular - Regular discovered flags
 * @returns {DiscoveredFlag[]} returns.discoveredFlags.hidden - Hidden discovered flags
 * @returns {Function} returns.discoverFlags - Function to start discovery
 * @returns {Function} returns.setDiscoveredFlags - Function to manually set discovered flags
 */
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

      logDiscoveryResponse(response, data);

      if (!response.ok || data.success === false) {
        handleResponseError(response, data, setDiscoveryError, showError);
        return;
      }

      handleResponseSuccess(data, setDiscoveredFlags, showSuccess, showError);
    } catch (error) {
      handleCatchError(error, setDiscoveryError, showError);
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

// Helper functions extracted to reduce nesting

function logDiscoveryResponse(response: Response, data: any) {
  logger.dev('[Admin Features] Discovery response:', {
    ok: response.ok,
    success: data.success,
    total: data.total,
    regular: data.regular?.length || 0,
    hidden: data.hidden?.length || 0,
  });
}

function handleResponseError(
  response: Response,
  data: any,
  setDiscoveryError: (err: string | null) => void,
  showError: (msg: string) => void
) {
  const errorMessage = data.message || data.error || 'Failed to discover feature flags';
  setDiscoveryError(errorMessage);
  logger.error('[Admin Features] Discovery API error:', {
    status: response.status,
    error: errorMessage,
    data,
  });
  showError(errorMessage);
}

function handleResponseSuccess(
  data: any,
  setDiscoveredFlags: (flags: any) => void,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) {
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
}

function handleCatchError(
  error: unknown,
  setDiscoveryError: (err: string | null) => void,
  showError: (msg: string) => void
) {
  const errorMessage =
    error instanceof Error ? error.message : 'Failed to discover feature flags';
  setDiscoveryError(errorMessage);
  logger.error('[Admin Features] Discovery fetch error:', error);
  showError(errorMessage);
}
