/**
 * Dish allergen aggregation helper
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  aggregateDishAllergens,
  extractAllergenSources,
  mergeAllergenSources,
} from '@/lib/allergens/allergen-aggregation';

export interface DishWithAllergens {
  id: string;
  dish_name: string;
  description?: string;
  allergens: string[];
  allergenSources: Record<string, string[]>;
}

/**
 * Aggregates allergens for dishes
 *
 * @param {any[]} dishes - Array of dish objects
 * @param {Record<string, Record<string, string[]>>} recipeIngredientSources - Recipe allergen sources
 * @returns {Promise<DishWithAllergens[]>} Dishes with aggregated allergens
 */
export async function aggregateDishAllergensForExport(
  dishes: any[],
  recipeIngredientSources: Record<string, Record<string, string[]>>,
): Promise<DishWithAllergens[]> {
  return Promise.all(
    (dishes || []).map(async dish => {
      let allergens: string[] = [];
      const allergenSources: Record<string, string[]> = {};

      try {
        if (dish.allergens && Array.isArray(dish.allergens)) {
          allergens = dish.allergens;
        } else {
          allergens = await aggregateDishAllergens(dish.id);
        }

        // Fetch dish ingredients to get allergen sources
        if (!supabaseAdmin) {
          throw new Error('Supabase admin client not initialized');
        }
        const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
          .from('dish_ingredients')
          .select(
            `
            ingredients (
              id,
              ingredient_name,
              allergens
            )
          `,
          )
          .eq('dish_id', dish.id);

        if (!dishIngredientsError && dishIngredients) {
          const dishIngredientList = dishIngredients.map((di: any) => ({
            ingredient_name: di.ingredients?.ingredient_name || '',
            allergens: di.ingredients?.allergens,
          }));
          const dishIngredientSources = extractAllergenSources(dishIngredientList);
          Object.assign(allergenSources, dishIngredientSources);
        }

        // Also check dish recipes for allergens
        if (!supabaseAdmin) {
          throw new Error('Supabase admin client not initialized');
        }
        const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
          .from('dish_recipes')
          .select(
            `
            recipe_id,
            recipes (
              id
            )
          `,
          )
          .eq('dish_id', dish.id);

        if (!dishRecipesError && dishRecipes) {
          const recipeSources: Record<string, string[]>[] = [];
          dishRecipes.forEach((dr: any) => {
            const recipeId = dr.recipe_id;
            if (recipeId && recipeIngredientSources[recipeId]) {
              recipeSources.push(recipeIngredientSources[recipeId]);
            }
          });

          if (recipeSources.length > 0) {
            const mergedSources = mergeAllergenSources(allergenSources, ...recipeSources);
            Object.assign(allergenSources, mergedSources);
          }
        }
      } catch (err) {
        logger.warn('[Allergen Export] Error aggregating dish allergens:', err);
      }
      return { ...dish, allergens, allergenSources };
    }),
  );
}

