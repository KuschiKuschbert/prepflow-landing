/**
 * Recipe allergen aggregation helper
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  batchAggregateRecipeAllergens,
  extractAllergenSources,
} from '@/lib/allergens/allergen-aggregation';

export interface RecipeAllergenData {
  allergensByRecipe: Record<string, string[]>;
  recipeIngredientSources: Record<string, Record<string, string[]>>;
}

/**
 * Aggregates allergens for recipes
 *
 * @param {any[]} recipes - Array of recipe objects
 * @returns {Promise<RecipeAllergenData>} Aggregated allergen data
 */
export async function aggregateRecipeAllergens(recipes: any[]): Promise<RecipeAllergenData> {
  // Batch aggregate allergens for recipes
  let allergensByRecipe: Record<string, string[]> = {};
  try {
    const recipeIds = (recipes || []).map(r => r.id);
    allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
  } catch (err) {
    logger.warn('[Allergen Export] Error batch aggregating recipe allergens:', err);
  }

  // Fetch ingredient sources for recipes
  const recipeIngredientSources: Record<string, Record<string, string[]>> = {};
  try {
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        recipe_id,
        ingredients (
          id,
          ingredient_name,
          allergens
        )
      `,
      );

    if (!recipeIngredientsError && recipeIngredients) {
      const ingredientsByRecipe: Record<
        string,
        Array<{ ingredient_name: string; allergens?: string[] }>
      > = {};
      recipeIngredients.forEach((ri: any) => {
        const recipeId = ri.recipe_id;
        const ingredient = ri.ingredients;
        if (recipeId && ingredient) {
          if (!ingredientsByRecipe[recipeId]) {
            ingredientsByRecipe[recipeId] = [];
          }
          ingredientsByRecipe[recipeId].push({
            ingredient_name: ingredient.ingredient_name,
            allergens: ingredient.allergens,
          });
        }
      });

      Object.entries(ingredientsByRecipe).forEach(([recipeId, ingredients]) => {
        recipeIngredientSources[recipeId] = extractAllergenSources(ingredients);
      });
    }
  } catch (err) {
    logger.warn('[Allergen Export] Error fetching recipe ingredient sources:', err);
  }

  return { allergensByRecipe, recipeIngredientSources };
}
