import { COGSCalculation, RecipeIngredient } from '../../types';
import { createRecipeIngredientFromCalculation } from './syncRecipeIngredients';

export function removeCalculationHelper(
  ingredientId: string,
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>,
  hasManualIngredientsRef: React.MutableRefObject<boolean>,
): void {
  hasManualIngredientsRef.current = true;
  setCalculations(prev => {
    const filtered = prev.filter(calc => calc.ingredientId !== ingredientId);
    if (filtered.length === 0) {
      hasManualIngredientsRef.current = true; // Keep true even when empty to preserve manual changes
    }
    return filtered;
  });
  setRecipeIngredients(prev => prev.filter(ri => ri.ingredient_id !== ingredientId));
}

export function addCalculationHelper(
  calculation: COGSCalculation,
  selectedRecipe: string,
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>,
  hasManualIngredientsRef: React.MutableRefObject<boolean>,
): void {
  hasManualIngredientsRef.current = true;
  setCalculations(prev => [...prev, calculation]);
  setRecipeIngredients(prev => {
    if (prev.some(ri => ri.ingredient_id === calculation.ingredientId)) return prev;
    return [...prev, createRecipeIngredientFromCalculation(calculation, selectedRecipe)];
  });
}
