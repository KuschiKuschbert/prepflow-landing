import type { NormalizedRecipeIngredient, RecipeIngredientRow } from './types';

/**
 * Map recipe ingredient rows to normalized items format.
 */
export function mapRecipeIngredients(rows: RecipeIngredientRow[]): NormalizedRecipeIngredient[] {
  return rows.map(row => {
    const ing = (row.ingredients || {}) as {
      id: string;
      ingredient_name?: string;
      name?: string;
      cost_per_unit?: number;
      cost_per_unit_incl_trim?: number;
      unit?: string;
      trim_peel_waste_percentage?: number;
      yield_percentage?: number;
      category?: string;
    };
    return {
      id: row.id,
      recipe_id: row.recipe_id,
      ingredient_id: row.ingredient_id,
      quantity: row.quantity,
      unit: row.unit,
      ingredients: {
        id: ing.id,
        ingredient_name: ing.ingredient_name || ing.name || 'Unknown',
        cost_per_unit: ing.cost_per_unit || 0,
        cost_per_unit_incl_trim: ing.cost_per_unit_incl_trim || 0,
        unit: ing.unit || row.unit || null,
        trim_peel_waste_percentage: ing.trim_peel_waste_percentage || 0,
        yield_percentage: ing.yield_percentage || 0,
        category: ing.category || null,
      },
    };
  });
}
