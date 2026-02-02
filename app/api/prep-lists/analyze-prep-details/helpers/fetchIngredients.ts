import { RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

// Define the expected shape of the joined query response
interface RawRecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number | null;
    unit: string | null;
  } | null;
}

export async function fetchAndMapRecipeIngredients(recipeIds: string[]) {
  if (!supabaseAdmin) return new Map<string, RecipeIngredientWithDetails[]>();

  const recipeIngredientsMap = new Map<string, RecipeIngredientWithDetails[]>();

  const { data: rawIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      'id, recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, cost_per_unit, unit)',
    )
    .in('recipe_id', recipeIds);

  const allRecipeIngredients = rawIngredients as unknown as RawRecipeIngredient[] | null;

  if (ingredientsError) {
    logger.warn('[Prep Details Analysis] Error fetching recipe ingredients:', {
      error: ingredientsError.message,
      code: ingredientsError.code,
      recipeIds,
    });
    // Return empty map if fetch fails
    return recipeIngredientsMap;
  }

  if (allRecipeIngredients) {
    for (const ri of allRecipeIngredients) {
      const recipeId = ri.recipe_id;
      if (!recipeIngredientsMap.has(recipeId)) {
        recipeIngredientsMap.set(recipeId, []);
      }

      const details: RecipeIngredientWithDetails = {
        id: ri.id,
        recipe_id: recipeId,
        ingredient_id: ri.ingredient_id,
        ingredient_name: ri.ingredients?.ingredient_name || '',
        quantity: Number(ri.quantity) || 0,
        unit: ri.unit || '',
        cost_per_unit: ri.ingredients?.cost_per_unit || 0,
        total_cost: (Number(ri.quantity) || 0) * (ri.ingredients?.cost_per_unit || 0),
        ingredients: {
          id: ri.ingredients?.id || '',
          ingredient_name: ri.ingredients?.ingredient_name || '',
          cost_per_unit: ri.ingredients?.cost_per_unit || 0,
          unit: ri.ingredients?.unit || ri.unit || '',
        },
      };

      recipeIngredientsMap.get(recipeId)!.push(details);
    }
  }

  return recipeIngredientsMap;
}
