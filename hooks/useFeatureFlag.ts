'use client';

import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to check if a feature flag is enabled.
 * Uses React Query for caching and deduplication to prevent 429 errors.
 *
 * @param {string} flagKey - Feature flag key to check
 * @returns {boolean} True if feature is enabled, false otherwise
 */
export function useFeatureFlag(flagKey: string): boolean {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ['feature-flag', flagKey, user?.sub],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/features/${encodeURIComponent(flagKey)}`);
        if (!response.ok) {
          if (response.status === 429) {
            logger.error(`[useFeatureFlag] Rate limited (429) for key: ${flagKey}`);
          }
          return { enabled: false };
        }
        return await response.json();
      } catch (_error) {
        return { enabled: false };
      }
    },
    // Only run when user is available or we're checking public flags
    enabled: !!flagKey,
    // Cache status for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Don't retry on failure
    retry: false,
  });

  // Return false while loading to prevent flash of content
  return isLoading ? false : !!data?.enabled;
}
