/**
 * AI Performance Tips Hook
 *
 * Fetches AI-generated performance tips with fallback
 */

import { useState, useCallback } from 'react';
import type { PerformanceItem } from '@/lib/types/performance';

export interface PerformanceTip {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  action?: string;
}

interface UseAIPerformanceTipsReturn {
  generateTips: (
    performanceScore: number,
    performanceItems: PerformanceItem[],
    countryCode?: string,
  ) => Promise<PerformanceTip[]>;
  isLoading: boolean;
  error: string | null;
  source: 'ai' | 'fallback' | null;
}

export function useAIPerformanceTips(): UseAIPerformanceTipsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);

  const generateTips = useCallback(
    async (
      performanceScore: number,
      performanceItems: PerformanceItem[],
      countryCode?: string,
    ): Promise<PerformanceTip[]> => {
      setIsLoading(true);
      setError(null);
      setSource(null);

      try {
        const response = await fetch('/api/ai/performance-tips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            performanceScore,
            performanceItems,
            countryCode,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate performance tips');
        }

        const data = await response.json();
        setSource(data.source || 'fallback');
        setIsLoading(false);
        return data.tips || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setIsLoading(false);
        setSource('fallback');
        // Return empty array on error - component should handle fallback
        return [];
      }
    },
    [],
  );

  return {
    generateTips,
    isLoading,
    error,
    source,
  };
}
