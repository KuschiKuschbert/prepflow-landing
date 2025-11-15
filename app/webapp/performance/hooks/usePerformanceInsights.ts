'use client';

import { useCountry } from '@/contexts/CountryContext';
import { useEffect, useMemo, useState } from 'react';
import { PerformanceItem } from '../types';
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

  // Fetch AI insights when data changes
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
          headers: {
            'Content-Type': 'application/json',
          },
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
        console.warn('AI insights failed, using fallback:', error);
      }
      setIsLoadingAI(false);
      setAiInsights([]); // Clear AI insights to use fallback
    };

    fetchAIInsights();
  }, [performanceItems, performanceScore, selectedCountry]);

  // Fallback to rule-based insights
  const fallbackInsights = useMemo(() => {
    const result: PerformanceInsight[] = [];

    // Hidden Gems: High profit, low popularity
    const hiddenGems = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'Low',
    );
    const hiddenGemInsight = generateHiddenGemInsight(hiddenGems);
    if (hiddenGemInsight) result.push(hiddenGemInsight);

    // Bargain Buckets: Low profit, high popularity
    const bargainBuckets = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'High',
    );
    const bargainBucketInsight = generateBargainBucketInsight(bargainBuckets);
    if (bargainBucketInsight) result.push(bargainBucketInsight);

    // Burnt Toast: Low profit, low popularity
    const burntToast = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'Low',
    );
    const burntToastInsight = generateBurntToastInsight(burntToast);
    if (burntToastInsight) result.push(burntToastInsight);

    // Chef's Kiss: High profit, high popularity (positive insight)
    const chefsKiss = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'High',
    );
    const chefsKissInsight = generateChefsKissInsight(chefsKiss);
    if (chefsKissInsight) result.push(chefsKissInsight);

    // Sort by priority (high first, then by item count)
    return sortInsightsByPriority(result);
  }, [performanceItems]);

  // Use AI insights if available, otherwise fallback
  const insights = aiInsights.length > 0 ? aiInsights : fallbackInsights;

  return {
    insights,
    hasInsights: insights.length > 0,
    isLoadingAI,
    source: aiInsights.length > 0 ? 'ai' : 'fallback',
  };
}
