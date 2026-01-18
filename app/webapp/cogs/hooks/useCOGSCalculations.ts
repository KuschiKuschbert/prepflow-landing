'use client';

import { useRef, useState } from 'react';
import { COGSCalculation, RecipeIngredient } from '../types';
import { useCOGSCalculationLogic } from './useCOGSCalculationLogic';
import { useCOGSDataFetching } from './useCOGSDataFetching';
import { useRecipeIngredients } from './useRecipeIngredients';
import { useRecipeChangeEffect, useCOGSCalculationEffect } from './helpers/calculationEffects';
import { createCalculationOperations } from './helpers/calculationOperations';

export const useCOGSCalculations = () => {
  const {
    ingredients,
    recipes,
    loading,
    error,
    setError,
    fetchData,
    setIngredients: _setIngredients,
    setRecipes,
  } = useCOGSDataFetching();
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const isLoadingFromApiRef = useRef(false);
  const hasManualIngredientsRef = useRef(false);
  const lastManualChangeTimeRef = useRef<number>(0);
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });
  const { fetchRecipeIngredients, loadExistingRecipeIngredients } = useRecipeIngredients({
    setRecipeIngredients,
    setCalculations,
    calculateCOGS,
    setError,
    setIsLoadingFromApi: (loading: boolean) => {
      isLoadingFromApiRef.current = loading;
    },
    shouldPreserveManualIngredients: () => hasManualIngredientsRef.current,
  });

  const { removeCalculation, addCalculation, clearCalculations, loadCalculations } =
    createCalculationOperations({
      setCalculations,
      setRecipeIngredients,
      hasManualIngredientsRef,
      lastManualChangeTimeRef,
      selectedRecipe,
    });

  const updateCalculationWrapper = (ingredientId: string, newQuantity: number) => {
    hasManualIngredientsRef.current = true;
    lastManualChangeTimeRef.current = Date.now();
    updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);
  };
  useRecipeChangeEffect({
    selectedRecipe,
    fetchRecipeIngredients,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
  });

  useCOGSCalculationEffect({
    recipeIngredients,
    calculations,
    ingredients,
    calculateCOGS,
    isLoadingFromApiRef,
  });
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
    updateCalculation: updateCalculationWrapper,
    removeCalculation,
    addCalculation,
    clearCalculations,
    loadCalculations,
    setSelectedRecipe,
    setRecipes,
    setError,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
  };
};
