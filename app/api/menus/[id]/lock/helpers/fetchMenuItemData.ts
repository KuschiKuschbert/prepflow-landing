/**
 * Fetch Menu Item Data
 * Handles fetching both dishes and recipes with all nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export interface MenuItemIngredient {
  name: string;
  quantity: number;
  unit: string;
  source?: string; // 'direct' | 'recipe:recipe_name'
}

export interface MenuItemSubRecipe {
  name: string;
  recipeId: string;
  quantity: number; // Quantity of recipe servings needed
  yield: number; // Recipe's yield (servings)
  yieldUnit: string;
  ingredients: MenuItemIngredient[];
  instructions?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  type: 'dish' | 'recipe';
  baseYield: number; // Yield for this dish/recipe
  yieldUnit: string;
  directIngredients: MenuItemIngredient[];
  subRecipes: MenuItemSubRecipe[];
  instructions?: string;
}

/**
 * Fetch dish data with all nested ingredients
 */
async function fetchDishData(
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
  const directIngredients: MenuItemIngredient[] =
    dish.dish_ingredients?.map((di: any) => ({
      name: di.ingredients?.ingredient_name || 'Unknown Ingredient',
      quantity: Number(di.quantity) || 0,
      unit: di.unit || '',
      source: 'direct',
    })) || [];

  // Extract sub-recipes with their ingredients
  const subRecipes: MenuItemSubRecipe[] = [];
  if (dish.dish_recipes) {
    for (const dr of dish.dish_recipes) {
      const recipe = dr.recipes as any;
      if (!recipe || Array.isArray(recipe)) continue;

      // Handle both recipe_name and name columns
      const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

      const recipeIngredients: MenuItemIngredient[] =
        (recipe.recipe_ingredients as any[])?.map((ri: any) => ({
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

/**
 * Fetch recipe data with all nested ingredients
 */
async function fetchRecipeData(
  supabase: SupabaseClient,
  recipeId: string,
): Promise<MenuItemData | null> {
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(
      `
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
    `,
    )
    .eq('id', recipeId)
    .single();

  if (error || !recipe) {
    logger.error(`Failed to fetch recipe ${recipeId}:`, error);
    return null;
  }

  const ingredients: MenuItemIngredient[] =
    recipe.recipe_ingredients?.map((ri: any) => ({
      name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
      quantity: Number(ri.quantity) || 0,
      unit: ri.unit || '',
      source: 'direct',
    })) || [];

  // Handle both recipe_name and name columns
  const recipeName = (recipe as any).recipe_name || (recipe as any).name || 'Unknown Recipe';

  return {
    id: recipe.id,
    name: recipeName,
    description: recipe.description || undefined,
    type: 'recipe',
    baseYield: Number(recipe.yield) || 1,
    yieldUnit: recipe.yield_unit || 'servings',
    directIngredients: ingredients,
    subRecipes: [], // Recipes don't have sub-recipes in current schema
    instructions: recipe.instructions || undefined,
  };
}

/**
 * Fetch menu item data (dish or recipe) with all nested ingredients
 * @param cache - Optional cache Map to lookup data from (avoids database query)
 */
export async function fetchMenuItemData(
  supabase: SupabaseClient,
  menuItem: { id: string; dish_id?: string | null; recipe_id?: string | null },
  cache?: Map<string, MenuItemData>,
): Promise<MenuItemData | null> {
  // If cache provided, try lookup first
  if (cache) {
    if (menuItem.dish_id) {
      const cached = cache.get(menuItem.dish_id);
      if (cached) {
        logger.dev(`Cache hit for dish ${menuItem.dish_id}`);
        return cached;
      }
    }

    if (menuItem.recipe_id) {
      const cached = cache.get(menuItem.recipe_id);
      if (cached) {
        logger.dev(`Cache hit for recipe ${menuItem.recipe_id}`);
        return cached;
      }
    }

    // Cache miss - fall through to database query
    logger.dev(`Cache miss for menu item ${menuItem.id}, querying database`);
  }

  // Fallback to database query (original behavior)
  if (menuItem.dish_id) {
    return fetchDishData(supabase, menuItem.dish_id);
  }

  if (menuItem.recipe_id) {
    return fetchRecipeData(supabase, menuItem.recipe_id);
  }

  logger.warn(`Menu item ${menuItem.id} has neither dish_id nor recipe_id`);
  return null;
}
