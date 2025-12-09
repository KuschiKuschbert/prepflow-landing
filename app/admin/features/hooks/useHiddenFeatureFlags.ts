/**
 * Hook for managing hidden feature flags
 */

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { HiddenFeatureFlag } from '../types';

export function useHiddenFeatureFlags() {
  const { showError } = useNotification();
  const [hiddenFlags, setHiddenFlags] = useState<HiddenFeatureFlag[]>([]);
  const [hiddenLoading, setHiddenLoading] = useState(true);
  const [hiddenError, setHiddenError] = useState<string | null>(null);

  const fetchHiddenFlags = useCallback(async () => {
    setHiddenLoading(true);
    setHiddenError(null);
    try {
      const response = await fetch('/api/admin/features/hidden');
      const data = await response.json();

      if (response.ok && data.success !== false) {
        setHiddenFlags(data.flags || []);
        logger.dev('[Admin Hidden Features] Fetched flags:', data.flags?.length || 0);
      } else {
        const errorMessage = data.message || data.error || 'Failed to fetch hidden feature flags';
        setHiddenError(errorMessage);
        logger.error('[Admin Hidden Features] API error:', {
          status: response.status,
          error: errorMessage,
          details: data.details,
        });
        showError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch hidden feature flags';
      setHiddenError(errorMessage);
      logger.error('[Admin Hidden Features] Fetch error:', error);
      showError(errorMessage);
    } finally {
      setHiddenLoading(false);
    }
  }, [showError]);

  return {
    hiddenFlags,
    hiddenLoading,
    hiddenError,
    fetchHiddenFlags,
  };
}
