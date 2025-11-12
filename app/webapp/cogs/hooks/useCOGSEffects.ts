'use client';

import { useEffect, useState } from 'react';
import { COGSCalculation } from '../types';

interface UseCOGSEffectsProps {
  checkRecipeExists: (name: string) => Promise<boolean | null>;
  dishName: string;
  dishNameLocked: boolean;
  setSuccessMessage: (msg: string | null) => void;
  setDishName: (name: string) => void;
  setDishPortions: (portions: number) => void;
  setDishNameLocked: (locked: boolean) => void;
  setShowSuggestions: (show: boolean) => void;
  loadCalculations: (calculations: COGSCalculation[]) => void;
  setSelectedRecipe: (recipeId: string) => void;
}

export function useCOGSEffects({
  checkRecipeExists,
  dishName,
  dishNameLocked,
  setSuccessMessage,
  setDishName,
  setDishPortions,
  setDishNameLocked,
  setShowSuggestions,
  loadCalculations,
  setSelectedRecipe,
}: UseCOGSEffectsProps) {
  const [recipeExists, setRecipeExists] = useState<boolean | null>(null);
  const [checkingRecipe, setCheckingRecipe] = useState(false);

  // Handle editing data from recipe book
  useEffect(() => {
    const editingData = sessionStorage.getItem('editingRecipe');
    if (editingData) {
      try {
        const { recipe, recipeId, calculations, dishName, dishPortions, dishNameLocked } =
          JSON.parse(editingData);

        const actualRecipeId = recipeId || recipe?.id;
        if (dishName) setDishName(dishName);
        if (dishPortions) setDishPortions(dishPortions);
        if (dishNameLocked !== undefined) setDishNameLocked(dishNameLocked);
        if (actualRecipeId) setSelectedRecipe(actualRecipeId);
        if (calculations?.length > 0) {
          loadCalculations(calculations);
        } else {
          console.warn('No calculations found in editing data');
        }

        sessionStorage.removeItem('editingRecipe');
        setSuccessMessage(`Recipe "${dishName}" loaded for editing!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error('Failed to parse editing data:', err);
      }
    }
  }, [
    setSuccessMessage,
    setDishName,
    setDishPortions,
    setDishNameLocked,
    loadCalculations,
    setSelectedRecipe,
  ]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('.ingredient-search-container') &&
        !target.closest('.suggestions-dropdown')
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  // Debounced recipe check
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (dishName.trim() && !dishNameLocked) {
        setCheckingRecipe(true);
        setRecipeExists(await checkRecipeExists(dishName));
        setCheckingRecipe(false);
      } else if (!dishName.trim()) setRecipeExists(null);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dishName, dishNameLocked, checkRecipeExists]);

  return { recipeExists, checkingRecipe };
}
