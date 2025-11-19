import { ApiErrorHandler } from '@/lib/api-error-handler';
import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';

/**
 * Create an ingredient with normalized data.
 *
 * @param {Object} ingredientData - Raw ingredient data
 * @returns {Promise<Object>} Created ingredient
 * @throws {Error} If creation fails
 */
export async function createIngredient(ingredientData: any) {
  const supabaseAdmin = createSupabaseAdmin();

  // Normalize ingredient data
  const { normalized, error: normalizeError } = normalizeIngredientData(ingredientData);
  if (normalizeError) {
    throw ApiErrorHandler.createError(
      'Failed to normalize ingredient data',
      'VALIDATION_ERROR',
      400,
      {
        details: normalizeError,
      },
    );
  }

  // Automatically detect allergens if not provided or manually set
  const hasManualAllergens =
    normalized.allergens &&
    Array.isArray(normalized.allergens) &&
    normalized.allergens.length > 0 &&
    normalized.allergen_source &&
    typeof normalized.allergen_source === 'object' &&
    (normalized.allergen_source as { manual?: boolean }).manual;

  if (!hasManualAllergens && normalized.ingredient_name) {
    try {
      const enriched = await enrichIngredientWithAllergensHybrid({
        ingredient_name: normalized.ingredient_name,
        brand: normalized.brand || undefined,
        allergens: (normalized.allergens as string[]) || [],
        allergen_source: (normalized.allergen_source as {
          manual?: boolean;
          ai?: boolean;
        }) || {},
      });

      normalized.allergens = enriched.allergens;
      normalized.allergen_source = enriched.allergen_source;

      if (enriched.allergens.length > 0) {
        logger.dev('[Ingredients API] Auto-detected allergens on create:', {
          ingredient_name: normalized.ingredient_name,
          allergens: enriched.allergens,
          method: enriched.method,
        });
      }
    } catch (err) {
      // Don't fail creation if allergen detection fails
      logger.warn('[Ingredients API] Failed to auto-detect allergens on create:', err);
    }
  }

  // Insert using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin.from('ingredients').insert([normalized]).select();

  if (error) {
    logger.error('[Ingredients API] Database error inserting ingredient:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/ingredients', operation: 'POST', table: 'ingredients' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  const createdIngredient = data?.[0] || null;

  // If allergens were provided, invalidate caches for affected recipes/dishes
  if (createdIngredient && normalized.allergens && Array.isArray(normalized.allergens) && normalized.allergens.length > 0) {
    // Don't await - run in background
    import('@/lib/allergens/cache-invalidation').then(({ invalidateRecipesWithIngredient, invalidateDishesWithIngredient }) => {
      Promise.all([
        invalidateRecipesWithIngredient(createdIngredient.id),
        invalidateDishesWithIngredient(createdIngredient.id),
      ]).catch(err => {
        logger.error('[Ingredients API] Error invalidating allergen caches:', err);
      });
    });
  }

  return createdIngredient;
}
