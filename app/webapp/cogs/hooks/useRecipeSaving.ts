'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDishName } from '@/lib/text-utils';
import { COGSCalculation } from '../types';

export const useRecipeSaving = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveAsRecipe = useCallback(
    async (calculations: COGSCalculation[], dishName: string, dishPortions: number) => {
      if (calculations.length === 0) {
        setError('No calculations to save. Please calculate COGS first.');
        return;
      }

      const rawRecipeName = dishName || prompt('Enter a name for this recipe:');
      if (!rawRecipeName) return;

      const recipeName = formatDishName(rawRecipeName);

      try {
        setLoading(true);
        setError(null);

        // Check if recipe already exists (case-insensitive)
        const { data: existingRecipes, error: checkError } = await supabase
          .from('recipes')
          .select('id, name')
          .ilike('name', recipeName);

        console.log('Recipe check results:', { existingRecipes, checkError, recipeName });

        let recipeData;
        const existingRecipe =
          existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

        console.log('Existing recipe found:', existingRecipe);

        if (existingRecipe && !checkError) {
          // Recipe exists - update it
          const recipePortions = dishPortions || 1;

          const { data: updatedRecipe, error: updateError } = await supabase
            .from('recipes')
            .update({
              yield: recipePortions,
              yield_unit: 'servings',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingRecipe.id)
            .select()
            .single();

          if (updateError) {
            setError(updateError.message);
            return;
          }

          recipeData = updatedRecipe;
        } else {
          // Recipe doesn't exist - create new one
          const recipePortions = dishPortions || 1;

          const { data: newRecipe, error: createError } = await supabase
            .from('recipes')
            .insert({
              name: recipeName,
              yield: recipePortions,
              yield_unit: 'servings',
            })
            .select()
            .single();

          if (createError) {
            setError(createError.message);
            return;
          }

          recipeData = newRecipe;
        }

        // Handle recipe ingredients
        // Validate calculations have required fields
        const validCalculations = calculations.filter(calc => {
          if (!calc.ingredientId) {
            console.warn('Calculation missing ingredientId:', calc);
            return false;
          }
          if (!calc.quantity || calc.quantity <= 0) {
            console.warn('Calculation has invalid quantity:', calc);
            return false;
          }
          if (!calc.unit) {
            console.warn('Calculation missing unit:', calc);
            return false;
          }
          return true;
        });

        if (validCalculations.length === 0) {
          setError('No valid ingredients to save. Please ensure all ingredients have valid IDs and quantities.');
          return;
        }

        const recipeIngredientInserts = validCalculations.map(calc => ({
          recipe_id: recipeData.id,
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity,
          unit: calc.unit,
        }));

        console.log('Inserting recipe ingredients:', recipeIngredientInserts);

        if (existingRecipe && !checkError) {
          // Recipe exists - replace all ingredients (delete old ones first, then insert new ones)

          // First, delete all existing ingredients for this recipe
          const { error: deleteError } = await supabase
            .from('recipe_ingredients')
            .delete()
            .eq('recipe_id', existingRecipe.id);

          if (deleteError) {
            console.error('Error deleting old recipe ingredients:', deleteError);
            setError(`Failed to update recipe ingredients: ${deleteError.message}`);
            return;
          }

          console.log('Deleted old recipe ingredients, now inserting new ones');

          // Then insert the current ingredients (complete updated recipe)
          const { data: insertedIngredients, error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(recipeIngredientInserts)
            .select();

          if (ingredientsError) {
            console.error('Error inserting recipe ingredients:', ingredientsError);
            setError(`Failed to save recipe ingredients: ${ingredientsError.message}`);
            return;
          }

          console.log('Recipe ingredients inserted successfully:', insertedIngredients);
        } else {
          // New recipe - insert all ingredients
          const { data: insertedIngredients, error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(recipeIngredientInserts)
            .select();

          if (ingredientsError) {
            console.error('Error inserting recipe ingredients:', ingredientsError);
            setError(`Failed to save recipe ingredients: ${ingredientsError.message}`);
            return;
          }

          console.log('Recipe ingredients inserted successfully:', insertedIngredients);
        }

        // Clear any existing error and show success message
        setError(null);
        const actionText = existingRecipe && !checkError ? 'updated' : 'saved';
        setSuccessMessage(`Recipe "${recipeName}" ${actionText} successfully to Recipe Book!`);

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err: any) {
        console.error('Recipe save error:', err);
        const errorMessage =
          err?.message || (err?.code ? `Database error (${err.code})` : 'Failed to save recipe');
        setError(`Failed to save recipe: ${errorMessage}`);
        setSuccessMessage(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    loading,
    error,
    successMessage,
    saveAsRecipe,
    clearMessages,
    setError,
    setSuccessMessage,
  };
};
