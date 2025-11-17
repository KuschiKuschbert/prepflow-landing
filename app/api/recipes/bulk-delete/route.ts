import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeIds } = body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'recipeIds array is required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Check if any recipes are used in menu dishes or dish_recipes before attempting deletion
    const [menuDishesResult, dishRecipesResult] = await Promise.all([
      supabaseAdmin.from('menu_dishes').select('recipe_id').in('recipe_id', recipeIds).limit(1),
      supabaseAdmin.from('dish_recipes').select('recipe_id').in('recipe_id', recipeIds).limit(1),
    ]);

    if (menuDishesResult.error) {
      logger.error('Error checking menu dishes usage:', menuDishesResult.error);
      return NextResponse.json(
        { error: 'Failed to check recipe usage', message: menuDishesResult.error.message },
        { status: 500 },
      );
    }

    if (dishRecipesResult.error) {
      logger.error('Error checking dish_recipes usage:', dishRecipesResult.error);
      // Don't fail if dish_recipes table doesn't exist
      if (!dishRecipesResult.error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Failed to check recipe usage', message: dishRecipesResult.error.message },
          { status: 500 },
        );
      }
    }

    const usedInMenuDishes = menuDishesResult.data && menuDishesResult.data.length > 0;
    const usedInDishRecipes = dishRecipesResult.data && dishRecipesResult.data.length > 0;

    if (usedInMenuDishes || usedInDishRecipes) {
      const usage = [];
      if (usedInMenuDishes) usage.push('menu dishes');
      if (usedInDishRecipes) usage.push('dishes');
      return NextResponse.json(
        {
          error: 'Cannot delete recipes',
          message: `One or more recipes are used in ${usage.join(' and ')}. Please remove them from all ${usage.join(' and ')} first.`,
        },
        { status: 400 },
      );
    }

    // Delete recipe ingredients first (child records)
    const { error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .delete()
      .in('recipe_id', recipeIds);

    if (ingredientsError) {
      logger.error('Error deleting recipe ingredients:', ingredientsError);
      return NextResponse.json(
        { error: 'Failed to delete recipe ingredients', message: ingredientsError.message },
        { status: 500 },
      );
    }

    // Delete recipes
    const { error: recipesError } = await supabaseAdmin
      .from('recipes')
      .delete()
      .in('id', recipeIds);

    if (recipesError) {
      logger.error('Error deleting recipes:', recipesError);
      // Check if it's a foreign key constraint error
      if (
        recipesError.message.includes('foreign key constraint') ||
        recipesError.message.includes('menu_dishes') ||
        recipesError.message.includes('dish_recipes')
      ) {
        return NextResponse.json(
          {
            error: 'Cannot delete recipes',
            message:
              'One or more recipes are used in dishes. Please remove them from all dishes first.',
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: 'Failed to delete recipes', message: recipesError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${recipeIds.length} recipe${recipeIds.length > 1 ? 's' : ''} deleted successfully`,
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
