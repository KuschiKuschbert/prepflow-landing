'use client';

import { useEffect, useState, useRef } from 'react';
import { useCOGSDataFetching } from './useCOGSDataFetching';
import { useCOGSCalculationLogic } from './useCOGSCalculationLogic';
import { useRecipeIngredients } from './useRecipeIngredients';
import { COGSCalculation, RecipeIngredient } from '../types';
import { mapCalculationsToRecipeIngredients } from './utils/mapCalculationsToRecipeIngredients';
import { removeCalculationHelper, addCalculationHelper } from './utils/calculationManagement';

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
    removeCalculationHelper(
      ingredientId,
      setCalculations,
      setRecipeIngredients,
      hasManualIngredientsRef,
    );
  };
  const addCalculation = (calculation: COGSCalculation) => {
    addCalculationHelper(
      calculation,
      selectedRecipe,
      setCalculations,
      setRecipeIngredients,
      hasManualIngredientsRef,
    );
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
