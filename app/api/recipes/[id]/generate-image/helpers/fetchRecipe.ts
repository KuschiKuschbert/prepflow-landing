/**
 * Fetch recipe and ingredients for image generation
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export interface RecipeData {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  image_url: string | null;
  image_url_alternative: string | null;
  image_url_modern: string | null;
  image_url_minimalist: string | null;
  plating_methods_images: Record<string, string> | null;
}

export interface RecipeWithIngredients {
  recipe: RecipeData;
  ingredientNames: string[];
}

export async function fetchRecipeWithIngredients(
  recipeId: string,
): Promise<NextResponse | RecipeWithIngredients> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: recipe, error: recipeError } = await supabaseAdmin
    .from('recipes')
    .select(
      'id, name, description, instructions, image_url, image_url_alternative, image_url_modern, image_url_minimalist, plating_methods_images',
    )
    .eq('id', recipeId)
    .single();

  if (recipeError || !recipe) {
    logger.error('[Recipe Image Generation] Failed to fetch recipe:', {
      error: recipeError?.message,
      recipeId,
    });
    return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select(
      `
      quantity,
      unit,
      ingredients (
        ingredient_name
      )
    `,
    )
    .eq('recipe_id', recipeId);

  if (ingredientsError) {
    logger.error('[Recipe Image Generation] Failed to fetch ingredients:', {
      error: ingredientsError.message,
      recipeId,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch recipe ingredients', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const ingredientNames: string[] = [];
  if (recipeIngredients && Array.isArray(recipeIngredients)) {
    recipeIngredients.forEach(ri => {
      const ingredient = ri.ingredients;
      if (ingredient && typeof ingredient === 'object' && 'ingredient_name' in ingredient) {
        const name = (ingredient as { ingredient_name: string }).ingredient_name;
        if (name && !ingredientNames.includes(name)) {
          ingredientNames.push(name);
        }
      }
    });
  }

  if (ingredientNames.length === 0) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Recipe has no ingredients. Add ingredients before generating images.',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  return {
    recipe: recipe as RecipeData,
    ingredientNames,
  };
}
