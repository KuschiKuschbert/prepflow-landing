import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface Ingredient {
  id: string;
  ingredient_name?: string;
  name?: string;
  unit: string;
  category?: string;
}

/**
 * Fetch ingredients in batches of 100
 *
 * @param {string[]} ingredientIds - Array of ingredient IDs to fetch
 * @returns {Promise<Map<string, Ingredient>>} Map of ingredient ID to ingredient data
 */
export async function fetchIngredientsBatch(ingredientIds: string[]): Promise<Map<string, Ingredient>> {
  if (!supabaseAdmin || ingredientIds.length === 0) {
    return new Map();
  }

  const ingredientsMap = new Map();
  // Fetch in batches of 100
  for (let i = 0; i < ingredientIds.length; i += 100) {
    const batch = ingredientIds.slice(i, i + 100);
    const { data: ingredientsData, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, name, unit, category')
      .in('id', batch);

    if (ingredientsError) {
      logger.warn('[Prep Lists API] Error fetching ingredients batch (non-fatal):', {
        error: ingredientsError.message,
        code: (ingredientsError as any).code,
        batchIndex: i,
        batchSize: batch.length,
      });
      // Continue with other batches even if one fails
    }

    if (ingredientsData) {
      ingredientsData.forEach((ing: any) => {
        ingredientsMap.set(ing.id, {
          id: ing.id,
          name: ing.ingredient_name || ing.name,
          unit: ing.unit,
          category: ing.category,
        });
      });
    }
  }

  return ingredientsMap;
}

