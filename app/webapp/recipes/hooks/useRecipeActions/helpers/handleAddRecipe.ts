/**
 * Handle adding a new recipe.
 */
import { supabase } from '@/lib/supabase';
import type { Recipe } from '../../types';

export async function handleAddRecipe(
  newRecipe: Partial<Recipe>,
  fetchRecipes: () => Promise<void>,
  onRecipeCreated: () => void,
  showErrorNotification: (message: string) => void,
): Promise<boolean> {
  const { error } = await supabase.from('recipes').insert([newRecipe]);
  if (error) {
    showErrorNotification(error.message);
    return false;
  }
  await fetchRecipes();
  onRecipeCreated();
  return true;
}
