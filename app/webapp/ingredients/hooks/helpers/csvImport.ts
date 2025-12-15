import { parseCSV } from '@/lib/csv/csv-utils';
import {
  getIngredientsValidationSchema,
  transformCSVData,
  validateCSVData,
} from '@/lib/csv/validation';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { formatIngredientForInsert } from './csvImport/formatIngredient';
import { mapCSVRowToIngredient } from './csvImport/mapCSVRow';

interface Ingredient {
  id?: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

/**
 * Parse CSV text and convert to ingredient objects.
 * @param {string} csvText - CSV text to parse
 * @returns {{ ingredients: Partial<Ingredient>[]; errors: string[] }} Parsed ingredients and errors
 */
export function parseIngredientsCSV(csvText: string): {
  ingredients: Partial<Ingredient>[];
  errors: string[];
} {
  const errors: string[] = [];

  // Parse CSV using PapaParse
  const result = parseCSV<Record<string, any>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (result.errors.length > 0) {
    result.errors.forEach(error => errors.push(`Row ${error.row}: ${error.message}`));
  }
  if (result.data.length === 0) {
    errors.push('CSV file appears to be empty or has no valid data rows');
    return { ingredients: [], errors };
  }
  const ingredients = result.data
    .map(row => mapCSVRowToIngredient(row))
    .filter(ing => ing.ingredient_name);

  // Validate ingredients
  const schema = getIngredientsValidationSchema();
  const transformed = transformCSVData(ingredients, schema);
  const validation = validateCSVData(transformed, schema);

  if (!validation.valid) {
    validation.errors.forEach(err => errors.push(`Row ${err.row}, ${err.field}: ${err.error}`));
  }

  return { ingredients: validation.valid ? transformed : ingredients, errors };
}

/**
 * Import ingredients from CSV data.
 * @param {Partial<Ingredient>[]} parsedIngredients - Parsed ingredients from CSV
 * @returns {Promise<{success: boolean, data?: Ingredient[], error?: any}>} Import result
 */
export async function importIngredientsFromCSV(
  parsedIngredients: Partial<Ingredient>[],
): Promise<{ success: boolean; data?: Ingredient[]; error?: any }> {
  try {
    if (!parsedIngredients || parsedIngredients.length === 0) {
      return { success: false, error: 'No ingredients to import' };
    }

    const { data, error } = await supabase
      .from('ingredients')
      .insert(parsedIngredients.map(formatIngredientForInsert))
      .select();
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    logger.error('[CSV Import] Failed to import ingredients:', error);
    return { success: false, error };
  }
}
