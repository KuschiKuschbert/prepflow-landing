/**
 * Hook for grouping COGS calculations by recipe.
 */

import { useMemo } from 'react';
import type { DishWithDetails } from '../../../../recipes/types';
import type { COGSCalculation } from '../../../types';
import type { RecipeGroup } from '../types';

interface UseRecipeGroupingProps {
  calculations: COGSCalculation[];
  dishDetails: DishWithDetails | null;
}

export function useRecipeGrouping({ calculations, dishDetails }: UseRecipeGroupingProps): {
  recipeGroups: RecipeGroup[];
  standaloneCalculations: COGSCalculation[];
} {
  return useMemo(() => {
    const groups: Map<string, RecipeGroup> = new Map();
    const standalone: COGSCalculation[] = [];
    const dishId = dishDetails?.id;

    // Get recipe info from dishDetails
    const recipeInfoMap = new Map<
      string,
      { name: string; quantity: number; yield: number; yieldUnit: string }
    >();
    if (dishDetails?.recipes) {
      dishDetails.recipes.forEach(dr => {
        if (dr.recipe_id) {
          const recipeName =
            dr.recipes?.recipe_name || (dr.recipes as any)?.name || 'Unknown Recipe';
          const recipeYield = dr.recipes?.yield || 1;
          const recipeYieldUnit = dr.recipes?.yield_unit || 'servings';
          recipeInfoMap.set(String(dr.recipe_id), {
            name: recipeName,
            quantity: Number(dr.quantity) || 1,
            yield: recipeYield,
            yieldUnit: recipeYieldUnit,
          });
        }
      });
    }

    calculations.forEach(calc => {
      // Standalone ingredients have recipeId === dishId or empty string (when dish is null)
      // Recipe ingredients have recipeId matching a recipe in recipeInfoMap
      if (
        !calc.recipeId ||
        calc.recipeId === '' ||
        calc.recipeId === dishId ||
        !recipeInfoMap.has(calc.recipeId)
      ) {
        standalone.push(calc);
      } else {
        // Recipe ingredient
        if (!groups.has(calc.recipeId)) {
          const recipeInfo = recipeInfoMap.get(calc.recipeId)!;
          groups.set(calc.recipeId, {
            recipeId: calc.recipeId,
            recipeName: recipeInfo.name,
            quantity: recipeInfo.quantity,
            yield: recipeInfo.yield,
            yieldUnit: recipeInfo.yieldUnit,
            calculations: [],
            totalCost: 0,
          });
        }
        const group = groups.get(calc.recipeId)!;
        group.calculations.push(calc);
        group.totalCost += calc.yieldAdjustedCost;
      }
    });

    return {
      recipeGroups: Array.from(groups.values()),
      standaloneCalculations: standalone,
    };
  }, [calculations, dishDetails]);
}
