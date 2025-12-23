import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '../australian-allergens';
import { collectAllergensFromIngredients, collectAllergensFromRecipes } from './collectAllergens';
import { cacheDishAllergens } from './cacheAllergens';

/**
 * Aggregate allergens for a single dish
 * Aggregates from both dish recipes and dish ingredients
 *
 * @param {string} dishId - Dish ID
 * @param {boolean} force - Force aggregation even if cached allergens exist
 * @returns {Promise<string[]>} Aggregated allergens
 */
export async function aggregateDishAllergens(
  dishId: string,
  force: boolean = false,
): Promise<string[]> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Aggregation] Supabase admin client not available');
    return [];
  }

  try {
    // Check if dish has cached allergens
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('allergens')
      .eq('id', dishId)
      .single();

    if (dishError) {
      // Dishes table might not exist, return empty
      return [];
    }

    // Return cached allergens if available and not forcing
    if (!force && dish?.allergens && Array.isArray(dish.allergens) && dish.allergens.length > 0) {
      return dish.allergens;
    }

    const allergenSet = new Set<string>();

    // Fetch allergens from dish recipes
    const { data: dishRecipes, error: recipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        recipes (
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (!recipesError && dishRecipes) {
      const recipeAllergens = collectAllergensFromRecipes(dishRecipes);
      recipeAllergens.forEach(allergen => allergenSet.add(allergen));
    }

    // Fetch allergens from dish ingredients
    const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        ingredient_id,
        ingredients (
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (!ingredientsError && dishIngredients) {
      const ingredientAllergens = collectAllergensFromIngredients(dishIngredients);
      ingredientAllergens.forEach(allergen => allergenSet.add(allergen));
    }

    // Consolidate allergens (map old codes to new and deduplicate)
    const allergens = consolidateAllergens(Array.from(allergenSet)).sort();

    // Cache the result
    await cacheDishAllergens(dishId, allergens);

    return allergens;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error aggregating dish allergens:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { dishId, operation: 'aggregateDishAllergens' },
    });
    return [];
  }
}
