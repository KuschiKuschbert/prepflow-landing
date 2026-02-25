import { markFirstDone } from '@/lib/page-help/first-done-storage';
import type { Recipe } from '@/lib/types/recipes';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import { createRecipeImagesGeneratedHandler } from '../DishesClient/helpers/handleRecipeImagesGenerated';
import type { EditingItemShape } from './useDishesClientController.types';
import { buildControllerResult } from '../DishesClient/buildControllerResult';

export { buildControllerResult };

export function useResetStateOnViewModeChange(
  viewMode: string,
  fetchItems: () => void,
  setEditingRecipe: (val: Recipe | null) => void,
  setEditingItem: (val: EditingItemShape | null) => void,
  setHighlightingRowId: (val: string | null) => void,
  setHighlightingRowType: (val: 'dish' | 'recipe' | null) => void,
) {
  useEffect(() => {
    if (viewMode === 'list') {
      fetchItems();
      setEditingRecipe(null);
      setEditingItem(null);
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }
  }, [
    viewMode,
    fetchItems,
    setEditingRecipe,
    setEditingItem,
    setHighlightingRowId,
    setHighlightingRowType,
  ]);
}

export function useSelectedItemTypes(
  dishes: { id: string }[],
  recipes: { id: string }[],
  selectedItems: Set<string>,
) {
  return useMemo(() => {
    const types = new Map<string, 'recipe' | 'dish'>();
    dishes.forEach(d => {
      if (selectedItems.has(d.id)) types.set(d.id, 'dish');
    });
    recipes.forEach(r => {
      if (selectedItems.has(r.id)) types.set(r.id, 'recipe');
    });
    return types;
  }, [dishes, recipes, selectedItems]);
}

export function useDishesClientControllerEffects(
  dishesLength: number,
  recipesLength: number,
  preselectedRecipeId: string | undefined,
  loading: boolean,
  recipes: Recipe[],
  handlePreviewRecipe: (recipe: Recipe) => void,
) {
  const router = useRouter();
  useEffect(() => {
    if (dishesLength + recipesLength > 0) markFirstDone('dishes');
  }, [dishesLength, recipesLength]);
  useEffect(() => {
    if (!preselectedRecipeId || loading || recipes.length === 0) return;
    const recipe = recipes.find(r => r.id === preselectedRecipeId);
    if (recipe) {
      handlePreviewRecipe(recipe);
      router.replace('/webapp/recipes', { scroll: false });
    }
  }, [preselectedRecipeId, loading, recipes, handlePreviewRecipe, router]);
}

export function useRecipeImagesHandler(
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  selectedRecipeForPreview: Recipe | null,
  setSelectedRecipeForPreview: React.Dispatch<React.SetStateAction<Recipe | null>>,
) {
  return useCallback(
    (
      recipeId: string,
      images: {
        classic: string | null;
        modern: string | null;
        rustic: string | null;
        minimalist: string | null;
      },
    ) => {
      return createRecipeImagesGeneratedHandler(
        setRecipes,
        selectedRecipeForPreview,
        setSelectedRecipeForPreview,
      )(recipeId, images);
    },
    [setRecipes, selectedRecipeForPreview, setSelectedRecipeForPreview],
  );
}
