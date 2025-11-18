import { flushSync } from 'react-dom';
import { createCalculation } from '../../../../cogs/hooks/utils/createCalculation';
import type { COGSCalculation, Ingredient } from '../../../../cogs/types';

interface AddIngredientProps {
  ingredient: Ingredient;
  quantity: number;
  unit: string;
  convertedQuantity: number;
  convertedUnit: string;
  conversionNote?: string;
  existingCalc: COGSCalculation | undefined;
  currentCalculations: COGSCalculation[];
  updateCalculation: (
    ingredientId: string,
    quantity: number,
    ingredients: Ingredient[],
    setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  ) => void;
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

/**
 * Add ingredient to calculations (update existing or create new).
 *
 * @param {AddIngredientProps} props - Add ingredient props
 */
export function addIngredientToCalculations({
  ingredient,
  convertedQuantity,
  convertedUnit,
  conversionNote,
  existingCalc,
  currentCalculations,
  updateCalculation,
  ingredients,
  setCalculations,
}: AddIngredientProps): void {
  if (existingCalc) {
    flushSync(() => {
      updateCalculation(ingredient.id, existingCalc.quantity + convertedQuantity, ingredients, setCalculations);
    });
  } else {
    const newCalc = createCalculation(
      ingredient.id,
      ingredient,
      convertedQuantity,
      convertedUnit,
      conversionNote || '',
      null,
    );
    flushSync(() => {
      setCalculations(prev => [...prev, newCalc]);
    });
  }
}
