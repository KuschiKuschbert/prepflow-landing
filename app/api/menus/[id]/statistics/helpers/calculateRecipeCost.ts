import { supabaseAdmin } from '@/lib/supabase';

/**
 * Calculate recipe cost based on ingredients.
 *
 * @param {string} recipeId - Recipe ID
 * @param {number} quantity - Recipe quantity multiplier
 * @returns {Promise<number>} Recipe cost
 */
import { logger } from '@/lib/logger';

export async function calculateRecipeCost(recipeId: string, quantity: number = 1): Promise<number> {
  if (!supabaseAdmin) {
    logger.error('[calculateRecipeCost] Supabase admin client not available');
    return 0;
  }

  try {
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
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

    if (recipeIngredientsError) {
      logger.error('[calculateRecipeCost] Error fetching recipe ingredients:', {
        recipeId,
        error: recipeIngredientsError,
      });
      throw new Error(`Failed to fetch recipe ingredients: ${recipeIngredientsError.message}`);
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      logger.warn('[calculateRecipeCost] No ingredients found for recipe:', {
        recipeId,
      });
      return 0;
    }

    let recipeCost = 0;
    let ingredientCount = 0;
    let missingCostCount = 0;

    for (const ri of recipeIngredients) {
      const ingredient = ri.ingredients as any;
      if (ingredient) {
        ingredientCount++;
        const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
        const ingredientQuantity = parseFloat(ri.quantity) || 0;

        if (costPerUnit === 0) {
          missingCostCount++;
          logger.warn('[calculateRecipeCost] Ingredient missing cost data:', {
            recipeId,
            ingredientId: ingredient.id,
            ingredientName: ingredient.ingredient_name || 'Unknown',
          });
        }

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

    logger.dev('[calculateRecipeCost] Calculation complete', {
      recipeId,
      recipeCost,
      ingredientCount,
      missingCostCount,
      quantity,
    });

    if (recipeCost === 0 && ingredientCount > 0) {
      logger.warn('[calculateRecipeCost] Recipe cost is 0 but has ingredients:', {
        recipeId,
        ingredientCount,
        missingCostCount,
      });
    }

    return recipeCost;
  } catch (err) {
    logger.error('[calculateRecipeCost] Unexpected error:', {
      recipeId,
      error: err,
    });
    throw err; // Re-throw to let caller handle
  }
}
