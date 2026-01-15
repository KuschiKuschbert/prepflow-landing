/**
 * Fetch dish data with all nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  MenuItemData,
  MenuItemIngredient,
  MenuItemSubRecipe,
  RawDishResult,
  RawRecipeResult,
} from '../fetchMenuItemData';

/**
 * Fetch dish data with all nested ingredients
 */
export async function fetchDishData(
  supabase: SupabaseClient,
  dishId: string,
): Promise<MenuItemData | null> {
  const { data: dish, error } = await supabase
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
    .eq('id', dishId)
    .single();

  if (error || !dish) {
    logger.error(`Failed to fetch dish ${dishId}:`, error);
    return null;
  }

  // Extract direct ingredients
  const rawDish = dish as unknown as RawDishResult;

  // Extract direct ingredients
  const directIngredients: MenuItemIngredient[] =
    rawDish.dish_ingredients?.map(di => ({
      name: di.ingredients?.ingredient_name || 'Unknown Ingredient',
      quantity: Number(di.quantity) || 0,
      unit: di.unit || '',
      source: 'direct',
    })) || [];

  // Extract sub-recipes with their ingredients
  const subRecipes: MenuItemSubRecipe[] = [];
  if (rawDish.dish_recipes) {
    for (const dr of rawDish.dish_recipes) {
      const recipe = dr.recipes as unknown as RawRecipeResult;
      if (!recipe || Array.isArray(recipe)) continue;

      // Handle both recipe_name and name columns
      const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

      const recipeIngredients: MenuItemIngredient[] =
        recipe.recipe_ingredients?.map(ri => ({
          name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
          quantity: Number(ri.quantity) || 0,
          unit: ri.unit || '',
          source: `recipe:${recipeName}`,
        })) || [];

      subRecipes.push({
        name: recipeName,
        recipeId: recipe.id,
        quantity: Number(dr.quantity) || 1, // How many servings of this recipe
        yield: Number(recipe.yield) || 1,
        yieldUnit: recipe.yield_unit || 'servings',
        ingredients: recipeIngredients,
        instructions: recipe.instructions || undefined,
      });
    }
  }

  return {
    id: dish.id,
    name: dish.dish_name,
    description: dish.description || undefined,
    type: 'dish',
    baseYield: 1, // Dishes are typically 1 serving per menu item
    yieldUnit: 'serving',
    directIngredients,
    subRecipes,
    instructions: undefined, // Dishes don't have instructions, sub-recipes do
  };
}
