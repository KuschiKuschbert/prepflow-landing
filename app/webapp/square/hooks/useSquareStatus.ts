/**
 * Shared hook for Square status data
 * Prevents duplicate API calls across multiple components
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 */

import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';

export interface SyncLog {
  id: string;
  operation_type: string;
  direction: 'square_to_prepflow' | 'prepflow_to_square' | 'unknown';
  entity_type?: string;
  status: 'success' | 'error' | 'pending' | 'unknown';
  error_message?: string;
  created_at: string;
}

interface SquareStatus {
  configured: boolean;
  credentialsValid: boolean;
  config: {
    square_environment: 'sandbox' | 'production';
    auto_sync_enabled: boolean;
    initial_sync_completed: boolean;
    initial_sync_status?: string;
    last_full_sync_at?: string;
    last_menu_sync_at?: string;
    last_staff_sync_at?: string;
    last_sales_sync_at?: string;
    webhook_enabled?: boolean;
    webhook_url?: string;
  } | null;
  recentSyncs: SyncLog[];
  recentErrors: SyncLog[];
  errorCount: number;
}

const CACHE_KEY = 'square_status';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function useSquareStatus() {
  const [status, setStatus] = useState<SquareStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (forceRefresh = false) => {
    const startTime = performance.now();

    try {
      setLoading(true);
      setError(null);

      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cached = getCachedData<SquareStatus>(CACHE_KEY);
        if (cached) {
          logger.dev('[Square Status Hook] Using cached data');
          setStatus(cached);
          setLoading(false);
          return;
        }
      }

      logger.dev('[Square Status Hook] Fetching status from API...');
      const response = await fetch('/api/square/status');
      const data = await response.json();

      const fetchTime = performance.now() - startTime;
      logger.dev(`[Square Status Hook] API call took ${fetchTime.toFixed(2)}ms`);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Square status');
      }

      if (data.status) {
        setStatus(data.status);
        // Cache the response
        cacheData(CACHE_KEY, data.status, CACHE_EXPIRY);
        logger.dev('[Square Status Hook] Status cached');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load Square status';
      logger.error('[Square Status Hook] Error:', {
        error: errorMessage,
        duration: `${(performance.now() - startTime).toFixed(2)}ms`,
      });
      setError(errorMessage);
      setStatus(null);
    } finally {
      setLoading(false);
      const totalTime = performance.now() - startTime;
      logger.dev(`[Square Status Hook] Total time: ${totalTime.toFixed(2)}ms`);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refresh: () => fetchStatus(true),
  };
}
