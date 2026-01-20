import { extractAllergenSources } from '@/lib/allergens/allergen-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface DishIngredient {
  ingredients?: {
    id?: string;
    ingredient_name?: string;
    allergens?: string[];
  };
}

interface DishRecipe {
  recipe_id: string;
  recipes?: { id: string }[];
}

export async function getDishIngredientSources(dishId: string): Promise<Record<string, string[]>> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Export] Supabase admin client not initialized');
    throw ApiErrorHandler.createError(
      'Database connection not available',
      'DATABASE_ERROR',
      500,
    );
  }

  const { data: dishIngredients, error } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      ingredients (
        id,
        ingredient_name,
        allergens
      )
    `,
    )
    .eq('dish_id', dishId);

  if (error || !dishIngredients) {
    return {};
  }

  const dishIngredientList = (dishIngredients as DishIngredient[]).map(di => ({
    ingredient_name: di.ingredients?.ingredient_name || '',
    allergens: di.ingredients?.allergens,
  }));

  return extractAllergenSources(dishIngredientList);
}

import { mergeAllergenSources } from '@/lib/allergens/allergen-aggregation';

export async function getDishRecipeSources(
  dishId: string,
  recipeIngredientSources: Record<string, Record<string, string[]>>,
): Promise<Record<string, string[]>> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Export] Supabase admin client not initialized');
    throw ApiErrorHandler.createError(
      'Database connection not available',
      'DATABASE_ERROR',
      500,
    );
  }

  const { data: dishRecipes, error } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      recipe_id,
      recipes (
        id
      )
    `,
    )
    .eq('dish_id', dishId);

  if (error || !dishRecipes) {
    return {};
  }

  const sources: Record<string, string[]>[] = [];
  (dishRecipes as DishRecipe[]).forEach(dr => {
    const recipeId = dr.recipe_id;
    if (recipeId && recipeIngredientSources[recipeId]) {
      sources.push(recipeIngredientSources[recipeId]);
    }
  });

  if (sources.length > 0) {
    return mergeAllergenSources({}, ...sources);
  }

  return {};
}

interface RecipeIngredientRow {
  recipe_id: string;
  ingredients?: {
    id?: string;
    ingredient_name?: string;
    allergens?: string[];
  };
}

export async function getRecipeIngredientSources(
  recipeIds: string[],
): Promise<Record<string, Record<string, string[]>>> {
    if (!supabaseAdmin) {
    logger.error('[Allergen Export] Supabase admin client not initialized');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { data: recipeIngredients, error } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      `
      recipe_id,
      ingredients (
        id,
        ingredient_name,
        allergens
      )
    `,
    )
    .in('recipe_id', recipeIds);

  if (!error && recipeIngredients) {
    const ingredientsByRecipe: Record<
      string,
      Array<{ ingredient_name: string; allergens?: string[] }>
    > = {};
    (recipeIngredients as RecipeIngredientRow[]).forEach(ri => {
      const recipeId = ri.recipe_id;
      const ingredient = ri.ingredients;
      if (recipeId && ingredient) {
        if (!ingredientsByRecipe[recipeId]) {
          ingredientsByRecipe[recipeId] = [];
        }
        ingredientsByRecipe[recipeId].push({
          ingredient_name: ingredient.ingredient_name || '',
          allergens: ingredient.allergens,
        });
      }
    });

    const sources: Record<string, Record<string, string[]>> = {};
    Object.entries(ingredientsByRecipe).forEach(([recipeId, ingredients]) => {
      sources[recipeId] = extractAllergenSources(ingredients);
    });
    return sources;
  }
  return {};
}
