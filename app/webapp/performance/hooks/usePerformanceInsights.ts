'use client';

import { useCountry } from '@/contexts/CountryContext';
import { useEffect, useMemo, useState } from 'react';
import { PerformanceItem } from '../types';
import { logger } from '@/lib/logger';
import {
  generateBargainBucketInsight,
  generateBurntToastInsight,
  generateChefsKissInsight,
  generateHiddenGemInsight,
  sortInsightsByPriority,
} from '../utils/insightGenerators';

export interface PerformanceInsight {
  id: string;
  type: 'hidden_gem' | 'bargain_bucket' | 'burnt_toast' | 'chefs_kiss';
  title: string;
  message: string;
  items: PerformanceItem[];
  priority: 'high' | 'medium' | 'low';
  potentialImpact?: {
    description: string;
    value: number;
  };
}

export function usePerformanceInsights(
  performanceItems: PerformanceItem[],
  performanceScore?: number,
) {
  const [aiInsights, setAiInsights] = useState<PerformanceInsight[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { selectedCountry } = useCountry();

  useEffect(() => {
    if (performanceItems.length === 0) {
      setAiInsights([]);
      return;
    }
    const fetchAIInsights = async () => {
      setIsLoadingAI(true);
      try {
        const response = await fetch('/api/ai/performance-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            performanceItems,
            performanceScore: performanceScore || 0,
            countryCode: selectedCountry,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.insights && data.source === 'ai' && data.insights.length > 0) {
            setAiInsights(data.insights);
            setIsLoadingAI(false);
            return;
          }
        }
      } catch (error) {
        logger.warn('AI insights failed, using fallback:', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
      setIsLoadingAI(false);
      setAiInsights([]);
    };
    fetchAIInsights();
  }, [performanceItems, performanceScore, selectedCountry]);

  const fallbackInsights = useMemo(() => {
    const result: PerformanceInsight[] = [];
    const categories = [
      { profit: 'High', popularity: 'Low', generator: generateHiddenGemInsight },
      { profit: 'Low', popularity: 'High', generator: generateBargainBucketInsight },
      { profit: 'Low', popularity: 'Low', generator: generateBurntToastInsight },
      { profit: 'High', popularity: 'High', generator: generateChefsKissInsight },
    ];
    categories.forEach(({ profit, popularity, generator }) => {
      const items = performanceItems.filter(
        item => item.profit_category === profit && item.popularity_category === popularity,
      );
      const insight = generator(items);
      if (insight) result.push(insight);
    });
    return sortInsightsByPriority(result);
  }, [performanceItems]);

  const insights = aiInsights.length > 0 ? aiInsights : fallbackInsights;
  return {
    insights,
    hasInsights: insights.length > 0,
    isLoadingAI,
    source: aiInsights.length > 0 ? 'ai' : 'fallback',
  };
}
