import { ApiErrorHandler } from '@/lib/api-error-handler';
import { groupBy } from '@/lib/api/batch-utils';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ items: [] });
    }

    interface BatchIngredientData {
      id: string;
      ingredient_name: string;
      unit?: string;
      cost_per_unit?: number;
      trim_peel_waste_percentage?: number;
      yield_percentage?: number;
    }

    interface BatchRecipeIngredientRow {
      id: string;
      recipe_id: string;
      ingredient_id: string;
      quantity: number;
      unit: string;
      ingredients?: BatchIngredientData; // Can be undefined if join fails
    }

    // Fetch all recipe ingredients in a single query
    const { data, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          unit,
          cost_per_unit,
          trim_peel_waste_percentage,
          yield_percentage
        )
      `,
      )
      .in('recipe_id', normalizedIds);

    if (error) {
      logger.error('[Recipes API] Database error fetching batch recipe ingredients:', {
        error: error.message,
        code: error.code,
        context: {
          endpoint: '/api/recipes/ingredients/batch',
          operation: 'POST',
          recipeCount: normalizedIds.length,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // If no data, return empty grouped results
    if (!data || data.length === 0) {
      const grouped: Record<string, unknown[]> = {};
      normalizedIds.forEach(id => {
        grouped[id] = [];
      });
      return NextResponse.json({ items: grouped });
    }

    // Server-side fallback: if nested ingredients join is missing/null for some rows,
    // do a bulk lookup from ingredients and merge to ensure uniform shape
    let rows: any[] = data;
    const missingNested = rows.some((r: any) => !r.ingredients);
    if (missingNested) {
      const uniqueIds = Array.from(
        new Set(rows.map((r: any) => r.ingredient_id).filter((v: unknown) => Boolean(v))),
      );
      if (uniqueIds.length > 0) {
        const { data: ingRows, error: ingError } = await supabaseAdmin
          .from('ingredients')
          .select(
            'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
          )
          .in('id', uniqueIds);
        if (!ingError && ingRows) {
          const byId: Record<string, unknown> = {};
          ingRows.forEach(ir => {
            byId[ir.id] = ir;
          });
          rows = rows.map((r: any) => ({
            ...r,
            ingredients: r.ingredients || byId[r.ingredient_id],
          }));
        }
      }
    }

    // Normalize and format items
    const items = rows.map((row: any) => {
      const ing: any = row.ingredients || {};
      return {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          // Use ingredient_name as the canonical field
          ingredient_name: ing.ingredient_name || 'Unknown',
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit || row.unit || null,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
        },
      };
    });

    // Group by recipe_id
    const grouped = groupBy(items, item => item.recipe_id);

    // Ensure all requested recipe IDs are in the response (even if empty)
    normalizedIds.forEach(id => {
      if (!grouped[id]) {
        grouped[id] = [];
      }
    });

    return NextResponse.json({ items: grouped });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/ingredients/batch', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
