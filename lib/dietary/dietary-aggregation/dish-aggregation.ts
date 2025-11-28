/**
 * Dish dietary status aggregation.
 * Aggregates vegetarian/vegan status for dishes from recipes and ingredients.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectDietarySuitability, DietaryDetectionResult } from '../vegetarian-vegan-detection';
import { cacheDietaryStatus } from './cache-management';
import type { Ingredient } from './types';

/**
 * Aggregate dietary status for a single dish
 * Aggregates from dish recipes and ingredients
 *
 * @param {string} dishId - Dish ID
 * @param {boolean} useAI - Use AI detection (optional)
 * @param {boolean} force - Force recalculation even if cached (optional, default: false)
 * @returns {Promise<DietaryDetectionResult | null>} Dietary detection result
 */
export async function aggregateDishDietaryStatus(
  dishId: string,
  useAI?: boolean,
  force: boolean = false,
): Promise<DietaryDetectionResult | null> {
  if (!supabaseAdmin) {
    logger.error('[Dietary Aggregation] Supabase admin client not available');
    return null;
  }

  try {
    // Check cached status
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('is_vegetarian, is_vegan, dietary_confidence, dietary_method, dietary_checked_at')
      .eq('id', dishId)
      .single();

    if (dishError) {
      // Dishes table might not exist
      return null;
    }

    // Return cached status if available and recent and not forcing
    if (
      !force &&
      dish?.is_vegetarian !== null &&
      dish?.is_vegan !== null &&
      dish?.dietary_checked_at
    ) {
      const checkedAt = new Date(dish.dietary_checked_at);
      const daysSinceCheck = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCheck < 7) {
        return {
          isVegetarian: dish.is_vegetarian,
          isVegan: dish.is_vegan,
          confidence: (dish.dietary_confidence as 'high' | 'medium' | 'low') || 'medium',
          method: (dish.dietary_method as 'non-ai' | 'ai') || 'non-ai',
        };
      }
    }

    const allIngredients: Ingredient[] = [];

    // Fetch ingredients from dish recipes
    const { data: dishRecipes } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        recipes (
          recipe_name,
          recipe_ingredients (
            ingredient_id,
            ingredients (
              ingredient_name,
              category,
              allergens
            )
          )
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipes) {
      dishRecipes.forEach(dr => {
        const recipe = dr.recipes as {
          recipe_ingredients?: Array<{
            ingredients?: {
              ingredient_name?: string;
              category?: string;
              allergens?: string[];
            } | null;
          }>;
        } | null;
        if (recipe?.recipe_ingredients) {
          recipe.recipe_ingredients.forEach(ri => {
            const ing = ri.ingredients;
            if (ing) {
              const rawAllergens = ing.allergens || [];
              // Consolidate allergens to handle old codes and ensure consistency
              const consolidatedAllergens = consolidateAllergens(
                Array.isArray(rawAllergens) ? rawAllergens : [],
              );
              allIngredients.push({
                ingredient_name: ing.ingredient_name || '',
                category: ing.category,
                allergens: consolidatedAllergens,
              });
            }
          });
        }
      });
    }

    // Fetch ingredients from dish ingredients
    const { data: dishIngredients } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        ingredient_id,
        ingredients (
          ingredient_name,
          category,
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredients) {
      dishIngredients.forEach(di => {
        const ing = di.ingredients as {
          ingredient_name?: string;
          category?: string;
          allergens?: string[];
        } | null;
        if (ing) {
          const rawAllergens = ing.allergens || [];
          // Consolidate allergens to handle old codes and ensure consistency
          const consolidatedAllergens = consolidateAllergens(
            Array.isArray(rawAllergens) ? rawAllergens : [],
          );
          allIngredients.push({
            ingredient_name: ing.ingredient_name || '',
            category: ing.category,
            allergens: consolidatedAllergens,
          });
        }
      });
    }

    // Fetch dish name (needed for detection and name-based check)
    const { data: dishData } = await supabaseAdmin
      .from('dishes')
      .select('dish_name, description')
      .eq('id', dishId)
      .single();

    if (allIngredients.length === 0) {
      // No ingredients - check dish name for non-vegetarian keywords
      const { isNonVegetarianIngredient } = await import(
        '@/lib/dietary/vegetarian-vegan-detection'
      );
      const dishName = dishData?.dish_name || '';

      // If dish name contains meat/fish keywords, mark as non-vegetarian
      if (dishName && isNonVegetarianIngredient(dishName)) {
        const result: DietaryDetectionResult = {
          isVegetarian: false,
          isVegan: false,
          confidence: 'high',
          reason: `Dish name "${dishName}" contains meat/fish keywords`,
          method: 'non-ai',
        };
        await cacheDietaryStatus(dishId, result, 'dish', []);
        return result;
      }

      // No ingredients and no meat/fish in name, default to vegetarian/vegan
      const result: DietaryDetectionResult = {
        isVegetarian: true,
        isVegan: true,
        confidence: 'high',
        reason: 'No ingredients specified',
        method: 'non-ai',
      };
      await cacheDietaryStatus(dishId, result, 'dish', []);
      return result;
    }

    // Collect all allergens from ingredients for validation
    const allIngredientAllergens: string[] = [];
    allIngredients.forEach(ing => {
      if (ing.allergens && Array.isArray(ing.allergens)) {
        allIngredientAllergens.push(...ing.allergens);
      }
    });
    const aggregatedAllergens = consolidateAllergens(allIngredientAllergens);

    // Run detection
    const result = await detectDietarySuitability(
      dishId,
      allIngredients,
      dishData?.dish_name,
      dishData?.description,
      useAI,
    );

    // Cache the result (pass aggregated allergens for validation)
    await cacheDietaryStatus(dishId, result, 'dish', aggregatedAllergens);

    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating dish dietary status:', err);
    return null;
  }
}
