/**
 * Handle adding a new recipe with optimistic updates.
 */
import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';

interface HandleAddRecipeParams {
  newRecipe: Partial<Recipe>;
  recipes: Recipe[];
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  onRecipeCreated: () => void;
  showErrorNotification: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function handleAddRecipe({
  newRecipe,
  recipes,
  optimisticallyUpdateRecipes,
  onRecipeCreated,
  showErrorNotification,
  showSuccess,
}: HandleAddRecipeParams): Promise<boolean> {
  // Store original state for rollback
  const originalRecipes = [...recipes];

  // Create temporary recipe with temporary ID for optimistic update
  const tempId = `temp-${Date.now()}`;
  const tempRecipe: Recipe = {
    ...newRecipe,
    id: tempId,
    recipe_name: newRecipe.recipe_name || 'New Recipe',
    yield: newRecipe.yield || 1,
    yield_unit: newRecipe.yield_unit || 'servings',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Recipe;

  // Optimistically add recipe to list immediately
  optimisticallyUpdateRecipes(prev => [...prev, tempRecipe]);

  try {
    const { data: insertedRecipe, error } = await supabase
      .from('recipes')
      .insert([newRecipe])
      .select()
      .single();

    if (error) {
      // Revert optimistic update on error - restore original state
      optimisticallyUpdateRecipes(() => originalRecipes);
      showErrorNotification(error.message);
      return false;
    }

    if (insertedRecipe) {
      // Replace temp recipe with real recipe from server
      optimisticallyUpdateRecipes(prev =>
        prev.map(recipe => (recipe.id === tempId ? insertedRecipe : recipe)),
      );
      showSuccess(`Recipe "${insertedRecipe.recipe_name}" created successfully!`);
      onRecipeCreated();
      return true;
    }

    // Fallback: rollback if no recipe returned - restore original state
    optimisticallyUpdateRecipes(() => originalRecipes);
    showErrorNotification('Recipe created but failed to retrieve from server');
    return false;
  } catch (err) {
    logger.error('[handleAddRecipe] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    // Revert optimistic update on error - restore original state
    optimisticallyUpdateRecipes(() => originalRecipes);
    const errorMessage = err instanceof Error ? err.message : 'Failed to create recipe';
    showErrorNotification(errorMessage);
    return false;
  }
}
