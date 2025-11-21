/**
 * Helper functions for dish data population (extracted to keep dishes-data.ts under 150 lines)
 */

import { logger } from '@/lib/logger';
import { cleanSampleDishes } from '@/lib/sample-dishes-clean';

/**
 * Create lookup maps for recipes and ingredients
 */
export function createLookupMaps(recipesData: any[], ingredientsData: any[]) {
  const recipeMap = new Map<string, string>();
  recipesData.forEach(r => {
    const name = r.recipe_name || r.name;
    if (name) {
      recipeMap.set(name.toLowerCase().trim(), r.id);
      recipeMap.set(name, r.id);
    }
  });

  const ingredientMap = new Map<string, string>();
  if (ingredientsData) {
    ingredientsData.forEach(i => {
      const name = i.ingredient_name;
      if (name) {
        ingredientMap.set(name.toLowerCase().trim(), i.id);
        ingredientMap.set(name, i.id);
      }
    });

    logger.dev('[createLookupMaps] Created ingredient map', {
      totalIngredients: ingredientsData.length,
      mapSize: ingredientMap.size,
      sampleKeys: Array.from(ingredientMap.keys()).slice(0, 10),
    });
  } else {
    logger.warn('[createLookupMaps] No ingredients data provided');
  }

  return { recipeMap, ingredientMap };
}

/**
 * Create dish map from dishes data
 */
export function createDishMap(dishesData: any[]): Map<string, string> {
  const dishMap = new Map<string, string>();
  dishesData.forEach(d => {
    const name = d.dish_name;
    if (name) {
      dishMap.set(name.toLowerCase().trim(), d.id);
      dishMap.set(name, d.id);
    }
  });
  return dishMap;
}

/**
 * Build dish_recipes insert data
 */
export function buildDishRecipesData(
  dishMap: Map<string, string>,
  recipeMap: Map<string, string>,
): { data: Array<{ dish_id: string; recipe_id: string; quantity: number }>; skipped: string[] } {
  const dishRecipesToInsert: Array<{
    dish_id: string;
    recipe_id: string;
    quantity: number;
  }> = [];
  const skippedRecipes: string[] = [];

  for (const dishDef of cleanSampleDishes) {
    const dishId =
      dishMap.get(dishDef.dish_name.toLowerCase().trim()) || dishMap.get(dishDef.dish_name);
    if (!dishId) continue;

    for (const recipeLink of dishDef.recipes) {
      const recipeId =
        recipeMap.get(recipeLink.recipe_name.toLowerCase().trim()) ||
        recipeMap.get(recipeLink.recipe_name);

      if (!recipeId) {
        skippedRecipes.push(`${dishDef.dish_name} → ${recipeLink.recipe_name}`);
        continue;
      }

      dishRecipesToInsert.push({
        dish_id: dishId,
        recipe_id: recipeId,
        quantity: recipeLink.quantity,
      });
    }
  }

  return { data: dishRecipesToInsert, skipped: skippedRecipes };
}

/**
 * Build dish_ingredients insert data
 */
export function buildDishIngredientsData(
  dishMap: Map<string, string>,
  ingredientMap: Map<string, string>,
): {
  data: Array<{ dish_id: string; ingredient_id: string; quantity: number; unit: string }>;
  skipped: string[];
} {
  const dishIngredientsToInsert: Array<{
    dish_id: string;
    ingredient_id: string;
    quantity: number;
    unit: string;
  }> = [];
  const skippedIngredients: string[] = [];

  logger.dev('[buildDishIngredientsData] Starting ingredient linking', {
    totalDishes: cleanSampleDishes.length,
    dishesWithIngredients: cleanSampleDishes.filter(d => d.ingredients && d.ingredients.length > 0)
      .length,
    ingredientMapSize: ingredientMap.size,
  });

  for (const dishDef of cleanSampleDishes) {
    if (!dishDef.ingredients || dishDef.ingredients.length === 0) continue;

    const dishId =
      dishMap.get(dishDef.dish_name.toLowerCase().trim()) || dishMap.get(dishDef.dish_name);
    if (!dishId) {
      logger.warn(`[buildDishIngredientsData] Dish "${dishDef.dish_name}" not found in dish map`);
      continue;
    }

    for (const ingredientLink of dishDef.ingredients) {
      const ingredientNameLower = ingredientLink.ingredient_name.toLowerCase().trim();
      const ingredientId =
        ingredientMap.get(ingredientNameLower) || ingredientMap.get(ingredientLink.ingredient_name);

      if (!ingredientId) {
        const availableKeys = Array.from(ingredientMap.keys())
          .filter(k => k.toLowerCase().includes(ingredientNameLower.slice(0, 3)))
          .slice(0, 5);
        logger.warn(
          `[buildDishIngredientsData] Ingredient "${ingredientLink.ingredient_name}" not found for dish "${dishDef.dish_name}"`,
          {
            searchedKeys: [ingredientNameLower, ingredientLink.ingredient_name],
            availableSimilarKeys: availableKeys,
          },
        );
        skippedIngredients.push(`${dishDef.dish_name} → ${ingredientLink.ingredient_name}`);
        continue;
      }

      dishIngredientsToInsert.push({
        dish_id: dishId,
        ingredient_id: ingredientId,
        quantity: ingredientLink.quantity,
        unit: ingredientLink.unit,
      });
    }
  }

  logger.dev('[buildDishIngredientsData] Completed ingredient linking', {
    totalLinked: dishIngredientsToInsert.length,
    totalSkipped: skippedIngredients.length,
    skippedDetails: skippedIngredients.length > 0 ? skippedIngredients : undefined,
  });

  return { data: dishIngredientsToInsert, skipped: skippedIngredients };
}
