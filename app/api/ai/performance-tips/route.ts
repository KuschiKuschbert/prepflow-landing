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
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const performanceTipsSchema = z.object({
  performanceScore: z.number(),
  performanceItems: z.array(z.any()).min(1, 'performanceItems array is required'),
  countryCode: z.string().optional(),
});

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[AI Performance Tips API] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

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
    const body = await safeParseBody(request);

    const validationResult = performanceTipsSchema.safeParse(body || {});
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { performanceScore, performanceItems, countryCode } = validationResult.data as {
      performanceScore: number;
      performanceItems: PerformanceItem[];
      countryCode?: string;
    };

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
