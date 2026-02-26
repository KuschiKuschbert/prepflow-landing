/**
 * Performance Tips AI API Endpoint
 *
 * Generates AI-powered performance tips with fallback to rule-based logic
 */

import type { PerformanceItem } from '@/lib/types/performance';
import { generatePerformanceTips } from '@/lib/performance/generatePerformanceTips';
import { generateAIResponse } from '@/lib/ai/ai-service';
import {
  buildPerformanceTipsPrompt,
  parsePerformanceTipsResponse,
} from '@/lib/ai/prompts/performance-tips';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { parseAndValidate } from '@/lib/api/parse-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const performanceTipsSchema = z.object({
  performanceScore: z.number().optional().default(0),
  performanceItems: z.array(z.any()).optional().default([]),
  countryCode: z.string().optional(),
});

/**
 * Generate AI-powered performance tips with fallback to rule-based logic
 */
async function getAIPerformanceTips(
  performanceScore: number,
  performanceItems: PerformanceItem[],
  countryCode?: string,
) {
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
        return {
          tips,
          source: 'ai',
          cached: aiResponse.cached,
        };
      }
    }
  } catch (aiError) {
    logger.warn('AI performance tips failed, using fallback:', {
      error: aiError instanceof Error ? aiError.message : String(aiError),
    });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseAndValidate(request, performanceTipsSchema, '[AI Performance Tips]');
    if (!parsed.ok) return parsed.response;

    const { performanceScore, performanceItems, countryCode } = parsed.data as {
      performanceScore: number;
      performanceItems: PerformanceItem[];
      countryCode?: string;
    };

    // Return empty tips when there's no data to analyze
    if (!performanceItems || performanceItems.length === 0) {
      return NextResponse.json({ tips: [], source: 'fallback' });
    }

    // Try AI first
    const aiResult = await getAIPerformanceTips(performanceScore, performanceItems, countryCode);
    if (aiResult) return NextResponse.json(aiResult);

    // Fallback to rule-based logic
    const fallbackTips = generatePerformanceTips(performanceScore, performanceItems);
    return NextResponse.json({
      tips: fallbackTips,
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Performance tips error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to generate performance tips', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
