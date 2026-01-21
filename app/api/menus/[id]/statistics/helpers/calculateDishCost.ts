import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishRecipeJoinData, IngredientJoinData } from '../../../helpers/internal-types';
import { calculateRecipeCost } from './calculateRecipeCost';

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
          name
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError) {
      logger.error('[calculateDishCost] Error fetching dish recipes:', {
        dishId,
        error: dishRecipesError,
      });
      throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
    }

    if (dishRecipes && dishRecipes.length > 0) {
      for (const dishRecipe of dishRecipes as unknown as DishRecipeJoinData[]) {
        try {
          const recipeCost = await calculateRecipeCost(
            dishRecipe.recipe_id,
            typeof dishRecipe.quantity === 'string'
              ? parseFloat(dishRecipe.quantity)
              : dishRecipe.quantity || 1,
          );
          dishCost += recipeCost;
        } catch (err: unknown) {
          logger.error('[calculateDishCost] Error calculating recipe cost:', {
            dishId,
            recipeId: dishRecipe.recipe_id,
            error: err instanceof Error ? err.message : String(err),
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
      throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
    }

    if (dishIngredients) {
      for (const di of dishIngredients) {
        const ingredient = di.ingredients as unknown as IngredientJoinData;
        if (ingredient) {
          const costPerUnit =
            ingredient.cost_per_unit_incl_trim !== null && ingredient.cost_per_unit_incl_trim !== 0
              ? ingredient.cost_per_unit_incl_trim
              : ingredient.cost_per_unit || 0;
          const quantity =
            typeof di.quantity === 'string' ? parseFloat(di.quantity) : di.quantity || 0;
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
  } catch (err: unknown) {
    logger.error('[calculateDishCost] Unexpected error:', {
      dishId,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err; // Re-throw to let caller handle
  }
}
