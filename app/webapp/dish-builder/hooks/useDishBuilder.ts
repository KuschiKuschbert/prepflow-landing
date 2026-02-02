'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { usePricing } from '../../cogs/hooks/usePricing';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { useAutoPopulatePrice } from './utils/autoPopulatePrice';
import { createDishBuilderCallbacks } from './helpers/createCallbacks';
import { DishBuilderState } from '../types';
import { COGSCalculation } from '@/lib/types/cogs';

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
  const { updateCalculation } = useCOGSCalculationLogic({
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
  const callbacks = useMemo(
    () =>
      createDishBuilderCallbacks({
        calculations,
        calculationsRef,
        ingredients,
        setCalculations,
        updateCalculation,
        convertIngredientQuantity,
        dishState,
        setError,
        setDishState,
      }),
    [
      calculations,
      calculationsRef,
      ingredients,
      setCalculations,
      updateCalculation,
      convertIngredientQuantity,
      dishState,
      setError,
      setDishState,
    ],
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
    ...callbacks,
  };
}
