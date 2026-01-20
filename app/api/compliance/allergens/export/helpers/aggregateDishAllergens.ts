/**
 * Dish allergen aggregation helper
 */

import {
    aggregateDishAllergens
} from '@/lib/allergens/allergen-aggregation';
import { logger } from '@/lib/logger';
import { getDishIngredientSources, getDishRecipeSources } from './dataFetchers';

export interface DishWithAllergens {
  id: string;
  dish_name: string;
  description?: string;
  allergens: string[];
  allergenSources: Record<string, string[]>;
}

interface InputDish {
  id: string;
  dish_name: string;
  description?: string;
  allergens?: string[];
}

interface DishIngredient {
  ingredients?: {
    id?: string;
    ingredient_name?: string;
    allergens?: string[];
  };
}

interface DishRecipe {
  recipe_id: string;
  recipes?: { id: string }[];
}

/**
 * Aggregates allergens for dishes
 *
 * @param {InputDish[]} dishes - Array of dish objects
 * @param {Record<string, Record<string, string[]>>} recipeIngredientSources - Recipe allergen sources
 * @returns {Promise<DishWithAllergens[]>} Dishes with aggregated allergens
 */
export async function aggregateDishAllergensForExport(
  dishes: InputDish[],
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

        const ingredientSources = await getDishIngredientSources(dish.id);
        Object.assign(allergenSources, ingredientSources);

        const recipeSources = await getDishRecipeSources(dish.id, recipeIngredientSources);
        Object.assign(allergenSources, recipeSources);

      } catch (err) {
        logger.warn('[Allergen Export] Error aggregating dish allergens:', err);
      }
      return { ...dish, allergens, allergenSources };
    }),
  );
}
