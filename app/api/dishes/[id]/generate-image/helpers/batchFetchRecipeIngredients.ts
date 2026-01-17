import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface RawAggregatedIngredient {
  ingredient_name?: string;
  name?: string;
}

export async function batchFetchRecipeIngredients(recipeIds: string[]): Promise<Set<string>> {
  const ingredientNamesSet = new Set<string>();
  if (recipeIds.length === 0 || !supabaseAdmin) return ingredientNamesSet;

  try {
    const { data: recipeIngredients, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(`
        ingredients (
          ingredient_name
        )
      `)
      .in('recipe_id', recipeIds);

    if (error) {
      logger.error('[Dish Image Generation] Failed to batch fetch recipe ingredients:', {
        error: error.message,
        recipeIdsCount: recipeIds.length,
      });
      return ingredientNamesSet;
    }

    if (recipeIngredients) {
      recipeIngredients.forEach((ri: any) => {
        const ingredient = ri.ingredients;
        if (ingredient && typeof ingredient === 'object') {
          const rawIng = ingredient as unknown as RawAggregatedIngredient;
          const name = rawIng.ingredient_name || rawIng.name;
          if (name && typeof name === 'string') {
            ingredientNamesSet.add(name);
          }
        }
      });
    }
  } catch (error) {
    logger.error('[Dish Image Generation] Error in batch fetch recipe ingredients:', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return ingredientNamesSet;
}
