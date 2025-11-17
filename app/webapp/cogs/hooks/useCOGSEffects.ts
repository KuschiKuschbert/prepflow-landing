'use client';

import { useEffect } from 'react';
import { COGSCalculation } from '../types';

import { logger } from '@/lib/logger';
interface UseCOGSEffectsProps {
  setSuccessMessage: (msg: string | null) => void;
  setDishPortions: (portions: number) => void;
  setShowSuggestions: (show: boolean) => void;
  loadCalculations: (calculations: COGSCalculation[]) => void;
  setSelectedRecipe: (recipeId: string) => void;
}

/**
 * Simplified COGS effects hook
 * Handles editing data from recipe book and closing suggestions
 */
export function useCOGSEffects({
  setSuccessMessage,
  setDishPortions,
  setShowSuggestions,
  loadCalculations,
  setSelectedRecipe,
}: UseCOGSEffectsProps) {
  // Handle editing data from recipe book
  useEffect(() => {
    const editingData = sessionStorage.getItem('editingRecipe');
    if (!editingData) return;
    try {
      const { recipe, recipeId, calculations, dishPortions } = JSON.parse(editingData);
      const actualRecipeId = recipeId || recipe?.id;
      if (dishPortions) setDishPortions(dishPortions);
      if (actualRecipeId) setSelectedRecipe(actualRecipeId);
      if (calculations?.length > 0) loadCalculations(calculations);
      sessionStorage.removeItem('editingRecipe');
      const recipeName = recipe?.name || 'Recipe';
      setSuccessMessage(`Recipe "${recipeName}" loaded for editing!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      logger.error('Failed to parse editing data:', err);
    }
  }, [setSuccessMessage, setDishPortions, loadCalculations, setSelectedRecipe]);

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
}
