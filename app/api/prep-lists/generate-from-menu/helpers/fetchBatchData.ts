import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
    DBDishIngredient,
    DBDishRecipe,
    DBDishSection,
    DBRecipeIngredient,
    DishSectionData,
} from '../types';

/**
 * Batch fetch recipe ingredients.
 *
 * @param {Set<string>} recipeIds - Set of recipe IDs
 * @returns {Promise<Map<string, DBRecipeIngredient[]>>} Map of recipe ID to ingredients array
 */
export async function fetchRecipeIngredients(recipeIds: Set<string>): Promise<Map<string, DBRecipeIngredient[]>> {
  const recipeIngredientsMap = new Map<string, DBRecipeIngredient[]>();

  if (!supabaseAdmin || recipeIds.size === 0) {
    return recipeIngredientsMap;
  }

  const { data: allRecipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, name)')
    .in('recipe_id', Array.from(recipeIds));

  if (recipeIngredientsError) {
    logger.error('[Prep Lists API] Error fetching recipe ingredients:', {
      error: recipeIngredientsError.message,
      recipeIds: Array.from(recipeIds),
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchBatchData' },
    });
  }

  if (allRecipeIngredients) {
    for (const ri of allRecipeIngredients) {
      // Cast to DBRecipeIngredient as supabase types might assume nulls differently
      const recipeIngredient = ri as unknown as DBRecipeIngredient;
      const recipeId = recipeIngredient.recipe_id;
      if (!recipeIngredientsMap.has(recipeId)) {
        recipeIngredientsMap.set(recipeId, []);
      }
      recipeIngredientsMap.get(recipeId)!.push(recipeIngredient);
    }
  }

  return recipeIngredientsMap;
}

/**
 * Batch fetch dish data (sections, recipes, ingredients).
 *
 * @param {Set<string>} dishIds - Set of dish IDs
 * @param {Set<string>} recipeIds - Set of recipe IDs (will be updated with dish recipes)
 * @param {Map<string, string | null>} recipeInstructionsMap - Map of recipe ID to instructions (will be updated)
 * @returns {Promise<{dishSectionsMap: Map<string, DishSectionData>, dishRecipesMap: Map<string, DBDishRecipe[]>, dishIngredientsMap: Map<string, DBDishIngredient[]>}>} Dish data maps
 */
export async function fetchDishData(
  dishIds: Set<string>,
  recipeIds: Set<string>,
  recipeInstructionsMap: Map<string, string | null>,
) {
  const dishSectionsMap = new Map<string, DishSectionData>();
  const dishRecipesMap = new Map<string, DBDishRecipe[]>();
  const dishIngredientsMap = new Map<string, DBDishIngredient[]>();

  if (!supabaseAdmin || dishIds.size === 0) {
    return { dishSectionsMap, dishRecipesMap, dishIngredientsMap };
  }

  const dishIdsArray = Array.from(dishIds);

  // Batch fetch dish sections
  const { data: allDishSections, error: dishSectionsError } = await supabaseAdmin
    .from('dish_sections')
    .select('dish_id, section_id, kitchen_sections(id, name)')
    .in('dish_id', dishIdsArray);

  if (dishSectionsError) {
    logger.error('[Prep Lists API] Error fetching dish sections:', {
      error: dishSectionsError.message,
      dishIds: dishIdsArray,
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchBatchData' },
    });
  }

  if (allDishSections) {
    for (const ds of allDishSections) {
      const dishSection = ds as unknown as DBDishSection;
      const dishId = dishSection.dish_id;
      const sectionId = dishSection.section_id;
      const section = dishSection.kitchen_sections;
      dishSectionsMap.set(dishId, {
        sectionId,
        sectionName: section?.name || 'Uncategorized',
      });
    }
  }

  // Batch fetch dish recipes
  const { data: allDishRecipes, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select('dish_id, recipe_id, quantity, recipes(id, recipe_name, instructions)')
    .in('dish_id', dishIdsArray);

  if (dishRecipesError) {
    logger.error('[Prep Lists API] Error fetching dish recipes:', {
      error: dishRecipesError.message,
      dishIds: dishIdsArray,
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchBatchData' },
    });
  }

  if (allDishRecipes) {
    for (const dr of allDishRecipes) {
      const dishRecipe = dr as unknown as DBDishRecipe;
      const dishId = dishRecipe.dish_id;
      if (!dishRecipesMap.has(dishId)) {
        dishRecipesMap.set(dishId, []);
      }
      dishRecipesMap.get(dishId)!.push(dishRecipe);
      // Also add recipe ID to recipeIds set for ingredient fetching
      if (dishRecipe.recipes?.id) {
        recipeIds.add(dishRecipe.recipes.id);
        recipeInstructionsMap.set(dishRecipe.recipes.id, dishRecipe.recipes.instructions || null);
      }
    }
  }

  // Batch fetch dish ingredients
  const { data: allDishIngredients, error: dishIngredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select('dish_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, name)')
    .in('dish_id', dishIdsArray);

  if (dishIngredientsError) {
    logger.error('[Prep Lists API] Error fetching dish ingredients:', {
      error: dishIngredientsError.message,
      dishIds: dishIdsArray,
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchBatchData' },
    });
  }

  if (allDishIngredients) {
    for (const di of allDishIngredients) {
      const dishIngredient = di as unknown as DBDishIngredient;
      const dishId = dishIngredient.dish_id;
      if (!dishIngredientsMap.has(dishId)) {
        dishIngredientsMap.set(dishId, []);
      }
      dishIngredientsMap.get(dishId)!.push(dishIngredient);
    }
  }

  return { dishSectionsMap, dishRecipesMap, dishIngredientsMap };
}
