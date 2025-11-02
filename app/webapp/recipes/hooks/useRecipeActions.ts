'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNotification } from '@/contexts/NotificationContext';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { useRecipeBulkOperations } from './useRecipeBulkOperations';
import { useRecipeDeleteOperations } from './useRecipeDeleteOperations';
import { useRecipeShareOperations } from './useRecipeShareOperations';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';
import { storeRecipeForEditing } from './utils/recipeEditHelpers';

interface UseRecipeActionsProps {
  recipes: Recipe[];
  fetchRecipes: () => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setError: (error: string) => void;
  capitalizeRecipeName: (name: string) => string;
}

export function useRecipeActions({
  recipes,
  fetchRecipes,
  fetchRecipeIngredients,
  setError,
  capitalizeRecipeName,
}: UseRecipeActionsProps) {
  const router = useRouter();
  const { showError: showErrorNotification } = useNotification();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use extracted hooks
  const bulkOps = useRecipeBulkOperations(recipes, fetchRecipes, capitalizeRecipeName);
  const deleteOps = useRecipeDeleteOperations(fetchRecipes, capitalizeRecipeName);
  const shareOps = useRecipeShareOperations();

  const handleAddRecipe = useCallback(
    async (newRecipe: Partial<Recipe>) => {
      try {
        const { error } = await supabase.from('recipes').insert([newRecipe]);
        if (error) {
          showErrorNotification(error.message);
        } else {
          await fetchRecipes();
          return true;
        }
      } catch (err) {
        showErrorNotification('Failed to add recipe');
      }
      return false;
    },
    [fetchRecipes, showErrorNotification],
  );

  const handleEditFromPreview = useCallback(
    async (selectedRecipe: Recipe, recipeIngredients: RecipeIngredientWithDetails[]) => {
      if (!selectedRecipe || !recipeIngredients.length) {
        showErrorNotification('No recipe data available for editing');
        return;
      }

      try {
        const calculations = convertToCOGSCalculations(recipeIngredients, selectedRecipe.id);
        storeRecipeForEditing(selectedRecipe, calculations);
        router.push('/webapp/cogs');
      } catch (err) {
        console.error('❌ Error in handleEditFromPreview:', err);
        showErrorNotification('Failed to load recipe for editing');
      }
    },
    [router, showErrorNotification],
  );

  return {
    successMessage,
    setSuccessMessage,
    ...deleteOps,
    ...bulkOps,
    ...shareOps,
    handleAddRecipe,
    handleEditFromPreview,
  };
}
