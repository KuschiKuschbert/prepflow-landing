/**
 * Helper functions for populating basic data (suppliers, ingredients, recipes)
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { cleanSampleSuppliers } from '@/lib/sample-suppliers-clean';
import { cleanSampleIngredients } from '@/lib/sample-ingredients-clean';
import { cleanSampleRecipes, recipeIngredientMappings } from '@/lib/sample-recipes-clean';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate basic data (suppliers, ingredients, recipes)
 */
export async function populateBasicData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
): Promise<{ suppliersData?: any[]; ingredientsData?: any[]; recipesData?: any[] }> {
  // Suppliers
  const { data: suppliersData, error: suppliersError } = await supabaseAdmin
    .from('suppliers')
    .insert(cleanSampleSuppliers)
    .select();

  if (suppliersError) {
    results.errors.push({ table: 'suppliers', error: suppliersError.message });
  } else {
    results.populated.push({ table: 'suppliers', count: suppliersData?.length || 0 });
  }

  // Ingredients
  const { data: ingredientsData, error: ingredientsError } = await supabaseAdmin
    .from('ingredients')
    .insert(cleanSampleIngredients)
    .select();

  if (ingredientsError) {
    results.errors.push({ table: 'ingredients', error: ingredientsError.message });
  } else {
    results.populated.push({ table: 'ingredients', count: ingredientsData?.length || 0 });
  }

  // Recipes
  const { data: recipesData, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .insert(cleanSampleRecipes)
    .select();

  if (recipesError) {
    results.errors.push({ table: 'recipes', error: recipesError.message });
  } else {
    results.populated.push({ table: 'recipes', count: recipesData?.length || 0 });

    // Recipe Ingredients
    if (recipesData && ingredientsData) {
      const recipeMap = new Map(recipesData.map(r => [r.name, r.id]));
      const ingredientMap = new Map(ingredientsData.map(i => [i.ingredient_name, i.id]));

      const recipeIngredientsToInsert: Array<{
        recipe_id: string;
        ingredient_id: string;
        quantity: number;
        unit: string;
      }> = [];

      for (const [recipeName, mappings] of Object.entries(recipeIngredientMappings)) {
        const recipeId = recipeMap.get(recipeName);
        if (!recipeId) continue;

        for (const mapping of mappings) {
          const ingredientId = ingredientMap.get(mapping.ingredient_name);
          if (!ingredientId) continue;

          recipeIngredientsToInsert.push({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
            quantity: mapping.quantity,
            unit: mapping.unit,
          });
        }
      }

      if (recipeIngredientsToInsert.length > 0) {
        const { error: riError } = await supabaseAdmin
          .from('recipe_ingredients')
          .insert(recipeIngredientsToInsert);

        if (riError) {
          results.errors.push({ table: 'recipe_ingredients', error: riError.message });
        } else {
          results.populated.push({
            table: 'recipe_ingredients',
            count: recipeIngredientsToInsert.length,
          });
        }
      }
    }
  }

  return {
    suppliersData: suppliersData || undefined,
    ingredientsData: ingredientsData || undefined,
    recipesData: recipesData || undefined,
  };
}
