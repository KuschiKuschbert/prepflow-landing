'use client';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { useRecipeBulkOperations } from './useRecipeBulkOperations';
import { useRecipeDeleteOperations } from './useRecipeDeleteOperations';
import { useRecipeShareOperations } from './useRecipeShareOperations';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';
import { storeRecipeForEditing } from './utils/recipeEditHelpers';
import { logger } from '@/lib/logger';
interface UseRecipeActionsProps {
  recipes: Recipe[];
  fetchRecipes: () => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setError: (error: string) => void;
  capitalizeRecipeName: (name: string) => string;
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  rollbackRecipes: () => void;
}
export function useRecipeActions({
  recipes,
  fetchRecipes,
  fetchRecipeIngredients,
  setError,
  capitalizeRecipeName,
  optimisticallyUpdateRecipes,
  rollbackRecipes,
}: UseRecipeActionsProps) {
  const router = useRouter();
  const { showError: showErrorNotification, showSuccess } = useNotification();
  const bulkOps = useRecipeBulkOperations(
    recipes,
    fetchRecipes,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  );
  const deleteOps = useRecipeDeleteOperations(
    fetchRecipes,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  );
  const shareOps = useRecipeShareOperations();
  const handleAddRecipe = useCallback(
    async (newRecipe: Partial<Recipe>) => {
      try {
        const { error } = await supabase.from('recipes').insert([newRecipe]);
        if (error) showErrorNotification(error.message);
        else {
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
        logger.error('❌ Error in handleEditFromPreview:', err);
        showErrorNotification('Failed to load recipe for editing');
      }
    },
    [router, showErrorNotification],
  );
  const handleDuplicateRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        const duplicateName = `Copy of ${recipe.recipe_name}`;
        const { data: newRecipe, error: recipeError } = await supabase
          .from('recipes')
          .insert([
            {
              recipe_name: duplicateName,
              yield: recipe.yield,
              yield_unit: recipe.yield_unit,
              description: recipe.description,
              instructions: recipe.instructions,
              category: recipe.category,
            },
          ])
          .select()
          .single();
        if (recipeError) {
          showErrorNotification(`Failed to duplicate recipe: ${recipeError.message}`);
          return;
        }
        if (ingredients.length > 0 && newRecipe) {
          const ingredientInserts = ingredients.map(ing => ({
            recipe_id: newRecipe.id,
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
          }));
          const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientInserts);
          if (ingredientsError) {
            showErrorNotification(`Failed to duplicate ingredients: ${ingredientsError.message}`);
            await fetchRecipes();
            return;
          }
        }
        await fetchRecipes();
        showSuccess(`Recipe "${duplicateName}" duplicated successfully`);
        return newRecipe;
      } catch (err) {
        logger.error('Error duplicating recipe:', err);
        showErrorNotification('Failed to duplicate recipe');
        return null;
      }
    },
    [fetchRecipes, fetchRecipeIngredients, showErrorNotification, showSuccess],
  );
  return {
    ...deleteOps,
    ...bulkOps,
    ...shareOps,
    handleAddRecipe,
    handleEditFromPreview,
    handleDuplicateRecipe,
  };
}
