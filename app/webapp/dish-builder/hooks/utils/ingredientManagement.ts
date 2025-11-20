import type { COGSCalculation, Ingredient } from '../../../cogs/types';
import { addIngredientToCalculations } from './helpers/addIngredient';
import { editIngredientCalculation } from './helpers/editIngredient';
import { removeCalculation, clearCalculations } from './helpers/calculationHelpers';

interface IngredientManagementProps {
  calculations: COGSCalculation[];
  calculationsRef: React.MutableRefObject<COGSCalculation[]>;
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  updateCalculation: (
    ingredientId: string,
    quantity: number,
    ingredients: Ingredient[],
    setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
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

export function handleIngredientAdded(
  {
    calculationsRef,
    ingredients,
    setCalculations,
    updateCalculation,
    convertIngredientQuantity,
  }: IngredientManagementProps,
  ingredient: Ingredient,
  quantity: number,
  unit: string,
): void {
  const currentCalculations = calculationsRef.current;
  const existingCalc = currentCalculations.find(calc => calc.ingredientId === ingredient.id);
  const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
    quantity,
    unit,
    ingredient.unit || 'kg',
  );
  addIngredientToCalculations({
    ingredient,
    quantity,
    unit,
    convertedQuantity,
    convertedUnit,
    conversionNote,
    existingCalc,
    currentCalculations,
    updateCalculation,
    ingredients,
    setCalculations,
  });
}

export function editCalculation(
  {
    calculationsRef,
    ingredients,
    setCalculations,
    updateCalculation,
    convertIngredientQuantity,
  }: Omit<IngredientManagementProps, 'calculations'>,
  ingredientId: string,
  newQuantity: number,
  newUnit: string,
): void {
  const currentCalculations = calculationsRef.current;
  const existingCalc = currentCalculations.find(calc => calc.ingredientId === ingredientId);
  if (!existingCalc) return;
  const ingredient = ingredients.find(ing => ing.id === ingredientId);
  if (!ingredient) return;
  const { convertedQuantity } = convertIngredientQuantity(
    newQuantity,
    newUnit,
    ingredient.unit || 'kg',
  );
  editIngredientCalculation({
    ingredientId,
    newQuantity,
    newUnit,
    convertedQuantity,
    currentCalculations,
    ingredients,
    setCalculations,
    updateCalculation,
  });
}

// Re-export helpers for backward compatibility
export { removeCalculation, clearCalculations };
