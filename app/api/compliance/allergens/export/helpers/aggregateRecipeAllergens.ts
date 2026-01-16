/**
 * Recipe allergen aggregation helper
 */

import {
    batchAggregateRecipeAllergens,
    extractAllergenSources,
} from '@/lib/allergens/allergen-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface RecipeAllergenData {
  allergensByRecipe: Record<string, string[]>;
  recipeIngredientSources: Record<string, Record<string, string[]>>;
}

interface InputRecipe {
  id: string;
  name?: string;
}

interface RecipeIngredientRow {
  recipe_id: string;
  ingredients?: {
    id?: string;
    ingredient_name?: string;
    allergens?: string[];
  };
}

/**
 * Aggregates allergens for recipes
 *
 * @param {InputRecipe[]} recipes - Array of recipe objects
 * @returns {Promise<RecipeAllergenData>} Aggregated allergen data
 */
export async function aggregateRecipeAllergens(recipes: InputRecipe[]): Promise<RecipeAllergenData> {
  // Batch aggregate allergens for recipes
  let allergensByRecipe: Record<string, string[]> = {};
  try {
    const recipeIds = (recipes || []).map(r => r.id);
    allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
  } catch (err) {
    logger.warn('[Allergen Export] Error batch aggregating recipe allergens:', err);
  }

  if (!supabaseAdmin) {
    logger.error('[Allergen Export] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
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
      (recipeIngredients as RecipeIngredientRow[]).forEach((ri) => {
        const recipeId = ri.recipe_id;
        const ingredient = ri.ingredients;
        if (recipeId && ingredient) {
          if (!ingredientsByRecipe[recipeId]) {
            ingredientsByRecipe[recipeId] = [];
          }
          ingredientsByRecipe[recipeId].push({
            ingredient_name: ingredient.ingredient_name || '',
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
