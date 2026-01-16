/**
 * Calculate food cost for a dish.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { CostData } from '../../costs';
import { calculateFinancialMetrics } from './calculateFinancialMetrics';

/**
 * Calculate food cost for a dish
 * Uses the same logic as the dish cost API endpoint
 */
export async function calculateDishFoodCost(dishId: string): Promise<CostData | null> {
  try {
    if (!supabaseAdmin) {
      logger.error('[Square Cost Sync] Database connection not available');
      return null;
    }

    // Fetch dish with recipes and ingredients
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('*')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      logger.error('[Square Cost Sync] Error fetching dish:', {
        error: dishError?.message,
        dishId,
      });
      return null;
    }

    let totalCost = 0;

    // Fetch dish recipes
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        quantity,
        recipes (
          id,
          recipe_name,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              cost_per_unit,
              cost_per_unit_incl_trim,
              trim_peel_waste_percentage,
              yield_percentage,
              category
            )
          )
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError) {
      logger.error('[Square Cost Sync] Error fetching dish recipes:', {
        error: dishRecipesError.message,
        dishId,
      });
    }

    // Calculate cost from recipes
    if (dishRecipes) {
      for (const dr of dishRecipes) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recipe = Array.isArray(dr.recipes) ? dr.recipes[0] : (dr.recipes as any);
        if (!recipe || !recipe.recipe_ingredients) continue;

        const recipeQuantity = Number(dr.quantity) || 1;

        for (const ri of recipe.recipe_ingredients) {
          const ingredient = Array.isArray(ri.ingredients) ? ri.ingredients[0] : ri.ingredients;
          if (!ingredient) continue;

          const ingredientQuantity = Number(ri.quantity) || 0;
          const costPerUnit =
            Number(ingredient.cost_per_unit_incl_trim) || Number(ingredient.cost_per_unit) || 0;
          const ingredientCost = ingredientQuantity * costPerUnit;

          totalCost += ingredientCost * recipeQuantity;
        }
      }
    }

    // Fetch dish ingredients (direct)
    const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredientsError) {
      logger.error('[Square Cost Sync] Error fetching dish ingredients:', {
        error: dishIngredientsError.message,
        dishId,
      });
    }

    // Calculate cost from direct ingredients
    if (dishIngredients) {
      for (const di of dishIngredients) {
        const ingredient = Array.isArray(di.ingredients) ? di.ingredients[0] : di.ingredients;
        if (!ingredient) continue;

        const ingredientQuantity = Number(di.quantity) || 0;
        const costPerUnit =
          Number(ingredient.cost_per_unit_incl_trim) || Number(ingredient.cost_per_unit) || 0;
        const ingredientCost = ingredientQuantity * costPerUnit;

        totalCost += ingredientCost;
      }
    }

    // Calculate financial metrics
    const sellingPrice = Number(dish.selling_price) || 0;
    const metrics = calculateFinancialMetrics(totalCost, sellingPrice);

    return {
      ...metrics,
      last_updated: new Date().toISOString(),
    };
  } catch (error: unknown) {
    logger.error('[Square Cost Sync] Error calculating dish cost:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
