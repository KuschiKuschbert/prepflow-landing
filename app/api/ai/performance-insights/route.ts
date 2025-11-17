/**
 * Performance Insights AI API Endpoint
 *
 * Generates AI-powered performance insights with fallback to rule-based logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { logger } from '@/lib/logger';
import {
  buildPerformanceInsightsPrompt,
  parsePerformanceInsightsResponse,
} from '@/lib/ai/prompts/performance-insights';
import type { PerformanceItem } from '@/app/webapp/performance/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { performanceItems, performanceScore, countryCode } = body as {
      performanceItems: PerformanceItem[];
      performanceScore: number;
      countryCode?: string;
    };

    if (!Array.isArray(performanceItems) || typeof performanceScore !== 'number') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Try AI first
    try {
      const prompt = buildPerformanceInsightsPrompt(performanceItems, performanceScore);
      const aiResponse = await generateAIResponse(
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        countryCode || 'AU',
        {
          temperature: 0.7,
          maxTokens: 2000,
          useCache: true,
          cacheTTL: 60 * 60 * 1000, // 1 hour cache
        },
      );

      if (aiResponse.content && !aiResponse.error) {
        const insights = parsePerformanceInsightsResponse(aiResponse.content, performanceItems);
        if (insights.length > 0) {
          return NextResponse.json({
            insights,
            source: 'ai',
            cached: aiResponse.cached,
          });
        }
      }
    } catch (aiError) {
      logger.warn('AI performance insights failed, using fallback:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
      });
    }

    // Fallback: Return empty array - component should handle fallback to rule-based
    return NextResponse.json({
      insights: [],
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Performance insights error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate performance insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
