/**
 * Helper functions for dish data population (extracted to keep dishes-data.ts under 150 lines)
 */

import { Dish } from '@/app/webapp/recipes/types';
import { cleanSampleDishes } from '@/lib/sample-dishes-clean';

export interface IngredientData {
  id: string;
  ingredient_name: string;
}

// Minimal recipe interface - accepts both Recipe and RecipeRecord types
interface MinimalRecipe {
  id: string;
  name?: string;
  recipe_name?: string;
  [key: string]: unknown;
}

/**
 * Create lookup maps for recipes and ingredients
 */
export function createLookupMaps(recipesData: MinimalRecipe[], ingredientsData: IngredientData[]) {
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
  }

  return { recipeMap, ingredientMap };
}

/**
 * Create dish map from dishes data
 */
export function createDishMap(dishesData: Dish[]): Map<string, string> {
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

  for (const dishDef of cleanSampleDishes) {
    if (!dishDef.ingredients || dishDef.ingredients.length === 0) continue;

    const dishId =
      dishMap.get(dishDef.dish_name.toLowerCase().trim()) || dishMap.get(dishDef.dish_name);
    if (!dishId) continue;

    for (const ingredientLink of dishDef.ingredients) {
      const ingredientNameLower = ingredientLink.ingredient_name.toLowerCase().trim();
      const ingredientId =
        ingredientMap.get(ingredientNameLower) || ingredientMap.get(ingredientLink.ingredient_name);

      if (!ingredientId) {
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

  return { data: dishIngredientsToInsert, skipped: skippedIngredients };
}
