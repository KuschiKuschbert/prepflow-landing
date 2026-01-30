import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchDishIngredients, fetchDishRecipes, fetchRecipeIngredients } from './db-fetchers';

async function processDishIngredients(
  dishIds: Set<string>,
  menuId: string,
  ingredientIds: Set<string>,
) {
  const idsArray = Array.from(dishIds);
  if (idsArray.length === 0) return;

  try {
    const dishIngredients = await fetchDishIngredients(idsArray);
    dishIngredients.forEach(row => {
      if (row.ingredient_id) ingredientIds.add(row.ingredient_id);
    });

    const dishRecipes = await fetchDishRecipes(idsArray);
    const recipeIds = dishRecipes.map(r => r.recipe_id).filter(Boolean);

    if (recipeIds.length > 0) {
      const recipeIngredients = await fetchRecipeIngredients(recipeIds);
      recipeIngredients.forEach(row => {
        if (row.ingredient_id) ingredientIds.add(row.ingredient_id);
      });
    }
  } catch (error) {
    logger.warn('[Menu Ingredients API] Error processing dish ingredients:', {
      error: error instanceof Error ? error.message : String(error),
      context: { menuId },
    });
  }
}

async function processRecipeIngredients(
  recipeIds: Set<string>,
  menuId: string,
  ingredientIds: Set<string>,
) {
  const idsArray = Array.from(recipeIds);
  if (idsArray.length === 0) return;

  try {
    const ingredients = await fetchRecipeIngredients(idsArray);
    ingredients.forEach(row => {
      if (row.ingredient_id) ingredientIds.add(row.ingredient_id);
    });
  } catch (error) {
    logger.warn('[Menu Ingredients API] Error processing recipe ingredients:', {
      error: error instanceof Error ? error.message : String(error),
      context: { menuId },
    });
  }
}

export async function collectIngredientIds(
  dishIds: Set<string>,
  recipeIds: Set<string>,
  menuId: string,
): Promise<Set<string>> {
  if (!supabaseAdmin) {
    return new Set<string>();
  }

  const ingredientIds = new Set<string>();

  await Promise.all([
    processDishIngredients(dishIds, menuId, ingredientIds),
    processRecipeIngredients(recipeIds, menuId, ingredientIds),
  ]);

  return ingredientIds;
}
