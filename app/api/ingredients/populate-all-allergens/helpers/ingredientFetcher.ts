import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function fetchAndFilterIngredients(supabase: SupabaseClient) {
  const { data: ingredients, error: fetchError } = await supabase
    .from('ingredients')
    .select('id, ingredient_name, brand, allergens, allergen_source')
    .order('ingredient_name', { ascending: true });

  if (fetchError) {
    logger.error('[Populate All Allergens] Failed to fetch ingredients:', {
      error: fetchError.message,
    });
    throw fetchError;
  }

  if (!ingredients || ingredients.length === 0) {
    return { allIngredients: [], ingredientsToProcess: [] };
  }

  const ingredientsToProcess = ingredients.filter(ingredient => {
    const hasManualAllergens =
      ingredient.allergens &&
      Array.isArray(ingredient.allergens) &&
      ingredient.allergens.length > 0 &&
      ingredient.allergen_source &&
      typeof ingredient.allergen_source === 'object' &&
      (ingredient.allergen_source as { manual?: boolean }).manual;
    return !hasManualAllergens;
  });

  return { allIngredients: ingredients, ingredientsToProcess };
}
