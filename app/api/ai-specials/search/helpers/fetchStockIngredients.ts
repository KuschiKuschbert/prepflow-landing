/**
 * Fetch stock ingredients from DB for AI specials search.
 */

import { logger } from '@/lib/logger';
import { normalizeIngredient } from '@/lib/ingredient-normalization';
import { supabaseAdmin } from '@/lib/supabase';

export interface StockIngredientsResult {
  stockIngredients: Set<string>;
  stockIngredientsRaw: string[];
}

export async function fetchStockIngredients(): Promise<StockIngredientsResult> {
  const stockIngredients = new Set<string>();
  const stockIngredientsRaw: string[] = [];

  if (!supabaseAdmin) return { stockIngredients, stockIngredientsRaw };

  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .select('ingredient_name')
    .gt('current_stock', 0);

  if (error || !data) {
    if (error) logger.error('Failed to fetch stock ingredients', { error });
    return { stockIngredients, stockIngredientsRaw };
  }

  data.forEach(item => {
    const name = item.ingredient_name;
    if (name) {
      stockIngredientsRaw.push(name);
      stockIngredients.add(normalizeIngredient(name));
      stockIngredients.add(name.toLowerCase());
    }
  });

  return { stockIngredients, stockIngredientsRaw };
}
