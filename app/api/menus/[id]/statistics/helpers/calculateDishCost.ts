import { supabaseAdmin } from '@/lib/supabase';
import { calculateRecipeCost } from './calculateRecipeCost';

/**
 * Calculate dish cost from recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<number>} Dish cost
 */
export async function calculateDishCost(dishId: string): Promise<number> {
  if (!supabaseAdmin) return 0;

  let dishCost = 0;

  // Calculate cost from recipes in dish
  const { data: dishRecipes } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      recipe_id,
      quantity,
      recipes (
        id,
        recipe_name
      )
    `,
    )
    .eq('dish_id', dishId);

  if (dishRecipes && dishRecipes.length > 0) {
    for (const dishRecipe of dishRecipes) {
      dishCost += await calculateRecipeCost(
        dishRecipe.recipe_id,
        parseFloat(dishRecipe.quantity) || 1,
      );
    }
  }

  // Calculate cost from standalone ingredients
  const { data: dishIngredients } = await supabaseAdmin
    .from('dish_ingredients')
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
    .eq('dish_id', dishId);

  if (dishIngredients) {
    for (const di of dishIngredients) {
      const ingredient = di.ingredients as any;
      if (ingredient) {
        const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
        const quantity = parseFloat(di.quantity) || 0;
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;

        let adjustedCost = quantity * costPerUnit;
        if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
          adjustedCost = adjustedCost / (1 - wastePercent / 100);
        }
        adjustedCost = adjustedCost / (yieldPercent / 100);

        dishCost += adjustedCost;
      }
    }
  }

  return dishCost;
}
