/**
 * Batch Dietary Aggregation API Endpoint
 * POST /api/recipes/dietary/batch
 * Batch detect dietary suitability for multiple recipes
 */

import { z } from 'zod';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { recipeIds, useAI } = body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('recipeIds must be a non-empty array', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Normalize recipe IDs
    const normalizedIds = recipeIds.map(id => String(id).trim()).filter(Boolean);

    if (normalizedIds.length === 0) {
      return NextResponse.json({ items: {} });
    }

    logger.dev(
      `[Batch Dietary Aggregation] Batch detecting dietary status for ${normalizedIds.length} recipe IDs`,
    );

    // Batch aggregate dietary status (process in parallel)
    const results = await Promise.all(
      normalizedIds.map(async recipeId => {
        try {
          const status = await aggregateRecipeDietaryStatus(recipeId, useAI);
          return { recipeId, status };
        } catch (err) {
          logger.error('[Batch Dietary Aggregation] Error for recipe:', {
            recipeId,
            error: err instanceof Error ? err.message : String(err),
          });
          return { recipeId, status: null };
        }
      }),
    );

    // Build result object
    const result: Record<string, unknown> = {};
    results.forEach(({ recipeId, status }) => {
      result[recipeId] = status || {
        isVegetarian: null,
        isVegan: null,
        confidence: 'low' as const,
        method: 'non-ai' as const,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: result,
      },
    });
  } catch (err) {
    logger.error('[Batch Dietary Aggregation] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to batch aggregate dietary status',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
