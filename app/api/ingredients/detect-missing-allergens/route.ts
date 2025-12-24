/**
 * Bulk Allergen Detection API Endpoint
 * POST /api/ingredients/detect-missing-allergens
 * Detects allergens for ingredients that don't have them
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { buildIngredientQuery } from './helpers/buildIngredientQuery';
import { processIngredient } from './helpers/processIngredient';
import { invalidateAndReaggregate } from './helpers/invalidateAndReaggregate';

const detectMissingAllergensSchema = z.object({
  ingredient_ids: z.array(z.string()).optional(),
  force: z.boolean().optional().default(false),
});

/**
 * Detects allergens for ingredients missing them.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Detection results
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    let body: z.infer<typeof detectMissingAllergensSchema> = {
      ingredient_ids: undefined,
      force: false,
    };
    try {
      const rawBody = await request.json();
      body = detectMissingAllergensSchema.parse(rawBody);
    } catch (err) {
      logger.warn('[Detect Missing Allergens API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
          { status: 400 },
        );
      }
    }
    const { ingredient_ids, force = false } = body;

    // Build and execute query
    const query = buildIngredientQuery(ingredient_ids || null, force);
    const { data: ingredients, error: fetchError } = await query;

    if (fetchError) {
      logger.error('[Detect Missing Allergens API] Error fetching ingredients:', {
        error: fetchError.message,
        code: (fetchError as any).code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          processed: 0,
          successful: 0,
          failed: 0,
          skipped: 0,
          results: [],
        },
      });
    }

    const results: Array<{
      ingredient_id: string;
      ingredient_name: string;
      status: 'success' | 'failed' | 'skipped';
      allergens?: string[];
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    // Process each ingredient
    for (const ingredient of ingredients) {
      const result = await processIngredient(ingredient, force);

      if (result.status === 'success') {
        successful++;
      } else if (result.status === 'failed') {
        failed++;
      } else {
        skipped++;
      }

      results.push(result);

      // Small delay to avoid rate limiting (only for successful detections)
      if (result.status === 'success') {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Invalidate and re-aggregate allergen caches for affected recipes/dishes
    if (successful > 0) {
      const successfulIngredients = ingredients.filter(ing =>
        results.find(r => r.ingredient_id === ing.id && r.status === 'success'),
      );
      try {
        await invalidateAndReaggregate(successfulIngredients);
      } catch (err) {
        logger.error('[Detect Missing Allergens API] Error invalidating/re-aggregating caches:', {
          error: err instanceof Error ? err.message : String(err),
          context: {
            endpoint: '/api/ingredients/detect-missing-allergens',
            operation: 'invalidateAndReaggregate',
            successfulCount: successfulIngredients.length,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processed: ingredients.length,
        successful,
        failed,
        skipped,
        results,
      },
    });
  } catch (err) {
    logger.error('[Detect Missing Allergens API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/ingredients/detect-missing-allergens', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to detect missing allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
