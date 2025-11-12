'use client';

import { useEffect, useState } from 'react';
import { useCOGSDataFetching } from './useCOGSDataFetching';
import { useCOGSCalculationLogic } from './useCOGSCalculationLogic';
import { useRecipeIngredients } from './useRecipeIngredients';
import { COGSCalculation, RecipeIngredient } from '../types';

export const useCOGSCalculations = () => {
  const { ingredients, recipes, loading, error, setError, fetchData, setIngredients, setRecipes } =
    useCOGSDataFetching();
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });
  const { fetchRecipeIngredients, loadExistingRecipeIngredients, checkRecipeExists } =
    useRecipeIngredients({
      setRecipeIngredients,
      setCalculations,
      calculateCOGS,
      setError,
    });

  const removeCalculation = (ingredientId: string) =>
    setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
  const addCalculation = (calculation: COGSCalculation) =>
    setCalculations(prev => [...prev, calculation]);
  const clearCalculations = () => {
    setCalculations([]);
    setRecipeIngredients([]);
  };
  const loadCalculations = (newCalculations: COGSCalculation[]) => {
    setCalculations(newCalculations);
    setRecipeIngredients(
      newCalculations.map(calc => ({
        id: calc.ingredientId,
        recipe_id: calc.recipeId || '',
        ingredient_id: calc.ingredientId,
        ingredient_name: calc.ingredientName,
        quantity: calc.quantity,
        unit: calc.unit,
        cost_per_unit: calc.costPerUnit,
        total_cost: calc.totalCost,
      })),
    );
  };
  const updateCalculationWrapper = (ingredientId: string, newQuantity: number) =>
    updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);

  useEffect(() => {
    if (selectedRecipe) fetchRecipeIngredients(selectedRecipe);
  }, [selectedRecipe, fetchRecipeIngredients]);
  useEffect(() => {
    // Only recalculate if we have recipeIngredients but no calculations yet
    // This prevents overwriting calculations that were already set by loadExistingRecipeIngredients
    if (recipeIngredients.length > 0 && calculations.length === 0) {
      calculateCOGS(recipeIngredients);
    }
  }, [recipeIngredients, calculateCOGS, calculations.length]);

  return {
    ingredients,
    recipes,
    selectedRecipe,
    recipeIngredients,
    calculations,
    loading,
    error,
    fetchData,
    fetchRecipeIngredients,
    calculateCOGS,
    loadExistingRecipeIngredients,
    checkRecipeExists,
    updateCalculation: updateCalculationWrapper,
    removeCalculation,
    addCalculation,
    clearCalculations,
    loadCalculations,
    setSelectedRecipe,
    setError,
  };
};
