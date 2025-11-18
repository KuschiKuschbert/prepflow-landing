import { flushSync } from 'react-dom';
import { createCalculation } from '../utils/createCalculation';
import { Ingredient, COGSCalculation } from '../../types';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

interface ProcessIngredientProps {
  newIngredient: { ingredient_id: string; quantity: number; unit?: string };
  selectedIngredientData: Ingredient;
  selectedRecipe: string | null;
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => {
    convertedQuantity: number;
    convertedUnit: string;
    conversionNote?: string;
  };
  existingIngredient: COGSCalculation | undefined;
  currentCalculations: COGSCalculation[];
  updateCalculation: (ingredientId: string, quantity: number) => void;
  addCalculation: (calc: COGSCalculation) => void;
  resetForm: () => void;
}

/**
 * Process ingredient addition or update.
 *
 * @param {ProcessIngredientProps} props - Processing props
 */
export function processIngredientAddition({
  newIngredient,
  selectedIngredientData,
  selectedRecipe,
  convertIngredientQuantity,
  existingIngredient,
  currentCalculations,
  updateCalculation,
  addCalculation,
  resetForm,
}: ProcessIngredientProps): void {
  const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
    newIngredient.quantity!,
    newIngredient.unit || 'kg',
    selectedIngredientData.unit || 'kg',
  );

  if (existingIngredient) {
    const currentCalc = currentCalculations.find(
      calc => calc.ingredientId === newIngredient.ingredient_id,
    );
    if (currentCalc) {
      flushSync(() =>
        updateCalculation(newIngredient.ingredient_id!, currentCalc.quantity + convertedQuantity),
      );
      resetForm();
    }
    return;
  }

  const newCalc = createCalculation(
    newIngredient.ingredient_id!,
    selectedIngredientData,
    convertedQuantity,
    convertedUnit,
    conversionNote || '',
    selectedRecipe,
  );
  flushSync(() => {
    addCalculation(newCalc);
  });
  resetForm();
}
