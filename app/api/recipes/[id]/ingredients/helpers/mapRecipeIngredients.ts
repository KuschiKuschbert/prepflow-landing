/**
 * Map recipe ingredient rows to normalized items format.
 *
 * @param {Array} rows - Recipe ingredient rows with ingredients
 * @returns {Array} Normalized items
 */
export function mapRecipeIngredients(rows: any[]): any[] {
  return rows.map((row: any) => {
    const ing = row.ingredients || {};
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
        category: ing.category || null, // Handle missing category column gracefully
      },
    };
  });
}
