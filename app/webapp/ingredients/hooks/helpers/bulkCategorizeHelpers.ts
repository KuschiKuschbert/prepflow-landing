import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { Ingredient } from '../../components/types';

/**
 * Updates ingredients from a category map.
 */
export function updateIngredientsFromMap(
  categoryMap: Map<string, string>,
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>,
) {
  setIngredients(prevIngredients =>
    prevIngredients.map(ing => {
      if (!ing.id) return ing;
      const newCategory = categoryMap.get(ing.id);
      return newCategory ? { ...ing, category: newCategory } : ing;
    }),
  );
}

/**
 * Fetches updated ingredient categories from Supabase.
 */
export async function fetchIngredientCategories(ids: string[]): Promise<Map<string, string>> {
  const { data: updatedIngredients, error: fetchError } = await supabase
    .from('ingredients')
    .select('id, category')
    .in('id', ids);

  if (fetchError) {
    logger.error('Failed to fetch ingredient categories:', fetchError);
    throw fetchError;
  }

  return new Map(updatedIngredients?.map(ing => [ing.id, ing.category]) || []);
}

/**
 * Handles auto-categorize API response.
 */
export async function handleAutoCategorizeResponse(response: Response, ids?: string[]) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Failed to auto-categorize ingredients');
  }

  if (ids) {
    const categoryMap = await fetchIngredientCategories(ids);
    return { result, categoryMap };
  }

  return { result, categoryMap: null };
}
