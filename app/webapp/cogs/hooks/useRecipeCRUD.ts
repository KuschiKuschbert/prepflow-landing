// PrepFlow - Recipe CRUD Operations Hook
// Extracted from useRecipeSaving.ts to meet file size limits

'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDishName } from '@/lib/text-utils';

interface UseRecipeCRUDProps {
  setError: (error: string) => void;
}

export function useRecipeCRUD({ setError }: UseRecipeCRUDProps) {
  const createOrUpdateRecipe = useCallback(
    async (recipeName: string, dishPortions: number) => {
      const formattedName = formatDishName(recipeName);
      const { data: existingRecipes, error: checkError } = await supabase
        .from('recipes')
        .select('id, name')
        .ilike('name', formattedName);

      const existingRecipe =
        existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

      if (existingRecipe && !checkError) {
        const { data: updatedRecipe, error: updateError } = await supabase
          .from('recipes')
          .update({
            yield: dishPortions || 1,
            yield_unit: 'servings',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRecipe.id)
          .select()
          .single();

        if (updateError) {
          setError(updateError.message);
          return null;
        }
        return { recipe: updatedRecipe, isNew: false };
      } else {
        const { data: newRecipe, error: createError } = await supabase
          .from('recipes')
          .insert({
            name: formattedName,
            yield: dishPortions || 1,
            yield_unit: 'servings',
          })
          .select()
          .single();

        if (createError) {
          setError(createError.message);
          return null;
        }
        return { recipe: newRecipe, isNew: true };
      }
    },
    [setError],
  );

  const saveRecipeIngredients = useCallback(
    async (recipeId: string, recipeIngredientInserts: any[], isUpdate: boolean) => {
      if (isUpdate) {
        const { error: deleteError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', recipeId);

        if (deleteError) {
          return { error: `Failed to update recipe ingredients: ${deleteError.message}` };
        }
      }

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredientInserts)
        .select();

      if (ingredientsError) {
        return { error: `Failed to save recipe ingredients: ${ingredientsError.message}` };
      }

      return { success: true };
    },
    [],
  );

  return {
    createOrUpdateRecipe,
    saveRecipeIngredients,
  };
}
