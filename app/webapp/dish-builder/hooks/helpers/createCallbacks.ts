import { RefObject } from 'react';
import { COGSCalculation, Ingredient } from '../../../cogs/types';
import { DishBuilderState } from '../../types';
import { createIngredientCallbacks } from './ingredientCallbacks';
import { createDishCallbacks } from './dishCallbacks';

interface CallbackDependencies {
  calculations: COGSCalculation[];
  calculationsRef: RefObject<COGSCalculation[]>;
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
  dishState: DishBuilderState;
  setError: (error: string) => void;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
}

/**
 * Create all callbacks for dish builder operations.
 *
 * @param {CallbackDependencies} deps - Dependencies for callbacks
 * @returns {Object} Object containing all callbacks
 */
export function createDishBuilderCallbacks(deps: CallbackDependencies) {
  const {
    calculations,
    calculationsRef,
    ingredients,
    setCalculations,
    updateCalculation,
    convertIngredientQuantity,
    dishState,
    setError,
    setDishState,
  } = deps;

  const ingredientCallbacks = createIngredientCallbacks({
    calculations,
    calculationsRef,
    ingredients,
    setCalculations,
    updateCalculation,
    convertIngredientQuantity,
  });

  const dishCallbacks = createDishCallbacks({
    dishState,
    calculations,
    setError,
    setDishState,
    setCalculations,
  });

  return {
    ...ingredientCallbacks,
    ...dishCallbacks,
  };
}
