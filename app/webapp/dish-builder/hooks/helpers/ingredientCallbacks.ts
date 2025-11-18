import { Ingredient } from '../../../cogs/types';
import { handleIngredientAdded, editCalculation } from '../utils/ingredientManagement';
import { createSimpleCallbacks } from './simpleCallbacks';

interface IngredientCallbacksProps {
  calculations: any[];
  calculationsRef: React.MutableRefObject<any[]>;
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<any[]>>;
  updateCalculation: (
    ingredientId: string,
    quantity: number,
    ingredients: Ingredient[],
    setCalculations: React.Dispatch<React.SetStateAction<any[]>>,
  ) => void;
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => {
    convertedQuantity: number;
    convertedUnit: string;
    conversionNote?: string;
  };
}

/**
 * Create ingredient-related callbacks.
 * Note: useCallback should be applied in the parent hook.
 *
 * @param {IngredientCallbacksProps} props - Callback dependencies
 * @returns {Object} Ingredient callbacks
 */
export function createIngredientCallbacks({
  calculations,
  calculationsRef,
  ingredients,
  setCalculations,
  updateCalculation,
  convertIngredientQuantity,
}: IngredientCallbacksProps) {
  const handleIngredientAddedCallback = (ingredient: Ingredient, quantity: number, unit: string) => {
    handleIngredientAdded(
      {
        calculations,
        calculationsRef,
        ingredients,
        setCalculations,
        updateCalculation,
        convertIngredientQuantity,
      },
      ingredient,
      quantity,
      unit,
    );
  };

  const editCalculationCallback = (ingredientId: string, newQuantity: number, newUnit: string) =>
    editCalculation(
      {
        calculationsRef,
        ingredients,
        setCalculations,
        updateCalculation,
        convertIngredientQuantity,
      },
      ingredientId,
      newQuantity,
      newUnit,
    );

  const simpleCallbacks = createSimpleCallbacks(setCalculations);

  return {
    handleIngredientAdded: handleIngredientAddedCallback,
    editCalculation: editCalculationCallback,
    ...simpleCallbacks,
  };
}
