import { supabase } from '@/lib/supabase';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

/**
 * Format ingredient data for database insert.
 *
 * @param {Partial<Ingredient>} ingredient - Ingredient to format
 * @returns {any} Formatted ingredient data
 */
function formatIngredientForInsert(ingredient: Partial<Ingredient>) {
  return {
    ...ingredient,
    ingredient_name: formatIngredientName(ingredient.ingredient_name || ''),
    brand: ingredient.brand ? formatBrandName(ingredient.brand) : null,
    supplier: ingredient.supplier ? formatSupplierName(ingredient.supplier) : null,
    storage_location: ingredient.storage_location
      ? formatStorageLocation(ingredient.storage_location)
      : null,
    product_code: ingredient.product_code ? formatTextInput(ingredient.product_code) : null,
  };
}

/**
 * Import ingredients from CSV data.
 *
 * @param {Partial<Ingredient>[]} parsedIngredients - Parsed ingredients from CSV
 * @returns {Promise<{success: boolean, data?: Ingredient[], error?: any}>} Import result
 */
export async function importIngredientsFromCSV(
  parsedIngredients: Partial<Ingredient>[],
): Promise<{ success: boolean; data?: Ingredient[]; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .insert(parsedIngredients.map(formatIngredientForInsert))
      .select();
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    return { success: false, error };
  }
}
