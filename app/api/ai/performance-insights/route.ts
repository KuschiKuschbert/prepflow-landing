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
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';

const performanceInsightsSchema = z.object({
  performanceItems: z.array(z.any()).min(1, 'performanceItems array is required'),
  performanceScore: z.number(),
  countryCode: z.string().optional(),
});

/**
 * POST /api/ai/performance-insights
 * Generate AI-powered performance insights with fallback to rule-based logic
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {PerformanceItem[]} request.body.performanceItems - Performance items
 * @param {number} request.body.performanceScore - Performance score
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} Performance insights response
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[AI Performance Insights] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = performanceInsightsSchema.safeParse(body);
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
