import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface IntegrityStats {
  totalRecipes: number;
  recipesWithNoLines: number;
  uniqueIngredientIdsInLines: number;
  missingIngredientRefs: number;
}

export async function checkRecipeIntegrity(
  supabase: SupabaseClient,
): Promise<{ totalRecipes: number; recipesWithNoLines: number }> {
  const { data: recipes, error: recipesError } = await supabase.from('recipes').select('id');
  if (recipesError) {
    logger.error('[DB Integrity] Error fetching recipes:', { error: recipesError });
    throw recipesError;
  }

  const recipeIds = (recipes || []).map(r => r.id);
  let recipesWithNoLines = 0;

  if (recipeIds.length > 0) {
    const { data: counts, error: countErr } = await supabase
      .from('recipe_ingredients')
      .select('recipe_id');
    if (countErr) {
      logger.error('[DB Integrity] Error fetching recipe_ingredients:', { error: countErr });
      throw countErr;
    }
    const withLines = new Set((counts || []).map(r => r.recipe_id));
    recipesWithNoLines = recipeIds.filter(id => !withLines.has(id)).length;
  }

  return { totalRecipes: recipeIds.length, recipesWithNoLines };
}

export async function checkIngredientIntegrity(
  supabase: SupabaseClient,
): Promise<{ uniqueIngredientIdsInLines: number; missingIngredientRefs: number }> {
  // Recipe ingredient rows with missing ingredient reference
  const { data: riRows, error: riErr } = await supabase
    .from('recipe_ingredients')
    .select('ingredient_id');

  if (riErr) {
    logger.error('[DB Integrity] Error fetching recipe_ingredients:', { error: riErr });
    throw riErr;
  }

  const uniqueIngIds = Array.from(
    new Set((riRows || []).map(r => r.ingredient_id).filter(Boolean)),
  );
  let missingIngredientRefs = 0;

  if (uniqueIngIds.length > 0) {
    const { data: ingRows, error: ingErr } = await supabase
      .from('ingredients')
      .select('id')
      .in('id', uniqueIngIds);
    if (ingErr) {
      logger.error('[DB Integrity] Error fetching ingredients:', { error: ingErr });
      throw ingErr;
    }
    const present = new Set((ingRows || []).map(r => r.id));
    missingIngredientRefs = uniqueIngIds.filter(id => !present.has(id)).length;
  }

  return { uniqueIngredientIdsInLines: uniqueIngIds.length, missingIngredientRefs };
}
