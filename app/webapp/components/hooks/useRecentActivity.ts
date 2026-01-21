import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import { fetchRecentActivityData, RecentActivity } from './useRecentActivity.helpers';

export type { RecentActivity };

export function useRecentActivity() {
  // Initialize with cached data for instant display
  const [activities, setActivities] = useState<RecentActivity[]>(
    () => getCachedData<RecentActivity[]>('dashboard_recent_activity') || [],
  );
  const [loading, setLoading] = useState(false); // Start false since we have cached data
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = useCallback(async (): Promise<RecentActivity[]> => {
    return fetchRecentActivityData();
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentActivity();
      setActivities(data);
      // Cache the activity data
      cacheData('dashboard_recent_activity', data);
    } catch (err) {
      logger.error('[useRecentActivity] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
    } finally {
      setLoading(false);
    }
  }, [fetchRecentActivity]);

  useEffect(() => {
    // If we have cached data, fetch in background without showing loading state
    // Otherwise, show loading while fetching
    const hasCachedData = activities.length > 0;
    if (hasCachedData) {
      // Non-blocking: fetch fresh data in background without loading state
      fetchRecentActivity()
        .then(data => {
          setActivities(data);
          cacheData('dashboard_recent_activity', data);
        })
        .catch(() => {
          // Silently fail - we already have cached data displayed
        });
    } else {
      // No cached data, fetch with loading state
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return { activities, loading, error, refetch };
}
