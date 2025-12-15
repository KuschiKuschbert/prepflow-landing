/**
 * Handle duplicating a recipe.
 */
import { supabase } from '@/lib/supabase';
import type { Recipe, RecipeIngredientWithDetails } from '../../types';

export async function handleDuplicateRecipe(
  recipe: Recipe,
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  fetchRecipes: () => Promise<void>,
  showErrorNotification: (message: string) => void,
  showSuccess: (message: string) => void,
): Promise<Recipe | null> {
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
    return null;
  }
  if (ingredients.length > 0 && newRecipe) {
    const ingredientInserts = ingredients.map(ing => ({
      recipe_id: newRecipe.id,
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
    }));
    const { error: ingredientsError } = await supabase.from('recipe_ingredients').insert(ingredientInserts);
    if (ingredientsError) {
      showErrorNotification(`Failed to duplicate ingredients: ${ingredientsError.message}`);
      await fetchRecipes();
      return null;
    }
  }
  await fetchRecipes();
  showSuccess(`Recipe "${duplicateName}" duplicated successfully`);
  return newRecipe;
}
