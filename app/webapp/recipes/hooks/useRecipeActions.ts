'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { COGSCalculation, Recipe, RecipeIngredientWithDetails } from '../types';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  const handleAddRecipe = useCallback(
    async (newRecipe: Partial<Recipe>) => {
      try {
        const { error } = await supabase.from('recipes').insert([newRecipe]);
        if (error) {
          setError(error.message);
        } else {
          await fetchRecipes();
          return true;
        }
      } catch (err) {
        setError('Failed to add recipe');
      }
      return false;
    },
    [fetchRecipes, setError],
  );

  const handleEditFromPreview = useCallback(
    async (selectedRecipe: Recipe, recipeIngredients: RecipeIngredientWithDetails[]) => {
      if (!selectedRecipe || !recipeIngredients.length) {
        setError('No recipe data available for editing');
        return;
      }

      try {
        const calculations: COGSCalculation[] = recipeIngredients.map(ri => {
          const ingredient = ri.ingredients;
          const quantity = ri.quantity;
          const costPerUnit = ingredient.cost_per_unit;
          const totalCost = quantity * costPerUnit;
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;
          const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
          const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

          return {
            id: ri.id,
            ingredient_id: ingredient.id,
            ingredientId: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            ingredientName: ingredient.ingredient_name,
            quantity: quantity,
            unit: ri.unit,
            cost_per_unit: costPerUnit,
            total_cost: totalCost,
            yieldAdjustedCost: yieldAdjustedCost,
            supplier_name: ingredient.supplier_name,
            category: ingredient.category,
          };
        });

        sessionStorage.setItem(
          'editingRecipe',
          JSON.stringify({
            recipe: selectedRecipe,
            recipeId: selectedRecipe.id,
            calculations,
            dishName: selectedRecipe.name,
            dishPortions: selectedRecipe.yield,
            dishNameLocked: true,
          }),
        );

        router.push('/webapp/cogs');
      } catch (err) {
        console.error('❌ Error in handleEditFromPreview:', err);
        setError('Failed to load recipe for editing');
      }
    },
    [router, setError],
  );

  const handleDeleteRecipe = useCallback((recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteRecipe = useCallback(async () => {
    if (!recipeToDelete) return;

    try {
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeToDelete.id);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete.id);

      if (recipeError) {
        setError(recipeError.message);
        return;
      }

      await fetchRecipes();
      const message = `Recipe "${capitalizeRecipeName(recipeToDelete.name)}" deleted successfully!`;
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    } catch (err) {
      setError('Failed to delete recipe');
    }
  }, [recipeToDelete, fetchRecipes, capitalizeRecipeName, setError]);

  const cancelDeleteRecipe = useCallback(() => {
    setShowDeleteConfirm(false);
    setRecipeToDelete(null);
  }, []);

  const handleSelectRecipe = useCallback((recipeId: string) => {
    setSelectedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRecipes.size === recipes.length) {
      setSelectedRecipes(new Set());
    } else {
      setSelectedRecipes(new Set(recipes.map(r => r.id)));
    }
  }, [selectedRecipes.size, recipes]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRecipes.size === 0) return;
    setShowBulkDeleteConfirm(true);
  }, [selectedRecipes.size]);

  const confirmBulkDelete = useCallback(async () => {
    if (selectedRecipes.size === 0) return;

    try {
      const selectedRecipeIds = Array.from(selectedRecipes);

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .in('recipe_id', selectedRecipeIds);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .in('id', selectedRecipeIds);

      if (recipesError) {
        setError(recipesError.message);
        return;
      }

      await fetchRecipes();
      setSuccessMessage(
        `${selectedRecipes.size} recipe${selectedRecipes.size > 1 ? 's' : ''} deleted successfully!`,
      );
      setTimeout(() => setSuccessMessage(null), 3000);
      setSelectedRecipes(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete recipes');
    }
  }, [selectedRecipes, fetchRecipes, setError]);

  const cancelBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(false);
  }, []);

  const handleShareRecipe = useCallback(
    async (
      selectedRecipe: Recipe,
      recipeIngredients: RecipeIngredientWithDetails[],
      aiInstructions: string,
    ) => {
      if (!selectedRecipe || !recipeIngredients.length) {
        setError('No recipe data available for sharing');
        return;
      }

      setShareLoading(true);
      try {
        const recipeData = {
          name: selectedRecipe.name,
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
        setError('Failed to share recipe');
      } finally {
        setShareLoading(false);
      }
    },
    [setError],
  );

  return {
    successMessage,
    setSuccessMessage,
    recipeToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    selectedRecipes,
    setSelectedRecipes,
    showShareModal,
    setShowShareModal,
    shareUrl,
    shareLoading,
    handleAddRecipe,
    handleEditFromPreview,
    handleDeleteRecipe,
    confirmDeleteRecipe,
    cancelDeleteRecipe,
    handleSelectRecipe,
    handleSelectAll,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    handleShareRecipe,
  };
}
