import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { batchAggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { recipeIds } = body;

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
      `[Batch Allergen Aggregation] Batch fetching allergens for ${normalizedIds.length} recipe IDs`,
    );

    // Batch aggregate allergens
    const allergensByRecipe = await batchAggregateRecipeAllergens(normalizedIds);

    // Ensure all requested recipe IDs are in the response (even if empty)
    const result: Record<string, string[]> = {};
    normalizedIds.forEach(id => {
      result[id] = allergensByRecipe[id] || [];
    });

    return NextResponse.json({
      success: true,
      data: {
        items: result,
      },
    });
  } catch (err) {
    logger.error('[Batch Allergen Aggregation] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to batch aggregate allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
