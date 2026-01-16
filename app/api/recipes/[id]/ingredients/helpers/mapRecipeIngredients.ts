import type { NormalizedRecipeIngredient, RecipeIngredientRow } from './types';

/**
 * Map recipe ingredient rows to normalized items format.
 */
export function mapRecipeIngredients(rows: RecipeIngredientRow[]): NormalizedRecipeIngredient[] {
  return rows.map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ing = row.ingredients || ({} as any);
    return {
      id: row.id,
      recipe_id: row.recipe_id,
      ingredient_id: row.ingredient_id,
      quantity: row.quantity,
      unit: row.unit,
      ingredients: {
        id: ing.id,
        ingredient_name: ing.ingredient_name || ing.name || 'Unknown',
        cost_per_unit: ing.cost_per_unit,
        cost_per_unit_incl_trim: ing.cost_per_unit_incl_trim,
        unit: ing.unit || row.unit || null,
        trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
        yield_percentage: ing.yield_percentage,
        category: ing.category || null,
      },
    };
  });
}
