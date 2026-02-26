import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { IngredientRecord, ParLevelRecord } from '../types';

export async function fetchFallback(
  supabaseAdmin: SupabaseClient,
  originalError: { message?: string; code?: string },
) {
  logger.warn('[Par Levels API] Join failed, trying without join:', {
    error: originalError.message,
    code: originalError.code,
  });

  // Try simple select first
  const { data: simpleData, error: simpleError } = await supabaseAdmin
    .from('par_levels')
    .select('*')
    .order('created_at', { ascending: false });

  if (simpleError) {
    // Table or columns don't exist
    return {
      data: null,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          `Database error: ${simpleError.message}. Please ensure the par_levels table exists and has the required columns.`,
          'DATABASE_ERROR',
          500,
          {
            error: simpleError.message,
            code: simpleError.code,
            instructions: [
              'Please run the migration script: migrations/add-par-levels-columns.sql',
              'Ensure the par_levels table exists with columns: id, ingredient_id, par_level, reorder_point, unit, created_at, updated_at',
            ],
          },
        ),
        { status: 500 },
      ),
    };
  }

  let data: (ParLevelRecord & { ingredients?: IngredientRecord | null })[] = simpleData ?? [];
  let error: NextResponse | null = null;

  // If we got data without join, fetch ingredients separately
  if (simpleData && simpleData.length > 0) {
    const ingredientIds = simpleData
      .map((pl: ParLevelRecord) => pl.ingredient_id)
      .filter((id: string | undefined) => id);

    if (ingredientIds.length > 0) {
      const { data: ingredientsData, error: ingredientsError } = await supabaseAdmin
        .from('ingredients')
        .select('id, ingredient_name, unit, category')
        .in('id', ingredientIds);

      if (ingredientsError) {
        logger.warn('[Par Levels API] Error fetching ingredients for par levels:', {
          error: ingredientsError.message,
          code: ingredientsError.code,
          ingredientIds,
        });
        // Continue without ingredients - par levels will have null ingredients
        data = simpleData.map((pl: ParLevelRecord) => ({ ...pl, ingredients: null }));
        error = null;
      } else {
        // Merge ingredients into par levels
        const ingredientsArray = (ingredientsData || []) as IngredientRecord[];
        const ingredientsMap = new Map(ingredientsArray.map(ing => [ing.id, ing]));
        data = simpleData.map((pl: ParLevelRecord) => ({
          ...pl,
          ingredients: ingredientsMap.get(pl.ingredient_id) || null,
        }));
        error = null;
      }
    } else {
      data = simpleData.map((pl: ParLevelRecord) => ({ ...pl, ingredients: null }));
      error = null;
    }
  }

  return { data: data || [], error };
}
