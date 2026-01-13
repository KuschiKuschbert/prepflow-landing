import {
  invalidateDishesWithIngredient,
  invalidateRecipesWithIngredient,
} from '@/lib/allergens/cache-invalidation';
import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { invalidateMenuItemsWithIngredient } from '@/lib/menu-pricing/cache-invalidation';
import { createSupabaseAdmin } from '@/lib/supabase';
import { buildChangeDetails } from './buildChangeDetails';
import { formatIngredientUpdates } from './formatIngredientUpdates';

import { UpdateIngredientData } from './schemas';

/**
 * Update an ingredient.
 *
 * @param {string} id - Ingredient ID
 * @param {UpdateIngredientData} updates - Update data
 * @param {string} userEmail - User email (for change tracking)
 * @returns {Promise<Object>} Updated ingredient
 * @throws {Error} If update fails
 */
export async function updateIngredient(
  id: string,
  updates: UpdateIngredientData,
  userEmail?: string | null,
) {
  const supabaseAdmin = createSupabaseAdmin();

  // Check if allergens are being updated (explicitly or auto-detected)
  let allergensChanged = updates.allergens !== undefined;

  // Check if name or brand is changing (which might affect allergens)
  const nameOrBrandChanged = updates.ingredient_name !== undefined || updates.brand !== undefined;

  // Fetch current ingredient to check if allergens are manually set
  let currentIngredient: {
    ingredient_name: string;
    brand: string | null;
    allergens: string[];
    allergen_source: { manual?: boolean; ai?: boolean; method?: string } | null;
  } | null = null;
  if (nameOrBrandChanged && !allergensChanged) {
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('ingredients')
      .select('ingredient_name, brand, allergens, allergen_source')
      .eq('id', id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logger.warn('[Ingredients API] Error fetching current ingredient for allergen check:', {
        error: fetchError.message,
        code: (fetchError as any).code,
        ingredientId: id,
      });
      // Continue without current ingredient - allergen detection will be skipped
    }

    if (!fetchError && current) {
      currentIngredient = current;
    }
  }

  const formattedUpdates = await formatIngredientUpdates(updates);

  // Auto-detect allergens if name/brand changed and allergens aren't manually set
  if (nameOrBrandChanged && !allergensChanged && currentIngredient) {
    const hasManualAllergens =
      currentIngredient.allergen_source &&
      typeof currentIngredient.allergen_source === 'object' &&
      (currentIngredient.allergen_source as { manual?: boolean }).manual;

    if (!hasManualAllergens) {
      const ingredientName = formattedUpdates.ingredient_name || currentIngredient.ingredient_name;
      const ingredientBrand =
        formattedUpdates.brand !== undefined ? formattedUpdates.brand : currentIngredient.brand;

      if (ingredientName) {
        try {
          const enriched = await enrichIngredientWithAllergensHybrid({
            ingredient_name: ingredientName,
            brand: ingredientBrand || undefined,
            allergens: (currentIngredient.allergens as string[]) || [],
            allergen_source:
              (currentIngredient.allergen_source as {
                manual?: boolean;
                ai?: boolean;
              }) || {},
          });

          formattedUpdates.allergens = enriched.allergens;
          formattedUpdates.allergen_source = enriched.allergen_source;
          allergensChanged = true; // Mark allergens as changed for cache invalidation

          if (enriched.allergens.length > 0) {
            logger.dev('[Ingredients API] Auto-detected allergens on update:', {
              ingredient_id: id,
              ingredient_name: ingredientName,
              allergens: enriched.allergens,
              method: enriched.method,
            });
          }
        } catch (err) {
          // Don't fail update if allergen detection fails
          logger.warn('[Ingredients API] Failed to auto-detect allergens on update:', {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          });
        }
      }
    }
  }

  // Update using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .update(formattedUpdates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error('[Ingredients API] Database error updating ingredient:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/ingredients', operation: 'PUT', ingredientId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  if (!data) {
    throw ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404, {
      ingredientId: id,
    });
  }

  // Invalidate cached allergens for affected recipes and dishes if allergens changed
  if (allergensChanged) {
    // Don't await - run in background
    (async () => {
      try {
        await Promise.all([
          invalidateRecipesWithIngredient(id),
          invalidateDishesWithIngredient(id),
        ]);
      } catch (err) {
        logger.error('[Ingredients API] Error invalidating allergen caches:', {
          error: err instanceof Error ? err.message : String(err),
          context: { ingredientId: id, operation: 'invalidateAllergenCaches' },
        });
      }
    })();
  }

  // Invalidate cached recommended prices if cost changed
  const costChanged =
    formattedUpdates.cost_per_unit !== undefined ||
    formattedUpdates.cost_per_unit_as_purchased !== undefined ||
    formattedUpdates.cost_per_unit_incl_trim !== undefined ||
    formattedUpdates.trim_peel_waste_percentage !== undefined ||
    formattedUpdates.yield_percentage !== undefined;

  if (costChanged) {
    const changeDetails = buildChangeDetails(formattedUpdates);

    const ingredientName = data.ingredient_name || 'Unknown Ingredient';

    // Don't await - run in background
    (async () => {
      try {
        await invalidateMenuItemsWithIngredient(
          id,
          ingredientName,
          changeDetails,
          userEmail || null,
        );
      } catch (err) {
        logger.error('[Ingredients API] Error invalidating menu pricing cache:', {
          error: err instanceof Error ? err.message : String(err),
          context: { ingredientId: id, ingredientName, operation: 'invalidateMenuPricingCache' },
        });
      }
    })();
  }
  return data;
}
