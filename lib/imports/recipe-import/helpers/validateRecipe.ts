import type { RecipeImportRow } from '../../recipe-import';

/**
 * Validate recipe import row
 */
export function validateRecipe(
  row: RecipeImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.recipe_name || row.recipe_name.trim().length === 0) {
    return { valid: false, error: 'Recipe name is required' };
  }

  if (row.yield !== undefined && (row.yield <= 0 || isNaN(row.yield))) {
    return { valid: false, error: 'Yield must be a positive number' };
  }

  if (row.selling_price !== undefined && (row.selling_price < 0 || isNaN(row.selling_price))) {
    return { valid: false, error: 'Selling price must be a non-negative number' };
  }

  return { valid: true };
}

