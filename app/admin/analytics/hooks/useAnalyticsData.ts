import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import { AnalyticsData } from '../types';

/**
 * Hook to fetch and manage analytics data.
 *
 * @returns {Object} Analytics data and loading state
 */
export function useAnalyticsData() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        logger.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return { analytics, loading };
}
