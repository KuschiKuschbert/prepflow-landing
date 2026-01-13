/**
 * Batch Fetch Dishes Helper
 * Fetches dishes with nested ingredients and sub-recipes
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData } from './fetchMenuItemData';

interface IngredientResult {
  quantity: number;
  unit: string;
  ingredients: {
    ingredient_name: string;
  } | null;
}

interface RecipeResult {
  id: string;
  name: string;
  recipe_name?: string; // some views might have this
  description: string | null;
  yield: number;
  yield_unit: string;
  instructions: string | null;
  recipe_ingredients: IngredientResult[];
}

interface DishResult {
  id: string;
  dish_name: string;
  description: string | null;
  dish_ingredients: IngredientResult[];
  dish_recipes: {
    quantity: number;
    recipes: RecipeResult | null;
  }[];
}

/**
 * Batch fetch all dishes with nested ingredients and sub-recipes
 */
export async function batchFetchDishes(
  supabase: SupabaseClient,
  dishIds: string[],
): Promise<Map<string, MenuItemData>> {
  if (dishIds.length === 0) {
    return new Map();
  }

  const { data: dishesData, error } = await supabase
    .from('dishes')
    .select(
      `
      id,
      dish_name,
      description,
      dish_ingredients (
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      ),
      dish_recipes (
        quantity,
        recipes (
          id,
          name,
          description,
          yield,
          yield_unit,
          instructions,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              ingredient_name
            )
          )
        )
      )
    `,
    )
    .in('id', dishIds);

  if (error) {
    logger.error('Failed to batch fetch dishes:', error);
    return new Map();
  }

  const dishes = dishesData as unknown as DishResult[];
  const dishMap = new Map<string, MenuItemData>();

  for (const dish of dishes || []) {
    // Extract direct ingredients
    const directIngredients =
      dish.dish_ingredients?.map(di => ({
        name: di.ingredients?.ingredient_name || 'Unknown Ingredient',
        quantity: Number(di.quantity) || 0,
        unit: di.unit || '',
        source: 'direct',
      })) || [];

    // Extract sub-recipes with their ingredients
    const subRecipes: Array<{
      name: string;
      recipeId: string;
      quantity: number;
      yield: number;
      yieldUnit: string;
      ingredients: Array<{ name: string; quantity: number; unit: string; source: string }>;
      instructions?: string;
    }> = [];
    if (dish.dish_recipes) {
      for (const dr of dish.dish_recipes) {
        const recipe = dr.recipes;
        if (!recipe || !Array.isArray(recipe.recipe_ingredients)) continue;

        // Handle both recipe_name and name columns
        const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

        const recipeIngredients = recipe.recipe_ingredients.map(ri => ({
          name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
          quantity: Number(ri.quantity) || 0,
          unit: ri.unit || '',
          source: `recipe:${recipeName}`,
        }));

        subRecipes.push({
          name: recipeName,
          recipeId: recipe.id,
          quantity: Number(dr.quantity) || 1,
          yield: Number(recipe.yield) || 1,
          yieldUnit: recipe.yield_unit || 'servings',
          ingredients: recipeIngredients,
          instructions: recipe.instructions || undefined,
        });
      }
    }

    dishMap.set(dish.id, {
      id: dish.id,
      name: dish.dish_name,
      description: dish.description || undefined,
      type: 'dish',
      baseYield: 1,
      yieldUnit: 'serving',
      directIngredients,
      subRecipes,
      instructions: undefined,
    });
  }

  logger.dev(`Batch fetched ${dishMap.size} dishes`);
  return dishMap;
}
