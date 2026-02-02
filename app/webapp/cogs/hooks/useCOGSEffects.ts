'use client';

import { useEffect } from 'react';
import { COGSCalculation } from '@/lib/types/cogs';
import { useNotification } from '@/contexts/NotificationContext';

import { logger } from '@/lib/logger';
interface UseCOGSEffectsProps {
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
  setDishPortions,
  setShowSuggestions,
  loadCalculations,
  setSelectedRecipe,
}: UseCOGSEffectsProps) {
  const { showSuccess } = useNotification();

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
      const recipeName = recipe?.recipe_name || 'Recipe';
      showSuccess(`Recipe "${recipeName}" loaded for editing!`);
    } catch (err) {
      logger.error('Failed to parse editing data:', err);
    }
  }, [showSuccess, setDishPortions, loadCalculations, setSelectedRecipe]);

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
