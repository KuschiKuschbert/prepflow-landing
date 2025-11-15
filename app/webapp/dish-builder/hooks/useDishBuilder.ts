'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { usePricing } from '../../cogs/hooks/usePricing';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { createCalculation } from '../../cogs/hooks/utils/createCalculation';
import { DishBuilderState } from '../types';
import { COGSCalculation, Ingredient } from '../../cogs/types';

export function useDishBuilder() {
  // Data fetching
  const { ingredients, recipes, loading, error, setError, fetchData } = useCOGSDataFetching();

  // Dish state
  const [dishState, setDishState] = useState<DishBuilderState>({
    dishName: '',
    description: '',
    sellingPrice: 0,
    itemType: 'dish',
    yield: 1,
    yield_unit: 'portion',
    instructions: '',
  });

  // Calculations
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });

  // Pricing
  const costPerPortion = useMemo(() => {
    if (calculations.length === 0) return 0;
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);

  // Ingredient conversion
  const { convertIngredientQuantity } = useIngredientConversion();

  // Refs for calculations
  const calculationsRef = useRef(calculations);
  useEffect(() => {
    calculationsRef.current = calculations;
  }, [calculations]);

  // Auto-populate selling price when pricing calculation changes (only if price is 0 or not set)
  useEffect(() => {
    if (
      pricingCalculation &&
      pricingCalculation.sellPriceInclGST > 0 &&
      (dishState.sellingPrice === 0 || !dishState.sellingPrice)
    ) {
      setDishState(prev => ({
        ...prev,
        sellingPrice: pricingCalculation.sellPriceInclGST,
      }));
    }
  }, [pricingCalculation, dishState.sellingPrice]);

  // Handle ingredient addition
  const handleIngredientAdded = useCallback(
    (ingredient: Ingredient, quantity: number, unit: string) => {
      try {
        const currentCalculations = calculationsRef.current;
        const existingCalc = currentCalculations.find(calc => calc.ingredientId === ingredient.id);

        // Convert quantity if needed
        const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
          quantity,
          unit,
          ingredient.unit || 'kg',
        );

        if (existingCalc) {
          // Add to existing quantity
          flushSync(() => {
            updateCalculation(
              ingredient.id,
              existingCalc.quantity + convertedQuantity,
              ingredients,
              setCalculations,
            );
          });
        } else {
          // Create new calculation
          const newCalc = createCalculation(
            ingredient.id,
            ingredient,
            convertedQuantity,
            convertedUnit,
            conversionNote,
            null, // No recipe ID for dish builder
          );
          flushSync(() => {
            setCalculations(prev => [...prev, newCalc]);
          });
        }
      } catch (err) {
        console.error('Error adding ingredient:', err);
        setError(err instanceof Error ? err.message : 'Failed to add ingredient');
      }
    },
    [updateCalculation, setError, convertIngredientQuantity, ingredients, setCalculations],
  );

  // Remove calculation
  const removeCalculation = useCallback((ingredientId: string) => {
    setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
  }, []);

  // Clear all calculations
  const clearCalculations = useCallback(() => {
    setCalculations([]);
  }, []);

  // Update calculation quantity
  const editCalculation = useCallback(
    (ingredientId: string, quantity: number) => {
      updateCalculation(ingredientId, quantity, ingredients, setCalculations);
    },
    [updateCalculation, ingredients, setCalculations],
  );

  // Save dish or recipe
  const saveDish = useCallback(async () => {
    if (!dishState.dishName.trim()) {
      setError(`${dishState.itemType === 'dish' ? 'Dish' : 'Recipe'} name is required`);
      return { success: false };
    }

    if (calculations.length === 0) {
      setError(`${dishState.itemType === 'dish' ? 'Dish' : 'Recipe'} must contain at least one ingredient`);
      return { success: false };
    }

    if (dishState.itemType === 'dish' && dishState.sellingPrice <= 0) {
      setError('Selling price must be greater than 0');
      return { success: false };
    }

    if (dishState.itemType === 'recipe' && (!dishState.yield || dishState.yield <= 0)) {
      setError('Yield must be greater than 0');
      return { success: false };
    }

    try {
      // Prepare ingredients for API (expanded, not recipe references)
      const itemIngredients = calculations.map(calc => ({
        ingredient_id: calc.ingredientId,
        quantity: calc.quantity,
        unit: calc.unit,
      }));

      if (dishState.itemType === 'recipe') {
        // Save as recipe - create the recipe with all fields
        const recipeResponse = await fetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: dishState.dishName.trim(),
            yield: dishState.yield || 1,
            yield_unit: dishState.yield_unit || 'portion',
            category: 'Uncategorized',
            description: dishState.description?.trim() || null,
            instructions: dishState.instructions?.trim() || null,
          }),
        });

        const recipeResult = await recipeResponse.json();

        if (!recipeResponse.ok) {
          setError(recipeResult.error || recipeResult.message || 'Failed to save recipe');
          return { success: false };
        }

        const recipeId = recipeResult.recipe?.id || recipeResult.recipe?.[0]?.id;

        if (!recipeId) {
          setError('Failed to get recipe ID after creation');
          return { success: false };
        }

        // Then add ingredients
        const ingredientsResponse = await fetch(`/api/recipes/${recipeId}/ingredients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: itemIngredients.map(ing => ({
              ingredient_id: ing.ingredient_id,
              quantity: ing.quantity,
              unit: ing.unit,
            })),
            isUpdate: false,
          }),
        });

        if (!ingredientsResponse.ok) {
          const ingredientsResult = await ingredientsResponse.json();
          setError(ingredientsResult.error || 'Failed to save recipe ingredients');
          return { success: false };
        }

        // Reset form
        setDishState({
          dishName: '',
          description: '',
          sellingPrice: 0,
          itemType: 'dish',
          yield: 1,
          yield_unit: 'portion',
          instructions: '',
        });
        setCalculations([]);

        return { success: true, recipe: recipeResult.recipe };
      } else {
        // Save as dish
        const response = await fetch('/api/dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dish_name: dishState.dishName.trim(),
            description: dishState.description.trim() || null,
            selling_price: dishState.sellingPrice,
            ingredients: itemIngredients,
            // No recipes - we expand them to ingredients
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || result.message || 'Failed to save dish');
          return { success: false };
        }

        // Reset form
        setDishState({
          dishName: '',
          description: '',
          sellingPrice: 0,
          itemType: 'dish',
          yield: 1,
          yield_unit: 'portion',
          instructions: '',
        });
        setCalculations([]);

        return { success: true, dish: result.dish };
      }
    } catch (err) {
      console.error(`Error saving ${dishState.itemType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to save ${dishState.itemType}`);
      return { success: false };
    }
  }, [dishState, calculations, setError]);

  // Total COGS
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  return {
    // Data
    ingredients,
    recipes,
    loading,
    error,
    setError,
    fetchData,

    // Dish state
    dishState,
    setDishState,

    // Calculations
    calculations,
    totalCOGS,
    costPerPortion,

    // Pricing
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,

    // Handlers
    handleIngredientAdded,
    removeCalculation,
    editCalculation,
    clearCalculations,
    saveDish,
  };
}
