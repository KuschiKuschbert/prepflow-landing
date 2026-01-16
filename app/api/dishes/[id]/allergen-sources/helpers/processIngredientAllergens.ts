/**
 * Helper for processing ingredient allergens for a dish
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { supabaseAdmin } from '@/lib/supabase';
import type { AllergenSource } from './processRecipeAllergens';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { IngredientRecord } from '../../../types';

interface RawIngredientJoin {
  id: string;
  ingredient_name: string;
  brand?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

/**
 * Processes ingredient allergens for a dish
 *
 * @param {string} dishId - Dish ID
 * @param {Record<string, AllergenSource[]>} allergenSources - Allergen sources map to populate
 * @param {Set<string>} allAllergens - Set of all allergens to populate
 * @returns {Promise<void>}
 */
export async function processIngredientAllergens(
  dishId: string,
  allergenSources: Record<string, AllergenSource[]>,
  allAllergens: Set<string>,
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      ingredient_id,
      quantity,
      unit,
      ingredients (
        id,
        ingredient_name,
        brand,
        allergens,
        allergen_source
      )
    `,
    )
    .eq('dish_id', dishId);

  if (ingredientsError) {
    // Log error but don't throw - caller handles empty result
    const { logger } = await import('@/lib/logger');
    logger.warn('[Process Ingredient Allergens] Error fetching dish ingredients:', {
      error: ingredientsError.message,
      code: ingredientsError.code,
      context: { dishId, operation: 'fetchDishIngredients' },
    });
    return;
  }

  if (!dishIngredients) {
    return;
  }

  dishIngredients.forEach(di => {
    const ingredient = di.ingredients as unknown as IngredientRecord | null;


    if (!ingredient) return;

    const allergens = (ingredient.allergens as string[]) || [];
    const consolidatedAllergens = consolidateAllergens(allergens);

    consolidatedAllergens.forEach(allergen => {
      if (typeof allergen === 'string' && allergen.length > 0) {
        allAllergens.add(allergen);

        if (!allergenSources[allergen]) {
          allergenSources[allergen] = [];
        }

        allergenSources[allergen].push({
          source_type: 'ingredient',
          source_id: ingredient.id,
          source_name: ingredient.brand
            ? `${ingredient.ingredient_name} (${ingredient.brand})`
            : ingredient.ingredient_name,
          quantity: di.quantity || undefined,
          unit: di.unit || undefined,
          allergen_source: ingredient.allergen_source || undefined,
        });
      }
    });
  });
}
