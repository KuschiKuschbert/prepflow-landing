import { supabaseAdmin } from '@/lib/supabase';
import { calculateRecipeCost } from './calculateRecipeCost';

/**
 * Calculate dish cost from recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<number>} Dish cost
 */
import { logger } from '@/lib/logger';

export async function calculateDishCost(dishId: string): Promise<number> {
  if (!supabaseAdmin) {
    logger.error('[calculateDishCost] Supabase admin client not available');
    return 0;
  }

  let dishCost = 0;

  try {
    // Calculate cost from recipes in dish
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
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

    if (dishRecipesError) {
      logger.error('[calculateDishCost] Error fetching dish recipes:', {
        dishId,
        error: dishRecipesError,
      });
      throw new Error(`Failed to fetch dish recipes: ${dishRecipesError.message}`);
    }

    if (dishRecipes && dishRecipes.length > 0) {
      for (const dishRecipe of dishRecipes) {
        try {
          const recipeCost = await calculateRecipeCost(
            dishRecipe.recipe_id,
            parseFloat(dishRecipe.quantity) || 1,
          );
          dishCost += recipeCost;
        } catch (err) {
          logger.error('[calculateDishCost] Error calculating recipe cost:', {
            dishId,
            recipeId: dishRecipe.recipe_id,
            error: err,
          });
          // Continue with other recipes instead of failing completely
        }
      }
    }

    // Calculate cost from standalone ingredients
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
          yield_percentage
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredientsError) {
      logger.error('[calculateDishCost] Error fetching dish ingredients:', {
        dishId,
        error: dishIngredientsError,
      });
      throw new Error(`Failed to fetch dish ingredients: ${dishIngredientsError.message}`);
    }

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

    logger.dev('[calculateDishCost] Calculation complete', {
      dishId,
      dishCost,
      recipeCount: dishRecipes?.length || 0,
      ingredientCount: dishIngredients?.length || 0,
    });

    return dishCost;
  } catch (err) {
    logger.error('[calculateDishCost] Unexpected error:', {
      dishId,
      error: err,
    });
    throw err; // Re-throw to let caller handle
  }
}
