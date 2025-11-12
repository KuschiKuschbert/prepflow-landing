'use client';

import { useCallback } from 'react';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { COGSCalculation, RecipeIngredient } from '../types';

interface UseRecipeIngredientLoadingProps {
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
  setError?: (error: string) => void;
}

type ApiIngredientItem = {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
  };
};

export function useRecipeIngredientLoading({
  setCalculations,
  setRecipeIngredients,
  setError,
}: UseRecipeIngredientLoadingProps) {
  const loadExistingRecipeIngredients = useCallback(
    async (recipeId: string) => {
      if (!recipeId) return;

      try {
        const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          if (setError)
            setError(errorData.error || `Failed to fetch ingredients: ${response.status}`);
          return;
        }
        const result = await response.json();
        const items: ApiIngredientItem[] = result.items || [];
        if (items.length === 0) {
          setCalculations([]);
          setRecipeIngredients([]);
          return;
        }
        const loadedCalculations: COGSCalculation[] = items.map(item => {
          const ing = item.ingredients;
          const costPerUnit = convertIngredientCost(
            ing.cost_per_unit || 0,
            ing.unit || 'g',
            item.unit || 'g',
            item.quantity,
          );
          const totalCost = item.quantity * costPerUnit;
          const wastePercent = ing.trim_peel_waste_percentage || 0;
          const yieldPercent = ing.yield_percentage || 100;
          return {
            recipeId: item.recipe_id || recipeId,
            ingredientId: ing.id,
            ingredientName: ing.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            costPerUnit,
            totalCost,
            wasteAdjustedCost: totalCost * (1 + wastePercent / 100),
            yieldAdjustedCost: (totalCost * (1 + wastePercent / 100)) / (yieldPercent / 100),
            id: item.id,
            ingredient_id: ing.id,
            ingredient_name: ing.ingredient_name,
            cost_per_unit: costPerUnit,
            total_cost: totalCost,
          };
        });
        const recipeIngredients: RecipeIngredient[] = items.map(item => {
          const ing = item.ingredients;
          return {
            id: item.id,
            recipe_id: item.recipe_id || recipeId,
            ingredient_id: ing.id,
            ingredient_name: ing.ingredient_name,
            quantity: item.quantity,
            unit: item.unit,
            cost_per_unit: ing.cost_per_unit || 0,
            total_cost: item.quantity * (ing.cost_per_unit || 0),
          };
        });
        setCalculations(loadedCalculations);
        Promise.resolve().then(() => setRecipeIngredients(recipeIngredients));
      } catch (err) {
        if (setError)
          setError(err instanceof Error ? err.message : 'Failed to load recipe ingredients');
      }
    },
    [setCalculations, setRecipeIngredients, setError],
  );
  return { loadExistingRecipeIngredients };
}
