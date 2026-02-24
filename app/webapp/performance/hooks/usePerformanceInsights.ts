'use client';

import { useCountry } from '@/contexts/CountryContext';
import { useEffect, useMemo, useState } from 'react';
import type { PerformanceItem } from '@/lib/types/performance';
import {
  generateBargainBucketInsight,
  generateBurntToastInsight,
  generateChefsKissInsight,
  generateHiddenGemInsight,
  sortInsightsByPriority,
} from '../utils/insightGenerators';
import { fetchAIInsights } from './usePerformanceInsights/helpers/fetchAIInsights';
import type { PerformanceInsight } from './performance-insight-types';

export type { PerformanceInsight } from './performance-insight-types';

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
    const loadAIInsights = async () => {
      setIsLoadingAI(true);
      const insights = await fetchAIInsights({
        performanceItems,
        performanceScore: performanceScore || 0,
        countryCode: selectedCountry,
      });
      setAiInsights(insights);
      setIsLoadingAI(false);
    };
    loadAIInsights();
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
