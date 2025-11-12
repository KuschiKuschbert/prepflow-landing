'use client';

import { useEffect, useState, useRef } from 'react';
import { useCOGSDataFetching } from './useCOGSDataFetching';
import { useCOGSCalculationLogic } from './useCOGSCalculationLogic';
import { useRecipeIngredients } from './useRecipeIngredients';
import { COGSCalculation, RecipeIngredient } from '../types';
import { createRecipeIngredientFromCalculation } from './utils/syncRecipeIngredients';
import { mapCalculationsToRecipeIngredients } from './utils/mapCalculationsToRecipeIngredients';

export const useCOGSCalculations = () => {
  const { ingredients, recipes, loading, error, setError, fetchData, setIngredients, setRecipes } =
    useCOGSDataFetching();
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const isLoadingFromApiRef = useRef(false);
  const hasManualIngredientsRef = useRef(false);
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
      setIsLoadingFromApi: (loading: boolean) => {
        isLoadingFromApiRef.current = loading;
      },
      shouldPreserveManualIngredients: () => hasManualIngredientsRef.current,
    });

  const removeCalculation = (ingredientId: string) => {
    setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
    setRecipeIngredients(prev => prev.filter(ri => ri.ingredient_id !== ingredientId));
  };
  const addCalculation = (calculation: COGSCalculation) => {
    hasManualIngredientsRef.current = true;
    setCalculations(prev => [...prev, calculation]);
    setRecipeIngredients(prev => {
      if (prev.some(ri => ri.ingredient_id === calculation.ingredientId)) return prev;
      return [...prev, createRecipeIngredientFromCalculation(calculation, selectedRecipe)];
    });
  };
  const clearCalculations = () => {
    setCalculations([]);
    setRecipeIngredients([]);
  };
  const loadCalculations = (newCalculations: COGSCalculation[]) => {
    hasManualIngredientsRef.current = false;
    setCalculations(newCalculations);
    setRecipeIngredients(mapCalculationsToRecipeIngredients(newCalculations));
  };
  const updateCalculationWrapper = (ingredientId: string, newQuantity: number) =>
    updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);

  const selectedRecipeRef = useRef<string>('');
  useEffect(() => {
    if (selectedRecipe && selectedRecipe !== selectedRecipeRef.current) {
      selectedRecipeRef.current = selectedRecipe;
      hasManualIngredientsRef.current = false;
      fetchRecipeIngredients(selectedRecipe);
    }
  }, [selectedRecipe, fetchRecipeIngredients]);
  useEffect(() => {
    if (isLoadingFromApiRef.current) {
      isLoadingFromApiRef.current = false;
      return;
    }
    if (recipeIngredients.length > 0 && calculations.length === 0 && ingredients.length > 0) {
      calculateCOGS(recipeIngredients);
    }
  }, [recipeIngredients, calculateCOGS, calculations.length, ingredients.length]);

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
