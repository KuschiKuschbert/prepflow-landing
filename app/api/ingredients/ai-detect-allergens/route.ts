/**
 * AI Allergen Detection API Endpoint
 * POST /api/ingredients/ai-detect-allergens
 * Detects allergens from ingredient name and brand using AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { detectAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { z } from 'zod';

const detectAllergensSchema = z.object({
  ingredient_name: z.string().min(1, 'ingredient_name is required'),
  brand: z.string().optional(),
  force_ai: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[AI Allergen Detection API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = detectAllergensSchema.safeParse(body);
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

    const { ingredient_name, brand, force_ai } = validationResult.data;

    logger.dev(
      `[Hybrid Allergen Detection] Detecting allergens for: ${ingredient_name}${brand ? ` (${brand})` : ''}${force_ai ? ' (AI forced)' : ''}`,
    );

    // Call hybrid detection service (non-AI first, AI fallback)
    const result = await detectAllergensHybrid(
      ingredient_name.trim(),
      brand?.trim(),
      force_ai === true,
    );

    return NextResponse.json({
      success: true,
      data: {
        allergens: result.allergens || [],
        composition: result.composition,
        confidence: result.confidence,
        method: result.method,
        reason: result.reason,
        cached: result.cached || false,
      },
    });
  } catch (err) {
    logger.error('[Hybrid Allergen Detection API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to detect allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
