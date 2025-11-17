'use client';

import { useCountry } from '@/contexts/CountryContext';
import { useEffect, useMemo, useState } from 'react';
import { PerformanceItem } from '../types';
import { logger } from '../../lib/logger';
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
        logger.warn('AI insights failed, using fallback:', error);
      }
      setIsLoadingAI(false);
      setAiInsights([]);
    };
    fetchAIInsights();
  }, [performanceItems, performanceScore, selectedCountry]);

  const fallbackInsights = useMemo(() => {
    const result: PerformanceInsight[] = [];
    const hiddenGems = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'Low',
    );
    const hiddenGemInsight = generateHiddenGemInsight(hiddenGems);
    if (hiddenGemInsight) result.push(hiddenGemInsight);
    const bargainBuckets = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'High',
    );
    const bargainBucketInsight = generateBargainBucketInsight(bargainBuckets);
    if (bargainBucketInsight) result.push(bargainBucketInsight);
    const burntToast = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'Low',
    );
    const burntToastInsight = generateBurntToastInsight(burntToast);
    if (burntToastInsight) result.push(burntToastInsight);
    const chefsKiss = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'High',
    );
    const chefsKissInsight = generateChefsKissInsight(chefsKiss);
    if (chefsKissInsight) result.push(chefsKissInsight);
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
