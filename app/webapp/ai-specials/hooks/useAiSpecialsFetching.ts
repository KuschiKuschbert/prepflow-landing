import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import type { AISpecial } from '../components/SpecialsGrid';

export function useAiSpecialsFetching() {
  const { user, isLoading: userLoading } = useUser();
  const userEmail = user?.email || null;
  const isAuthenticated = !userLoading && (!!user || !!userEmail);

  const [aiSpecials, setAiSpecials] = useState<AISpecial[]>(
    () => getCachedData('ai_specials') || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      prefetchApi('/api/ai-specials');
    }
  }, [isAuthenticated]);

  const fetchAISpecials = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view AI specials');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-specials');
      const result = (await response.json()) as {
        success: boolean;
        data: AISpecial[];
        message?: string;
      };
      if (result.success) {
        setAiSpecials(result.data);
        cacheData('ai_specials', result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch AI specials');
      }
    } catch (err) {
      logger.error('[useAiSpecials] Error fetching AI specials:', {
        error: err instanceof Error ? err.message : String(err),
        userEmail,
      });
      setError('Failed to fetch AI specials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      try {
        await fetchAISpecials();
      } catch (err) {
        logger.error('[useAiSpecials] Error in useEffect:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    aiSpecials,
    setAiSpecials, // Exposed for optimistic updates
    loading,
    error,
    setError, // Exposed for clearing errors
    isAuthenticated,
    userLoading,
    userEmail,
  };
}
