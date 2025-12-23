'use client';

import { useCallback, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

export function useRecipeShareOperations() {
  const { showError: showErrorNotification } = useNotification();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  const handleShareRecipe = useCallback(
    async (
      selectedRecipe: Recipe,
      recipeIngredients: RecipeIngredientWithDetails[],
      aiInstructions: string,
    ) => {
      if (!selectedRecipe || !recipeIngredients.length) {
        showErrorNotification('No recipe data available for sharing');
        return;
      }

      setShareLoading(true);
      try {
        const recipeData = {
          name: selectedRecipe.recipe_name,
          yield: selectedRecipe.yield,
          yield_unit: selectedRecipe.yield_unit,
          instructions: selectedRecipe.instructions,
          ingredients: recipeIngredients.map(ri => ({
            name: ri.ingredients.ingredient_name,
            quantity: ri.quantity,
            unit: ri.unit,
          })),
          aiInstructions: aiInstructions,
          created_at: selectedRecipe.created_at,
          shared_at: new Date().toISOString(),
        };

        const response = await fetch('/api/recipe-share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeData,
            userId: 'user-123',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create share link');
        }

        const result = await response.json();
        setShareUrl(result.shareUrl);
        setShowShareModal(true);
      } catch (err) {
        logger.error('[useRecipeShareOperations.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

        showErrorNotification('Failed to share recipe');
      } finally {
        setShareLoading(false);
      }
    },
    [showErrorNotification],
  );

  return {
    showShareModal,
    setShowShareModal,
    shareUrl,
    shareLoading,
    handleShareRecipe,
  };
}
