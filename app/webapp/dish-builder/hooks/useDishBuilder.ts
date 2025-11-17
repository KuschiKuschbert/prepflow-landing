'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { usePricing } from '../../cogs/hooks/usePricing';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import {
  handleIngredientAdded,
  removeCalculation,
  editCalculation,
  clearCalculations,
} from './utils/ingredientManagement';
import { saveDish as saveDishHelper } from './utils/dishSave';
import { useAutoPopulatePrice } from './utils/autoPopulatePrice';
import { DishBuilderState } from '../types';
import { COGSCalculation, Ingredient } from '../../cogs/types';
export function useDishBuilder() {
  const { ingredients, recipes, loading, error, setError, fetchData } = useCOGSDataFetching();
  const [dishState, setDishState] = useState<DishBuilderState>({
    dishName: '',
    description: '',
    sellingPrice: 0,
    itemType: 'dish',
    yield: 1,
    yield_unit: 'portion',
    instructions: '',
  });
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });
  const costPerPortion = useMemo(
    () =>
      calculations.length === 0
        ? 0
        : calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );
  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);
  const { convertIngredientQuantity } = useIngredientConversion();

  const calculationsRef = useRef(calculations);
  useEffect(() => {
    calculationsRef.current = calculations;
  }, [calculations]);

  useAutoPopulatePrice({ pricingCalculation, dishState, setDishState });

  const handleIngredientAddedCallback = useCallback(
    (ingredient: Ingredient, quantity: number, unit: string) => {
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
    },
    [
      calculations,
      calculationsRef,
      ingredients,
      setCalculations,
      updateCalculation,
      convertIngredientQuantity,
    ],
  );

  const removeCalculationCallback = useCallback(
    (ingredientId: string) => removeCalculation(setCalculations, ingredientId),
    [setCalculations],
  );
  const editCalculationCallback = useCallback(
    (ingredientId: string, newQuantity: number, newUnit: string) =>
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
      ),
    [calculationsRef, ingredients, setCalculations, updateCalculation, convertIngredientQuantity],
  );
  const clearCalculationsCallback = useCallback(
    () => clearCalculations(setCalculations),
    [setCalculations],
  );
  const saveDishCallback = useCallback(
    async () =>
      saveDishHelper({ dishState, calculations, setError, setDishState, setCalculations }),
    [dishState, calculations, setError, setDishState, setCalculations],
  );

  const totalCOGS = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );

  return {
    ingredients,
    recipes,
    loading,
    error,
    setError,
    fetchData,
    dishState,
    setDishState,
    calculations,
    totalCOGS,
    costPerPortion,
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
    handleIngredientAdded: handleIngredientAddedCallback,
    removeCalculation: removeCalculationCallback,
    editCalculation: editCalculationCallback,
    clearCalculations: clearCalculationsCallback,
    saveDish: saveDishCallback,
  };
}
