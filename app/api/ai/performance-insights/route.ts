/**
 * Performance Insights AI API Endpoint
 *
 * Generates AI-powered performance insights with fallback to rule-based logic
 */

import type { PerformanceItem } from '@/app/webapp/performance/types';
import { generateAIResponse } from '@/lib/ai/ai-service';
import {
    buildPerformanceInsightsPrompt,
    parsePerformanceInsightsResponse,
} from '@/lib/ai/prompts/performance-insights';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const performanceInsightsSchema = z.object({
  performanceItems: z.array(z.any()).min(1, 'performanceItems array is required'),
  performanceScore: z.number(),
  countryCode: z.string().optional(),
});

interface InsightResult {
  insights: unknown[]; // justified: dynamic AI response
  source: 'ai' | 'fallback';
  cached?: boolean;
}

async function getAIPerformanceInsights(
  performanceItems: PerformanceItem[],
  performanceScore: number,
  countryCode: string = 'AU',
): Promise<InsightResult> {
  try {
    const prompt = buildPerformanceInsightsPrompt(performanceItems, performanceScore);
    const aiResponse = await generateAIResponse(
      [
        {
          role: 'user',
          content: prompt,
        },
      ],
      countryCode,
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
        return {
          insights,
          source: 'ai',
          cached: aiResponse.cached,
        };
      }
    }
  } catch (aiError) {
    logger.warn('[AI Performance Insights] AI generation failed, using fallback:', {
      error: aiError instanceof Error ? aiError.message : String(aiError),
    });
  }

  return {
    insights: [],
    source: 'fallback',
  };
}

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[AI Performance Insights API] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * POST /api/ai/performance-insights
 * Generate AI-powered performance insights with fallback to rule-based logic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await safeParseBody(request);

    const validationResult = performanceInsightsSchema.safeParse(body || {});
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

    const { performanceItems, performanceScore, countryCode } = validationResult.data as {
      performanceItems: PerformanceItem[];
      performanceScore: number;
      countryCode?: string;
    };

    const result = await getAIPerformanceInsights(
      performanceItems,
      performanceScore,
      countryCode || 'AU',
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error('[AI Performance Insights] Unexpected error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to generate performance insights', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
