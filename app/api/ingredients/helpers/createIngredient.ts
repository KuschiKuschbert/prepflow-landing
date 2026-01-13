import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

import { CreateIngredientInput } from './schemas';

/**
 * Create an ingredient with normalized data.
 *
 * @param {CreateIngredientInput} ingredientData - Raw ingredient data
 * @returns {Promise<Object>} Created ingredient
 * @throws {Error} If creation fails
 */
export async function createIngredient(ingredientData: CreateIngredientInput) {
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

  // Automatically detect allergens if not manually set
  // Check if allergens are manually set (user explicitly set them)
  const isManuallySet =
    normalized.allergen_source &&
    typeof normalized.allergen_source === 'object' &&
    (normalized.allergen_source as { manual?: boolean }).manual === true;

  // Always detect allergens for new ingredients unless they're manually set
  // This ensures allergens are detected even if the wizard didn't detect them
  if (!isManuallySet && normalized.ingredient_name) {
    try {
      const enriched = await enrichIngredientWithAllergensHybrid({
        ingredient_name: normalized.ingredient_name,
        brand: normalized.brand || undefined,
        allergens: (normalized.allergens as string[]) || [],
        allergen_source:
          (normalized.allergen_source as {
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
          wasManuallySet: isManuallySet,
        });
      } else {
        logger.dev('[Ingredients API] No allergens detected on create:', {
          ingredient_name: normalized.ingredient_name,
          brand: normalized.brand,
        });
      }
    } catch (err) {
      // Don't fail creation if allergen detection fails
      logger.warn('[Ingredients API] Failed to auto-detect allergens on create:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        ingredient_name: normalized.ingredient_name,
      });
    }
  } else if (isManuallySet) {
    logger.dev('[Ingredients API] Skipping allergen detection - manually set:', {
      ingredient_name: normalized.ingredient_name,
      allergens: normalized.allergens,
    });
  }

  // Insert using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin.from('ingredients').insert([normalized]).select();

  if (error) {
    logger.error('[Ingredients API] Database error inserting ingredient:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/ingredients', operation: 'POST', table: 'ingredients' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  const createdIngredient = data?.[0] || null;

  // If allergens were provided, invalidate caches for affected recipes/dishes
  if (
    createdIngredient &&
    normalized.allergens &&
    Array.isArray(normalized.allergens) &&
    normalized.allergens.length > 0
  ) {
    // Don't await - run in background
    (async () => {
      try {
        const { invalidateRecipesWithIngredient, invalidateDishesWithIngredient } =
          await import('@/lib/allergens/cache-invalidation');
        await Promise.all([
          invalidateRecipesWithIngredient(createdIngredient.id),
          invalidateDishesWithIngredient(createdIngredient.id),
        ]);
      } catch (err) {
        logger.error('[Ingredients API] Error invalidating allergen caches:', {
          error: err instanceof Error ? err.message : String(err),
          context: { ingredientId: createdIngredient.id, operation: 'invalidateAllergenCaches' },
        });
      }
    })();
  }

  return createdIngredient;
}
