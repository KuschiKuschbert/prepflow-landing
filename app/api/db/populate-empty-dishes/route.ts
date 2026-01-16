import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { dishHasDirectIngredients } from '@/lib/populate-helpers/populate-empty-dishes-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from './helpers/auth-helpers';
import { populateDishes } from './helpers/populateDishes';
import { populateRecipes } from './helpers/populateRecipes';
import type { PopulateRecipesResult } from './types';

/** GET: Diagnostic endpoint - returns dishes with no ingredients. POST: Populates empty dishes with default ingredients */
export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { data: dishes, error: dishesError } = await supabaseAdmin!
      .from('dishes')
      .select('id, dish_name')
      .order('dish_name');

    if (dishesError) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        empty_dishes: [],
        summary: {
          total_dishes: 0,
          empty_dishes_count: 0,
        },
      });
    }

    const emptyDishes: Array<{ id: string; dish_name: string }> = [];
    const dishesWithIngredients: Array<{ id: string; dish_name: string }> = [];

    for (const dish of dishes) {
      const hasDirectIngredients = await dishHasDirectIngredients(dish.id);
      if (hasDirectIngredients) {
        dishesWithIngredients.push(dish);
      } else {
        emptyDishes.push(dish);
      }
    }

    return NextResponse.json({
      success: true,
      empty_dishes: emptyDishes,
      dishes_with_ingredients: dishesWithIngredients,
      summary: {
        total_dishes: dishes.length,
        empty_dishes_count: emptyDishes.length,
        dishes_with_ingredients_count: dishesWithIngredients.length,
      },
    });
  } catch (err) {
    logger.error('[Populate Empty Dishes] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { data: dishes, error: dishesError } = await supabaseAdmin!
      .from('dishes')
      .select('id, dish_name')
      .order('dish_name');

    if (dishesError) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        populated: [],
        skipped: [],
        errors: [],
        summary: {
          total_dishes: 0,
          populated_count: 0,
          skipped_count: 0,
          error_count: 0,
        },
      });
    }

    const { data: ingredients, error: ingredientsError } = await supabaseAdmin!
      .from('ingredients')
      .select('id, ingredient_name, unit')
      .order('ingredient_name');

    if (ingredientsError) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No ingredients available in database',
        populated: [],
        skipped: [],
        errors: [],
      });
    }

    const dishesResult = await populateDishes(dishes, ingredients);

    const { data: recipes, error: recipesError } = await supabaseAdmin!
      .from('recipes')
      .select('id, name')
      .order('name');

    let recipesResult: PopulateRecipesResult = { populated: [], skipped: [], errors: [] };
    if (!recipesError && recipes && recipes.length > 0) {
      recipesResult = await populateRecipes(recipes, ingredients);
    }

    return NextResponse.json({
      success: true,
      dishes: {
        populated: dishesResult.populated,
        skipped: dishesResult.skipped,
        errors: dishesResult.errors,
        summary: {
          total_dishes: dishes.length,
          populated_count: dishesResult.populated.length,
          skipped_count: dishesResult.skipped.length,
          error_count: dishesResult.errors.length,
        },
      },
      recipes: {
        populated: recipesResult.populated,
        skipped: recipesResult.skipped,
        errors: recipesResult.errors,
        summary: {
          total_recipes: recipes?.length || 0,
          populated_count: recipesResult.populated.length,
          skipped_count: recipesResult.skipped.length,
          error_count: recipesResult.errors.length,
        },
      },
      overall_summary: {
        dishes_populated: dishesResult.populated.length,
        recipes_populated: recipesResult.populated.length,
        total_populated: dishesResult.populated.length + recipesResult.populated.length,
      },
    });
  } catch (err) {
    logger.error('[Populate Empty Dishes] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to populate dishes', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
