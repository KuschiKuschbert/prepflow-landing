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
  // Suppliers - check for existing ones first
  const { data: existingSuppliers } = await supabaseAdmin.from('suppliers').select('supplier_name');
  const existingSupplierNames = new Set(
    (existingSuppliers || []).map(s => s.supplier_name?.toLowerCase().trim()).filter(Boolean),
  );

  const suppliersToInsert = cleanSampleSuppliers.filter(
    s => !existingSupplierNames.has(s.supplier_name?.toLowerCase().trim()),
  );

  let suppliersData: any[] | undefined;
  if (suppliersToInsert.length > 0) {
    const { data, error: suppliersError } = await supabaseAdmin
      .from('suppliers')
      .insert(suppliersToInsert)
      .select();

    if (suppliersError) {
      results.errors.push({ table: 'suppliers', error: suppliersError.message });
    } else {
      suppliersData = data || [];
      results.populated.push({ table: 'suppliers', count: suppliersData.length });
      if (suppliersToInsert.length < cleanSampleSuppliers.length) {
        console.log(
          `Skipped ${cleanSampleSuppliers.length - suppliersToInsert.length} duplicate suppliers`,
        );
      }
    }
  } else {
    console.log('All suppliers already exist, skipping insert');
    // Fetch existing suppliers for use in recipe linking
    const { data } = await supabaseAdmin.from('suppliers').select();
    suppliersData = data || [];
  }

  // Ingredients - check for existing ones first
  const { data: existingIngredients } = await supabaseAdmin
    .from('ingredients')
    .select('ingredient_name');
  const existingIngredientNames = new Set(
    (existingIngredients || [])
      .map(i => i.ingredient_name?.toLowerCase().trim())
      .filter(Boolean),
  );

  const ingredientsToInsert = cleanSampleIngredients.filter(
    i => !existingIngredientNames.has(i.ingredient_name?.toLowerCase().trim()),
  );

  let ingredientsData: any[] | undefined;
  if (ingredientsToInsert.length > 0) {
    const { data, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .insert(ingredientsToInsert)
      .select();

    if (ingredientsError) {
      results.errors.push({ table: 'ingredients', error: ingredientsError.message });
    } else {
      ingredientsData = data || [];
      // Fetch all ingredients (new + existing) for recipe linking
      const { data: allIngredients } = await supabaseAdmin.from('ingredients').select();
      ingredientsData = allIngredients || [];
      results.populated.push({ table: 'ingredients', count: ingredientsToInsert.length });
      if (ingredientsToInsert.length < cleanSampleIngredients.length) {
        console.log(
          `Skipped ${cleanSampleIngredients.length - ingredientsToInsert.length} duplicate ingredients`,
        );
      }
    }
  } else {
    console.log('All ingredients already exist, skipping insert');
    // Fetch existing ingredients for use in recipe linking
    const { data } = await supabaseAdmin.from('ingredients').select();
    ingredientsData = data || [];
  }

  // Recipes - check for existing ones first
  const { data: existingRecipes } = await supabaseAdmin.from('recipes').select('name');
  const existingRecipeNames = new Set(
    (existingRecipes || []).map(r => r.name?.toLowerCase().trim()).filter(Boolean),
  );

  const recipesToInsert = cleanSampleRecipes.filter(
    r => !existingRecipeNames.has(r.name?.toLowerCase().trim()),
  );

  let recipesData: any[] | undefined;
  if (recipesToInsert.length > 0) {
    const { data, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .insert(recipesToInsert)
      .select();

    if (recipesError) {
      results.errors.push({ table: 'recipes', error: recipesError.message });
    } else {
      recipesData = data || [];
      // Fetch all recipes (new + existing) for recipe ingredient linking
      const { data: allRecipes } = await supabaseAdmin.from('recipes').select();
      recipesData = allRecipes || [];
      results.populated.push({ table: 'recipes', count: recipesToInsert.length });
      if (recipesToInsert.length < cleanSampleRecipes.length) {
        console.log(
          `Skipped ${cleanSampleRecipes.length - recipesToInsert.length} duplicate recipes`,
        );
      }
    }
  } else {
    console.log('All recipes already exist, skipping insert');
    // Fetch existing recipes for use in recipe ingredient linking
    const { data } = await supabaseAdmin.from('recipes').select();
    recipesData = data || [];
  }

  // Recipe Ingredients
  if (recipesData && ingredientsData) {
      // Create case-insensitive maps for matching
      const recipeMap = new Map<string, string>();
      recipesData.forEach(r => {
        recipeMap.set(r.name.toLowerCase().trim(), r.id);
        recipeMap.set(r.name, r.id); // Also include exact match
      });

      const ingredientMap = new Map<string, string>();
      ingredientsData.forEach(i => {
        const nameKey = i.ingredient_name?.toLowerCase().trim() || '';
        ingredientMap.set(nameKey, i.id);
        ingredientMap.set(i.ingredient_name || '', i.id); // Also include exact match
      });

      const recipeIngredientsToInsert: Array<{
        recipe_id: string;
        ingredient_id: string;
        quantity: number;
        unit: string;
      }> = [];
      const skippedIngredients: string[] = [];

      for (const [recipeName, mappings] of Object.entries(recipeIngredientMappings)) {
        // Try exact match first, then case-insensitive
        const recipeId =
          recipeMap.get(recipeName) || recipeMap.get(recipeName.toLowerCase().trim());
        if (!recipeId) {
          console.warn(`Recipe "${recipeName}" not found in recipes data`);
          continue;
        }

        for (const mapping of mappings) {
          // Try exact match first, then case-insensitive
          const ingredientNameKey = mapping.ingredient_name?.toLowerCase().trim() || '';
          const ingredientId =
            ingredientMap.get(mapping.ingredient_name) ||
            ingredientMap.get(ingredientNameKey);

          if (!ingredientId) {
            skippedIngredients.push(mapping.ingredient_name);
            console.warn(
              `Ingredient "${mapping.ingredient_name}" not found when linking to recipe "${recipeName}"`,
            );
            continue;
          }

          recipeIngredientsToInsert.push({
            recipe_id: recipeId,
            ingredient_id: ingredientId,
            quantity: mapping.quantity,
            unit: mapping.unit,
          });
        }
      }

      if (skippedIngredients.length > 0) {
        console.warn(
          `Skipped ${skippedIngredients.length} ingredient(s) that could not be matched:`,
          [...new Set(skippedIngredients)],
        );
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

  return {
    suppliersData: suppliersData || undefined,
    ingredientsData: ingredientsData || undefined,
    recipesData: recipesData || undefined,
  };
}
