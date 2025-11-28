import { logger } from '@/lib/logger';
import { useMemo } from 'react';
import { COGSCalculation } from '../../cogs/types';
import { Dish, DishWithDetails, RecipeIngredientWithDetails } from '../types';
import { processRecipeIngredients } from './useDishCOGSCalculations/helpers/processRecipeIngredients';
import { processStandaloneIngredients } from './useDishCOGSCalculations/helpers/processStandaloneIngredients';

export function useDishCOGSCalculations(
  dishDetails: DishWithDetails | null,
  recipeIngredientsMap: Record<string, RecipeIngredientWithDetails[]>,
  dish: Dish | null,
) {
  // Use dishDetails.id as fallback if dish is null
  const dishId = dish?.id || dishDetails?.id || '';

  const calculations: COGSCalculation[] = useMemo(() => {
    if (!dishDetails) return [];

    const allCalculations: COGSCalculation[] = [];
    const recipes = dishDetails.recipes || [];

    logger.dev('[useDishCOGSCalculations] Starting calculation', {
      dishId,
      dishName: dish?.dish_name || dishDetails?.dish_name,
      recipeCount: recipes.length,
      recipeIds: recipes.map(r => r.recipe_id),
      recipeIngredientsMapKeys: Object.keys(recipeIngredientsMap),
    });

    // Process recipe ingredients
    for (const dishRecipe of recipes) {
      const recipeIngredients = recipeIngredientsMap[dishRecipe.recipe_id] || [];
      const recipeCalculations = processRecipeIngredients(dishRecipe, recipeIngredients, dishId);
      allCalculations.push(...recipeCalculations);
    }

    logger.dev('[useDishCOGSCalculations] Recipe ingredients processed', {
      dishId: dish?.id,
      recipeCalculationsCount: allCalculations.length,
    });

    // Process standalone ingredients
    const standaloneCalculations = processStandaloneIngredients(dishDetails, dishId);
    allCalculations.push(...standaloneCalculations);

    const totalCOGS = allCalculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
    logger.dev('[useDishCOGSCalculations] Calculation complete', {
      dishId,
      dishName: dish?.dish_name || dishDetails?.dish_name,
      totalCalculations: allCalculations.length,
      recipeCalculations: allCalculations.filter(c => c.recipeId !== dishId && c.recipeId !== '')
        .length,
      standaloneCalculations: allCalculations.filter(
        c => c.recipeId === dishId || c.recipeId === '',
      ).length,
      totalCOGS,
      breakdown: allCalculations.map(c => ({
        name: c.ingredientName,
        yieldAdjustedCost: c.yieldAdjustedCost,
        recipeId: c.recipeId,
      })),
    });

    return allCalculations;
  }, [dishDetails, recipeIngredientsMap, dishId, dish]);

  const totalCOGS = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );

  return { calculations, totalCOGS, costPerPortion: totalCOGS };
}
