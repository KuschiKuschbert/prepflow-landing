/**
 * Aggregate ingredients from recipes for dishes.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { IngredientMatch } from './types';

// Local types for query results
interface DishRecipeRecord {
  recipe_id: string;
  recipe_quantity: number;
}

/**
 * Get ingredients from recipes for a dish
 * Returns ingredients that can be added as direct dish_ingredients
 */
export async function getIngredientsFromRecipes(
  dishId: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): Promise<IngredientMatch[]> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Get dish recipes
  const { data: dishRecipes, error: drError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity as recipe_quantity')
    .eq('dish_id', dishId);

  if (drError) {
    logger.error('[Populate Helpers] Error fetching dish recipes:', {
      error: drError.message,
      dishId,
      context: { operation: 'getIngredientsFromRecipes' },
    });
    return [];
  }

  if (!dishRecipes || dishRecipes.length === 0) {
    return [];
  }

  const recipeIds = (dishRecipes as unknown as DishRecipeRecord[])
    .map((dr: DishRecipeRecord) => dr.recipe_id)
    .filter((id: string | undefined): id is string => Boolean(id));
  if (recipeIds.length === 0) {
    return [];
  }

  // Get recipe ingredients
  const { data: recipeIngredients, error: riError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit')
    .in('recipe_id', recipeIds);

  if (riError) {
    logger.error('[Populate Helpers] Error fetching recipe ingredients:', {
      error: riError.message,
      recipeIds,
      context: { operation: 'getIngredientsFromRecipes' },
    });
    return [];
  }

  if (!recipeIngredients || recipeIngredients.length === 0) {
    return [];
  }

  // Create ingredient map for lookup
  const ingredientMap = new Map<string, { id: string; unit: string }>();
  availableIngredients.forEach(ing => {
    ingredientMap.set(ing.id, { id: ing.id, unit: ing.unit });
  });

  // Aggregate ingredients from all recipes
  const aggregatedIngredients = new Map<string, { quantity: number; unit: string }>();

  for (const ri of recipeIngredients) {
    if (!ri.ingredient_id || !ingredientMap.has(ri.ingredient_id)) {
      continue;
    }

    const recipeQuantity =
      (dishRecipes as unknown as DishRecipeRecord[]).find(
        (dr: DishRecipeRecord) => dr.recipe_id === ri.recipe_id,
      )?.recipe_quantity || 1;
    const totalQuantity = (ri.quantity || 0) * recipeQuantity;

    if (aggregatedIngredients.has(ri.ingredient_id)) {
      const existing = aggregatedIngredients.get(ri.ingredient_id)!;
      aggregatedIngredients.set(ri.ingredient_id, {
        quantity: existing.quantity + totalQuantity,
        unit: ri.unit || existing.unit,
      });
    } else {
      aggregatedIngredients.set(ri.ingredient_id, {
        quantity: totalQuantity,
        unit: ri.unit || ingredientMap.get(ri.ingredient_id)?.unit || 'GM',
      });
    }
  }

  // Convert to IngredientMatch array
  const matches: IngredientMatch[] = [];
  for (const [ingredientId, data] of aggregatedIngredients.entries()) {
    const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
      matches.push({
        ingredient_id: ingredientId,
        ingredient_name: ingredient.ingredient_name,
        quantity: data.quantity,
        unit: data.unit,
      });
    }
  }

  return matches;
}
