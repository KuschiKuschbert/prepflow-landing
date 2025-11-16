import { supabaseAdmin } from '@/lib/supabase';

/**
 * Calculate recipe cost based on ingredients.
 *
 * @param {string} recipeId - Recipe ID
 * @param {number} quantity - Recipe quantity multiplier
 * @returns {Promise<number>} Recipe cost
 */
export async function calculateRecipeCost(recipeId: string, quantity: number = 1): Promise<number> {
  if (!supabaseAdmin) return 0;

  const { data: recipeIngredients } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      `
      quantity,
      unit,
      ingredients (
        cost_per_unit,
        cost_per_unit_incl_trim,
        trim_peel_waste_percentage,
        yield_percentage
      )
    `,
    )
    .eq('recipe_id', recipeId);

  if (!recipeIngredients || recipeIngredients.length === 0) {
    return 0;
  }

  let recipeCost = 0;
  for (const ri of recipeIngredients) {
    const ingredient = ri.ingredients as any;
    if (ingredient) {
      const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const ingredientQuantity = parseFloat(ri.quantity) || 0;
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;

      let adjustedCost = ingredientQuantity * costPerUnit * quantity;
      if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
        adjustedCost = adjustedCost / (1 - wastePercent / 100);
      }
      adjustedCost = adjustedCost / (yieldPercent / 100);

      recipeCost += adjustedCost;
    }
  }
  return recipeCost;
}
