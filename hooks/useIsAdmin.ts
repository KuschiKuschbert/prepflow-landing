'use client';

import { logger } from '@/lib/logger';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to check if current user is an admin (email in ALLOWED_EMAILS)
 * Uses React Query for caching and deduplication to prevent 429 errors.
 *
 * @returns {Object} Admin status hook
 * @returns {boolean} returns.isAdmin - True if user is admin
 * @returns {boolean} returns.loading - Loading state
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/check');
        if (!response.ok) {
          if (response.status === 429) {
            logger.error('[useIsAdmin] Rate limited (429)');
          }
          return { isAdmin: false };
        }
        return await response.json();
      } catch (error) {
        logger.error('[useIsAdmin] Error checking admin status:', {
          error: error instanceof Error ? error.message : String(error),
        });
        return { isAdmin: false };
      }
    },
    // Cache admin status for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Don't retry on failure to avoid additional pressure on API
    retry: false,
  });

  return {
    isAdmin: data?.isAdmin || false,
    loading: isLoading,
  };
}
