import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserEmail } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { backfillMissingIngredients } from './helpers/backfillMissingIngredients';
import { handleRecipeIngredientsError } from './helpers/handleRecipeIngredientsError';
import { mapRecipeIngredients } from './helpers/mapRecipeIngredients';
import { saveRecipeIngredients } from './helpers/saveRecipeIngredients';

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

    // First try with category, fallback without if column doesn't exist
    let { data, error } = await supabaseAdmin
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
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category,
          brand,
          allergens,
          allergen_source
        )
      `,
      )
      .eq('recipe_id', normalizedId);

    // If category column doesn't exist, retry without it
    if (error && (error as any).code === '42703' && (error as any).message?.includes('category')) {
      logger.warn('[Recipes API] Category column not found, retrying without category', {
        context: { endpoint: '/api/recipes/[id]/ingredients', recipeId: normalizedId },
      });

      const retryResult = await supabaseAdmin
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
            cost_per_unit_incl_trim,
            trim_peel_waste_percentage,
            yield_percentage,
            brand,
            allergens,
            allergen_source
          )
        `,
        )
        .eq('recipe_id', normalizedId);

      // Normalize the retry result to include category as null for type compatibility
      data = retryResult.data?.map((item: any) => ({
        ...item,
        ingredients: item.ingredients?.map((ing: any) => ({
          ...ing,
          category: ing.category ?? null,
        })),
      })) as typeof data;
      error = retryResult.error;
    }

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

    // Backfill missing nested ingredients and map to normalized format
    const rows = await backfillMissingIngredients(data, normalizedId);
    const items = mapRecipeIngredients(rows);

    return NextResponse.json({ items });
  } catch (err) {
    return handleRecipeIngredientsError(err, 'GET');
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
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

    // Get user email for change tracking
    let userEmail: string | null = null;
    try {
      userEmail = await getUserEmail(request);
    } catch (tokenError) {
      // Continue without user email if auth fails (for development)
      logger.warn('[Recipes API] Could not get user email for change tracking:', tokenError);
    }

    // Fetch recipe name for change tracking
    let recipeName: string | null = null;
    try {
      const { data } = await supabaseAdmin
        .from('recipes')
        .select('recipe_name')
        .eq('id', recipeId)
        .single();
      recipeName = data?.recipe_name || null;
    } catch (err) {
      logger.warn('[Recipes API] Could not fetch recipe name for change tracking:', err);
    }

    const data = await saveRecipeIngredients(
      recipeId,
      ingredients,
      isUpdate,
      recipeName,
      userEmail,
    );

    return NextResponse.json({
      success: true,
      message: 'Recipe ingredients saved successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleRecipeIngredientsError(err, 'POST');
  }
}
