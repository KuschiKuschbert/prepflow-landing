import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const normalizedId = String(recipeId).trim();
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
      .eq('recipe_id', normalizedId);

    if (error) {
      logger.error('[Recipes API] Database error fetching recipe ingredients:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/recipes/[id]/ingredients',
          operation: 'GET',
          recipeId: normalizedId,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    if (!data || data.length === 0) {
      logger.debug('[Recipes API] No recipe_ingredients found', {
        context: { endpoint: '/api/recipes/[id]/ingredients', recipeId: normalizedId },
      });
      return NextResponse.json({ items: [] });
    }

    // Server-side fallback: if nested ingredients join is missing/null for some rows,
    // do a bulk lookup from ingredients and merge to ensure uniform shape
    let rows: any[] = data;
    const missingNested = rows.some(r => !r.ingredients);
    if (missingNested) {
      logger.debug('[Recipes API] Missing nested ingredients join; applying backfill', {
        context: { endpoint: '/api/recipes/[id]/ingredients', recipeId },
      });
      const uniqueIds = Array.from(
        new Set(rows.map(r => r.ingredient_id).filter((v: any) => Boolean(v))),
      );
      if (uniqueIds.length > 0) {
        const { data: ingRows, error: ingError } = await supabaseAdmin
          .from('ingredients')
          .select(
            'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
          )
          .in('id', uniqueIds);
        if (!ingError && ingRows) {
          const byId: Record<string, any> = {};
          ingRows.forEach(ir => {
            byId[ir.id] = ir;
          });
          rows = rows.map(r => ({ ...r, ingredients: r.ingredients || byId[r.ingredient_id] }));
        }
      }
    }

    const items = rows.map((row: any) => {
      const ing = row.ingredients || {};
      return {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          ingredient_name: ing.ingredient_name || 'Unknown',
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit || row.unit || null,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]/ingredients', method: 'GET' },
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

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { ingredients, isUpdate } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredients array is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If updating, delete existing ingredients first
    if (isUpdate) {
      const { error: deleteError } = await supabaseAdmin
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);

      if (deleteError) {
        logger.error('[Recipes API] Database error deleting existing ingredients:', {
          error: deleteError.message,
          code: (deleteError as any).code,
          context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId: id },
        });

        const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
    }

    // Insert new ingredients
    const recipeIngredientInserts = ingredients.map((ing: any) => ({
      recipe_id: id,
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
    }));

    const { data, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .insert(recipeIngredientInserts)
      .select();

    if (ingredientsError) {
      logger.error('[Recipes API] Database error saving recipe ingredients:', {
        error: ingredientsError.message,
        code: (ingredientsError as any).code,
        context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recipe ingredients saved successfully',
      data: data || [],
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]/ingredients', method: 'POST' },
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
