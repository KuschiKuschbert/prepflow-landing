/**
 * Handle duplicating a recipe with optimistic updates.
 */
import { supabase } from '@/lib/supabase';
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';

interface HandleDuplicateRecipeParams {
  recipe: Recipe;
  recipes: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  showErrorNotification: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function handleDuplicateRecipe({
  recipe,
  recipes,
  fetchRecipeIngredients,
  optimisticallyUpdateRecipes,
  showErrorNotification,
  showSuccess,
}: HandleDuplicateRecipeParams): Promise<Recipe | null> {
  // Store original state for rollback
  const originalRecipes = [...recipes];

  const duplicateName = `Copy of ${recipe.recipe_name}`;

  // Create temporary recipe with temporary ID for optimistic update
  const tempId = `temp-${Date.now()}`;
  const tempRecipe: Recipe = {
    ...recipe,
    id: tempId,
    recipe_name: duplicateName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Optimistically add duplicated recipe to list immediately
  optimisticallyUpdateRecipes(prev => [...prev, tempRecipe]);

  try {
    // Fetch ingredients first
    const ingredients = await fetchRecipeIngredients(recipe.id);

    // Create the duplicate recipe
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
      // Revert optimistic update on error - restore original state
      optimisticallyUpdateRecipes(() => originalRecipes);
      showErrorNotification(`Failed to duplicate recipe: ${recipeError.message}`);
      return null;
    }

    if (!newRecipe) {
      // Revert optimistic update - restore original state
      optimisticallyUpdateRecipes(() => originalRecipes);
      showErrorNotification('Failed to duplicate recipe: No recipe returned');
      return null;
    }

    // Duplicate ingredients if they exist
    if (ingredients.length > 0) {
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
        // Revert optimistic update on error - restore original state
        optimisticallyUpdateRecipes(() => originalRecipes);
        showErrorNotification(`Failed to duplicate ingredients: ${ingredientsError.message}`);
        return null;
      }
    }

    // Replace temp recipe with real recipe from server
    optimisticallyUpdateRecipes(prev => prev.map(r => (r.id === tempId ? newRecipe : r)));
    showSuccess(`Recipe "${duplicateName}" duplicated successfully`);
    return newRecipe;
  } catch (err) {
    logger.error('[handleDuplicateRecipe] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    // Revert optimistic update on error - restore original state
    optimisticallyUpdateRecipes(() => originalRecipes);
    const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate recipe';
    showErrorNotification(errorMessage);
    return null;
  }
}
