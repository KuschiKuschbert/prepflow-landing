import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function fetchRecipesWithInstructions(recipeIds: string[]) {
  if (!supabaseAdmin) return { recipes: [], error: new Error('No DB connection') };

  const { data: recipes, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, recipe_name, description, yield, yield_unit, instructions')
    .in('id', recipeIds)
    .not('instructions', 'is', null);

  if (recipesError) {
    logger.warn('[Prep Details Analysis] Error fetching recipes:', {
      error: recipesError.message,
      code: recipesError.code,
      recipeIds,
    });
    return { recipes: [], error: recipesError };
  }

  return { recipes: recipes || [], error: null };
}
