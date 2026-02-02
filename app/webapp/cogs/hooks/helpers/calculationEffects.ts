import { logger } from '@/lib/logger';
import { useEffect, useRef } from 'react';
import { COGSCalculation, Ingredient, RecipeIngredient } from '@/lib/types/cogs';

interface CalculationEffectsProps {
  selectedRecipe: string;
  fetchRecipeIngredients: (recipeId: string) => void;
  recipeIngredients: RecipeIngredient[];
  calculations: COGSCalculation[];
  ingredients: Ingredient[];
  calculateCOGS: (recipeIngredients: RecipeIngredient[]) => void;
  isLoadingFromApiRef: React.MutableRefObject<boolean>;
  hasManualIngredientsRef: React.MutableRefObject<boolean>;
  lastManualChangeTimeRef: React.MutableRefObject<number>;
}

/**
 * Effect to fetch recipe ingredients when recipe changes.
 *
 * @param {CalculationEffectsProps} props - Effect dependencies
 */
export function useRecipeChangeEffect({
  selectedRecipe,
  fetchRecipeIngredients,
  hasManualIngredientsRef,
  lastManualChangeTimeRef,
}: Pick<
  CalculationEffectsProps,
  | 'selectedRecipe'
  | 'fetchRecipeIngredients'
  | 'hasManualIngredientsRef'
  | 'lastManualChangeTimeRef'
>) {
  const selectedRecipeRef = useRef<string>('');

  useEffect(() => {
    if (selectedRecipe && selectedRecipe !== selectedRecipeRef.current) {
      const timeSinceLastChange = Date.now() - (lastManualChangeTimeRef?.current || 0);
      if (hasManualIngredientsRef.current && timeSinceLastChange < 10000) {
        logger.dev(
          '[useCOGSCalculations] Skipping fetchRecipeIngredients - manual changes detected',
        );
        selectedRecipeRef.current = selectedRecipe;
        return;
      }
      selectedRecipeRef.current = selectedRecipe;
      hasManualIngredientsRef.current = false;
      fetchRecipeIngredients(selectedRecipe);
    }
  }, [selectedRecipe, fetchRecipeIngredients, hasManualIngredientsRef, lastManualChangeTimeRef]);
}

/**
 * Effect to calculate COGS when recipe ingredients change.
 *
 * @param {CalculationEffectsProps} props - Effect dependencies
 */
export function useCOGSCalculationEffect({
  recipeIngredients,
  calculations,
  ingredients,
  calculateCOGS,
  isLoadingFromApiRef,
}: Pick<
  CalculationEffectsProps,
  'recipeIngredients' | 'calculations' | 'ingredients' | 'calculateCOGS' | 'isLoadingFromApiRef'
>) {
  useEffect(() => {
    if (isLoadingFromApiRef.current) {
      isLoadingFromApiRef.current = false;
      return;
    }
    if (recipeIngredients.length > 0 && calculations.length === 0 && ingredients.length > 0) {
      calculateCOGS(recipeIngredients);
    }
  }, [
    recipeIngredients,
    calculateCOGS,
    calculations.length,
    ingredients.length,
    isLoadingFromApiRef,
  ]);
}
