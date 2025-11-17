import { flushSync } from 'react-dom';
import { createCalculation } from '../../../cogs/hooks/utils/createCalculation';
import type { COGSCalculation, Ingredient } from '../../../cogs/types';

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
    calculations,
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
  if (existingCalc) {
    flushSync(() => {
      updateCalculation(
        ingredient.id,
        existingCalc.quantity + convertedQuantity,
        ingredients,
        setCalculations,
      );
    });
  } else {
    const newCalc = createCalculation(
      ingredient.id,
      ingredient,
      convertedQuantity,
      convertedUnit,
      conversionNote || '',
      null, // selectedRecipe - not applicable for dish builder
    );
    flushSync(() => {
      setCalculations(prev => [...prev, newCalc]);
    });
  }
}

export function removeCalculation(
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  ingredientId: string,
): void {
  setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
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
  flushSync(() => {
    updateCalculation(ingredientId, convertedQuantity, ingredients, setCalculations);
  });
}

export function clearCalculations(
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
): void {
  setCalculations([]);
}
