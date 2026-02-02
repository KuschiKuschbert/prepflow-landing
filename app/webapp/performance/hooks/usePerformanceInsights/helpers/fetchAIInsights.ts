/**
 * Fetch AI insights for performance items.
 */
import { logger } from '@/lib/logger';
import type { PerformanceInsight } from '../../usePerformanceInsights';
import type { PerformanceItem } from '@/lib/types/performance';

interface FetchAIInsightsParams {
  performanceItems: PerformanceItem[];
  performanceScore: number;
  countryCode: string;
}

export async function fetchAIInsights({
  performanceItems,
  performanceScore,
  countryCode,
}: FetchAIInsightsParams): Promise<PerformanceInsight[]> {
  try {
    const response = await fetch('/api/ai/performance-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performanceItems,
        performanceScore,
        countryCode,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.insights && data.source === 'ai' && data.insights.length > 0) {
        return data.insights;
      }
    }
  } catch (error) {
    logger.warn('AI insights failed, using fallback:', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
  return [];
}
