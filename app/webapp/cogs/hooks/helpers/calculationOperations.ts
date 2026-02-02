import { COGSCalculation, RecipeIngredient } from '@/lib/types/cogs';
import { addCalculationHelper, removeCalculationHelper } from '../utils/calculationManagement';
import { mapCalculationsToRecipeIngredients } from '../utils/mapCalculationsToRecipeIngredients';

interface CalculationOperationsProps {
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
  hasManualIngredientsRef: React.MutableRefObject<boolean>;
  lastManualChangeTimeRef: React.MutableRefObject<number>;
  selectedRecipe: string;
}

/**
 * Create calculation operation handlers.
 *
 * @param {CalculationOperationsProps} props - Operation dependencies
 * @returns {Object} Calculation operation handlers
 */
export function createCalculationOperations({
  setCalculations,
  setRecipeIngredients,
  hasManualIngredientsRef,
  lastManualChangeTimeRef,
  selectedRecipe,
}: CalculationOperationsProps) {
  const removeCalculation = (ingredientId: string) => {
    removeCalculationHelper(
      ingredientId,
      setCalculations,
      setRecipeIngredients,
      hasManualIngredientsRef,
      lastManualChangeTimeRef,
    );
  };

  const addCalculation = (calculation: COGSCalculation) => {
    addCalculationHelper(
      calculation,
      selectedRecipe,
      setCalculations,
      setRecipeIngredients,
      hasManualIngredientsRef,
      lastManualChangeTimeRef,
    );
  };

  const clearCalculations = () => {
    setCalculations([]);
    setRecipeIngredients([]);
  };

  const loadCalculations = (newCalculations: COGSCalculation[]) => {
    hasManualIngredientsRef.current = false;
    setCalculations(newCalculations);
    setRecipeIngredients(mapCalculationsToRecipeIngredients(newCalculations));
  };

  return {
    removeCalculation,
    addCalculation,
    clearCalculations,
    loadCalculations,
  };
}
