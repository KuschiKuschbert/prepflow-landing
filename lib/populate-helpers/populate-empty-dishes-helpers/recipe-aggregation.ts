/**
 * Aggregate ingredients from recipes for dishes.
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { IngredientMatch } from './types';

/**
 * Get ingredients from recipes for a dish
 * Returns ingredients that can be added as direct dish_ingredients
 */
export async function getIngredientsFromRecipes(
  dishId: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): Promise<IngredientMatch[]> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Get dish recipes
  const { data: dishRecipes, error: drError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity as recipe_quantity')
    .eq('dish_id', dishId);

  if (drError || !dishRecipes || dishRecipes.length === 0) {
    return [];
  }

  const recipeIds = dishRecipes
    .map((dr: any) => dr.recipe_id)
    .filter((id: any): id is string => Boolean(id));
  if (recipeIds.length === 0) {
    return [];
  }

  // Get recipe ingredients
  const { data: recipeIngredients, error: riError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit')
    .in('recipe_id', recipeIds);

  if (riError || !recipeIngredients || recipeIngredients.length === 0) {
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
      (dishRecipes.find((dr: any) => dr.recipe_id === ri.recipe_id) as any)?.recipe_quantity || 1;
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
