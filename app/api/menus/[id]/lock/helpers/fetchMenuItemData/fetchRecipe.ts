/**
 * Fetch recipe data with all nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData, MenuItemIngredient } from '../fetchMenuItemData';

/**
 * Fetch recipe data with all nested ingredients
 */
export async function fetchRecipeData(
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
