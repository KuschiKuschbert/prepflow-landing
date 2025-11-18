import { flushSync } from 'react-dom';
import type { COGSCalculation, Ingredient } from '../../../../cogs/types';

interface EditIngredientProps {
  ingredientId: string;
  newQuantity: number;
  newUnit: string;
  convertedQuantity: number;
  currentCalculations: COGSCalculation[];
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  updateCalculation: (
    ingredientId: string,
    quantity: number,
    ingredients: Ingredient[],
    setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  ) => void;
}

/**
 * Edit ingredient calculation.
 *
 * @param {EditIngredientProps} props - Edit ingredient props
 */
export function editIngredientCalculation({
  ingredientId,
  convertedQuantity,
  ingredients,
  setCalculations,
  updateCalculation,
}: EditIngredientProps): void {
  flushSync(() => {
    updateCalculation(ingredientId, convertedQuantity, ingredients, setCalculations);
  });
}
