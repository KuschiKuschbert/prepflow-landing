/**
 * Performance Tips AI API Endpoint
 *
 * Generates AI-powered performance tips with fallback to rule-based logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import { logger } from '../../lib/logger';
import {
  buildPerformanceTipsPrompt,
  parsePerformanceTipsResponse,
} from '@/lib/ai/prompts/performance-tips';
import { generatePerformanceTips } from '@/app/webapp/performance/utils/generatePerformanceTips';
import type { PerformanceItem } from '@/app/webapp/performance/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { performanceScore, performanceItems, countryCode } = body as {
      performanceScore: number;
      performanceItems: PerformanceItem[];
      countryCode?: string;
    };

    if (typeof performanceScore !== 'number' || !Array.isArray(performanceItems)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Try AI first
    try {
      const prompt = buildPerformanceTipsPrompt(performanceScore, performanceItems);
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
          maxTokens: 1500,
          useCache: true,
          cacheTTL: 60 * 60 * 1000, // 1 hour cache
        },
      );

      if (aiResponse.content && !aiResponse.error) {
        const tips = parsePerformanceTipsResponse(aiResponse.content);
        if (tips.length > 0) {
          return NextResponse.json({
            tips,
            source: 'ai',
            cached: aiResponse.cached,
          });
        }
      }
    } catch (aiError) {
      logger.warn('AI performance tips failed, using fallback:', aiError);
    }

    // Fallback to rule-based logic
    const fallbackTips = generatePerformanceTips(performanceScore, performanceItems);
    return NextResponse.json({
      tips: fallbackTips,
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Performance tips error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate performance tips',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
