/**
 * Fetch ingredients with par levels
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string | null;
  pack_size?: string | null;
  pack_size_unit?: string | null;
  pack_price?: number | null;
  cost_per_unit?: number | null;
  unit?: string | null;
  storage?: string | null;
  storage_location?: string | null;
  category?: string | null;
}

export interface ParLevel {
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
}

export interface IngredientWithParLevel {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}

export async function fetchIngredientsWithParLevels(
  ingredientIds: Set<string>,
  menuId: string,
): Promise<IngredientWithParLevel[]> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Data connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch ingredient details
  const { data: ingredients, error: ingredientsError } = await supabaseAdmin
    .from('ingredients')
    .select('*')
    .in('id', Array.from(ingredientIds));

  if (ingredientsError) {
    logger.error('[Menu Ingredients API] Error fetching ingredients:', {
      error: ingredientsError.message,
      code: ingredientsError.code,
      context: { menuId },
    });

    // Provide helpful error message
    const errorMessage = ingredientsError.message || 'Unknown database error';
    if (errorMessage.includes('column') || errorMessage.includes('does not exist')) {
      throw ApiErrorHandler.createError('Database column not found', 'DATABASE_ERROR', 500, {
        message:
          'One or more data columns are missing. Please ensure your data structure is up to date.',
        details: errorMessage,
      });
    }

    throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
  }

  // Fetch par levels - handle case where table might not exist
  let parLevels: ParLevel[] = [];
  try {
    const { data, error: parLevelsError } = await supabaseAdmin
      .from('par_levels')
      .select('ingredient_id, par_level, reorder_point, unit')
      .in('ingredient_id', Array.from(ingredientIds));

    if (!parLevelsError && data) {
      parLevels = data as unknown as ParLevel[];
    } else if (parLevelsError) {
      // Table might not exist or have different structure - log but don't fail
      logger.warn('[Menu Ingredients API] Could not fetch par levels:', {
        error: parLevelsError.message,
        context: { menuId },
      });
    }
  } catch (err) {
    // Par levels are optional - continue without them
    logger.warn('[Menu Ingredients API] Error fetching par levels (continuing without them):', {
      error: err instanceof Error ? err.message : String(err),
      context: { menuId },
    });
  }

  // Create par levels map
  const parLevelsMap = new Map<
    string,
    { par_level?: number; reorder_point?: number; unit?: string }
  >();
  if (parLevels) {
    parLevels.forEach((pl) => {
      parLevelsMap.set(pl.ingredient_id, {
        par_level: pl.par_level,
        reorder_point: pl.reorder_point,
        unit: pl.unit,
      });
    });
  }

  // Combine ingredients with par levels
  const ingredientsWithParLevels: IngredientWithParLevel[] = (ingredients || []).map(
    (ing: Ingredient) => {
      const parLevel = parLevelsMap.get(ing.id);
      return {
        id: ing.id,
        ingredient_name: ing.ingredient_name,
        brand: ing.brand || undefined,
        pack_size: ing.pack_size || undefined,
        pack_size_unit: ing.pack_size_unit || ing.unit || undefined,
        pack_price: ing.pack_price || undefined,
        cost_per_unit: ing.cost_per_unit || 0,
        unit: ing.unit || undefined,
        storage: ing.storage || ing.storage_location || 'Uncategorized',
        category: ing.category || undefined,
        par_level: parLevel?.par_level,
        reorder_point: parLevel?.reorder_point,
        par_unit: parLevel?.unit,
      };
    },
  );

  return ingredientsWithParLevels;
}
