import { supabaseAdmin } from '@/lib/supabase';

interface IngredientIdRow {
  ingredient_id: string;
}

interface RecipeIdRow {
  recipe_id: string;
}

/**
 * Fetch all direct ingredient IDs linked to the given dish IDs.
 *
 * @param {string[]} dishIds - Dish IDs to query
 * @returns {Promise<IngredientIdRow[]>} Array of `{ ingredient_id }` rows
 * @throws If the Supabase query returns an error
 */
export async function fetchDishIngredients(dishIds: string[]) {
  if (!supabaseAdmin || dishIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from('dish_ingredients')
    .select('ingredient_id')
    .in('dish_id', dishIds);

  if (error) {
    throw new Error(`Error fetching dish ingredients: ${error.message}`);
  }
  return (data as IngredientIdRow[]) || [];
}

/**
 * Fetch all recipe IDs linked to the given dish IDs.
 *
 * @param {string[]} dishIds - Dish IDs to query
 * @returns {Promise<RecipeIdRow[]>} Array of `{ recipe_id }` rows
 * @throws If the Supabase query returns an error
 */
export async function fetchDishRecipes(dishIds: string[]) {
  if (!supabaseAdmin || dishIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id')
    .in('dish_id', dishIds);

  if (error) {
    throw new Error(`Error fetching dish recipes: ${error.message}`);
  }
  return (data as RecipeIdRow[]) || [];
}

/**
 * Fetch all ingredient IDs linked to the given recipe IDs.
 *
 * @param {string[]} recipeIds - Recipe IDs to query
 * @returns {Promise<IngredientIdRow[]>} Array of `{ ingredient_id }` rows
 * @throws If the Supabase query returns an error
 */
export async function fetchRecipeIngredients(recipeIds: string[]) {
  if (!supabaseAdmin || recipeIds.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('ingredient_id')
    .in('recipe_id', recipeIds);

  if (error) {
    throw new Error(`Error fetching recipe ingredients: ${error.message}`);
  }
  return (data as IngredientIdRow[]) || [];
}
