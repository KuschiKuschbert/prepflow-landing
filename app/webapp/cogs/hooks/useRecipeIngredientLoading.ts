'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { COGSCalculation, RecipeIngredient } from '../types';

interface UseRecipeIngredientLoadingProps {
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
}

export function useRecipeIngredientLoading({
  setCalculations,
  setRecipeIngredients,
}: UseRecipeIngredientLoadingProps) {
  const loadExistingRecipeIngredients = useCallback(
    async (recipeId: string) => {
      try {
        const { data: recipeIngredients, error } = await supabase
          .from('recipe_ingredients')
          .select(
            'id,quantity,unit,ingredients(id,ingredient_name,cost_per_unit,unit,trim_peel_waste_percentage,yield_percentage)',
          )
          .eq('recipe_id', recipeId);
        if (error) {
          console.log('Error loading recipe ingredients:', error);
          return;
        }
        const loadedCalculations: COGSCalculation[] = recipeIngredients.map(ri => {
          const ingredient = ri.ingredients as any;
          const costPerUnit = convertIngredientCost(
            ingredient.cost_per_unit,
            ingredient.unit || 'g',
            ri.unit || 'g',
            ri.quantity,
          );
          const totalCost = ri.quantity * costPerUnit;
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;
          return {
            recipeId,
            ingredientId: ingredient.id,
            ingredientName: ingredient.ingredient_name,
            quantity: ri.quantity,
            unit: ri.unit,
            costPerUnit,
            totalCost,
            wasteAdjustedCost: totalCost * (1 + wastePercent / 100),
            yieldAdjustedCost: (totalCost * (1 + wastePercent / 100)) / (yieldPercent / 100),
          };
        });
        setCalculations(loadedCalculations);
        setRecipeIngredients(
          recipeIngredients.map(dbItem => {
            const ingredient = dbItem.ingredients as any;
            return {
              id: dbItem.id || 'temp',
              recipe_id: recipeId,
              ingredient_id: ingredient.id,
              ingredient_name: ingredient.ingredient_name,
              quantity: dbItem.quantity,
              unit: dbItem.unit,
              cost_per_unit: ingredient.cost_per_unit || 0,
              total_cost: dbItem.quantity * (ingredient.cost_per_unit || 0),
            };
          }),
        );
      } catch (err) {
        console.log('Error in loadExistingRecipeIngredients:', err);
      }
    },
    [setCalculations, setRecipeIngredients],
  );

  return { loadExistingRecipeIngredients };
}
