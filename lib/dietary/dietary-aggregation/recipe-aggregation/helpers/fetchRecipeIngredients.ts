import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import type { Ingredient } from '../../types';

/**
 * Fetch and convert recipe ingredients to Ingredient format
 *
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<Ingredient[]>} Array of ingredients
 */
export async function fetchRecipeIngredients(recipeId: string): Promise<Ingredient[]> {
  const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      `
      ingredient_id,
      ingredients (
        ingredient_name,
        category,
        allergens
      )
    `,
    )
    .eq('recipe_id', recipeId);

  if (ingredientsError) {
    logger.error('[Dietary Aggregation] Failed to fetch recipe ingredients:', {
      recipeId,
      error: ingredientsError.message,
    });
    return [];
  }

  if (!recipeIngredients || recipeIngredients.length === 0) {
    return [];
  }

  // Convert to ingredient format and consolidate allergens
  return recipeIngredients.map(ri => {
    const ing = ri.ingredients as {
      ingredient_name?: string;
      category?: string;
      allergens?: string[];
    } | null;
    const rawAllergens = ing?.allergens || [];
    const consolidatedAllergens = consolidateAllergens(
      Array.isArray(rawAllergens) ? rawAllergens : [],
    );
    return {
      ingredient_name: ing?.ingredient_name || '',
      category: ing?.category,
      allergens: consolidatedAllergens,
    };
  });
}
