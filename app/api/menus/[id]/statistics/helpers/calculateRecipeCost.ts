import { supabaseAdmin } from '@/lib/supabase';

/**
 * Calculate recipe cost based on ingredients.
 *
 * @param {string} recipeId - Recipe ID
 * @param {number} quantity - Recipe quantity multiplier
 * @returns {Promise<number>} Recipe cost
 */
import { logger } from '@/lib/logger';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function calculateRecipeCost(recipeId: string, quantity: number = 1): Promise<number> {
  if (!supabaseAdmin) {
    logger.error('[calculateRecipeCost] Supabase admin client not available');
    return 0;
  }

  try {
    // Fetch recipe yield first
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('yield')
      .eq('id', recipeId)
      .single();

    if (recipeError) {
      logger.error('[calculateRecipeCost] Error fetching recipe yield:', {
        recipeId,
        error: recipeError,
      });
      // Continue with default yield of 1 if recipe not found
    }

    const recipeYield = recipe?.yield && recipe.yield > 0 ? recipe.yield : 1; // Default to 1 if not set or invalid

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
      throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
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
        const baseCost = adjustedCost;

        if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
          adjustedCost = adjustedCost / (1 - wastePercent / 100);
        }
        const wasteAdjustedCost = adjustedCost;

        adjustedCost = adjustedCost / (yieldPercent / 100);
        const finalCost = adjustedCost;

        logger.dev('[calculateRecipeCost] Ingredient calculation breakdown', {
          recipeId,
          quantity,
          ingredientName: ingredient.ingredient_name || 'Unknown',
          ingredientQuantity,
          costPerUnit,
          baseCost,
          wastePercent,
          wasteAdjustedCost,
          yieldPercent,
          finalCost,
        });

        recipeCost += adjustedCost;
      }
    }

    logger.dev('[calculateRecipeCost] Calculation complete', {
      recipeId,
      recipeCost,
      recipeYield,
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

    // Divide by recipe yield to get cost per serving
    const costPerServing = recipeCost / recipeYield;

    // Multiply by quantity (how many servings the dish needs)
    const finalCost = costPerServing * quantity;

    logger.dev('[calculateRecipeCost] Final cost calculation', {
      recipeId,
      recipeCost,
      recipeYield,
      costPerServing,
      quantity,
      finalCost,
    });

    return finalCost;
  } catch (err) {
    logger.error('[calculateRecipeCost] Unexpected error:', {
      recipeId,
      error: err,
    });
    throw err; // Re-throw to let caller handle
  }
}
