import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import type { UserError } from '../types';

/**
 * Hook for fetching recent user errors
 */
export function useRecentErrors(userEmail: string | undefined) {
  const [recentErrors, setRecentErrors] = useState<UserError[]>([]);
  const [loadingErrors, setLoadingErrors] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    async function fetchRecentErrors() {
      setLoadingErrors(true);
      try {
        const response = await fetch('/api/user/errors?pageSize=5');
        if (response.ok) {
          const data = await response.json();
          setRecentErrors(data.errors || []);
        }
      } catch (error) {
        logger.error('Failed to fetch recent errors:', error);
      } finally {
        setLoadingErrors(false);
      }
    }

    fetchRecentErrors();
  }, [userEmail]);

  const refreshErrors = async () => {
    if (!userEmail) return;
    setLoadingErrors(true);
    try {
      const response = await fetch('/api/user/errors?pageSize=5');
      if (response.ok) {
        const data = await response.json();
        setRecentErrors(data.errors || []);
      }
    } catch (error) {
      logger.error('Failed to refresh errors:', error);
    } finally {
      setLoadingErrors(false);
    }
  };

  return {
    recentErrors,
    loadingErrors,
    refreshErrors,
  };
}
