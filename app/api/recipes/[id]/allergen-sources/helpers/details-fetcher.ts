import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function fetchRecipeDetails(recipeId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data: recipe, error: recipeError } = await supabaseAdmin
    .from('recipes')
    .select('id, name, recipe_name')
    .eq('id', recipeId)
    .single<{ id: string; name: string; recipe_name: string | null }>();

  if (recipeError || !recipe) {
    return { recipe: null, error: recipeError };
  }

  const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      `
      ingredient_id,
      quantity,
      unit,
      ingredients (
        id,
        ingredient_name,
        brand,
        allergens,
        allergen_source
      )
    `,
    )
    .eq('recipe_id', recipeId);

  if (ingredientsError) {
    logger.error('[Recipe Allergen Sources API] Error fetching recipe ingredients:', {
      recipeId,
      error: ingredientsError.message,
    });
    return { recipe, ingredients: [], error: ingredientsError };
  }

  return { recipe, ingredients: recipeIngredients, error: null };
}
