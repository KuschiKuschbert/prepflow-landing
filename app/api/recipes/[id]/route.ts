import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    const body = await request.json();
    const { name, yield: dishPortions, yield_unit, category, description, instructions } = body;

    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'Recipe name is required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Check if recipe exists
    const { data: existingRecipe, error: checkError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .eq('id', recipeId)
      .single();

    if (checkError || !existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check if new name conflicts with another recipe (case-insensitive)
    if (name.trim().toLowerCase() !== existingRecipe.name.toLowerCase()) {
      const { data: conflictingRecipes, error: conflictError } = await supabaseAdmin
        .from('recipes')
        .select('id, name')
        .ilike('name', name.trim())
        .neq('id', recipeId);

      if (conflictError) {
        console.error('Error checking for name conflicts:', conflictError);
        return NextResponse.json(
          { error: 'Failed to validate recipe name', message: conflictError.message },
          { status: 500 },
        );
      }

      if (conflictingRecipes && conflictingRecipes.length > 0) {
        return NextResponse.json(
          {
            error: 'Recipe name already exists',
            message: 'A recipe with this name already exists. Please choose a different name.',
          },
          { status: 400 },
        );
      }
    }

    // Update recipe
    const updateData: {
      name?: string;
      yield?: number;
      yield_unit?: string;
      category?: string;
      description?: string | null;
      instructions?: string | null;
      updated_at?: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (dishPortions !== undefined) updateData.yield = dishPortions;
    if (yield_unit !== undefined) updateData.yield_unit = yield_unit;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (instructions !== undefined) updateData.instructions = instructions?.trim() || null;

    const { data: updatedRecipe, error: updateError } = await supabaseAdmin
      .from('recipes')
      .update(updateData)
      .eq('id', recipeId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating recipe:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recipe: updatedRecipe,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Check if recipe is used in menu dishes or dish_recipes before attempting deletion
    const [menuDishesResult, dishRecipesResult] = await Promise.all([
      supabaseAdmin
        .from('menu_dishes')
        .select('id, name, recipe_id, created_at, updated_at')
        .eq('recipe_id', recipeId),
      supabaseAdmin
        .from('dish_recipes')
        .select('dish_id, recipe_id')
        .eq('recipe_id', recipeId),
    ]);

    if (menuDishesResult.error) {
      console.error('Error checking menu dishes usage:', menuDishesResult.error);
      return NextResponse.json(
        { error: 'Failed to check recipe usage', message: menuDishesResult.error.message },
        { status: 500 },
      );
    }

    if (dishRecipesResult.error) {
      console.error('Error checking dish_recipes usage:', dishRecipesResult.error);
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

    console.log('[RecipeDelete] Recipe usage check:', {
      recipeId,
      usedInMenuDishes,
      usedInDishRecipes,
      menuDishesCount: menuDishesResult.data?.length || 0,
      menuDishesData: menuDishesResult.data,
      dishRecipesCount: dishRecipesResult.data?.length || 0,
      dishRecipesData: dishRecipesResult.data,
    });

    // Log full details for debugging
    if (menuDishesResult.data && menuDishesResult.data.length > 0) {
      console.log('[RecipeDelete] Found menu dishes using this recipe:', JSON.stringify(menuDishesResult.data, null, 2));
    }
    if (dishRecipesResult.data && dishRecipesResult.data.length > 0) {
      console.log('[RecipeDelete] Found dish_recipes using this recipe:', JSON.stringify(dishRecipesResult.data, null, 2));
    }

    // Only block deletion if used in dish_recipes (the new dishes system)
    // menu_dishes references will be automatically cleaned up
    if (usedInDishRecipes) {
      // Fetch dish names for dish_recipes
      const dishIds = dishRecipesResult.data.map((dr: { dish_id: string }) => dr.dish_id);
      let dishNames: string[] = [];

      if (dishIds.length > 0) {
        const { data: dishes } = await supabaseAdmin
          .from('dishes')
          .select('dish_name')
          .in('id', dishIds);
        if (dishes) {
          dishNames = dishes.map((d: { dish_name: string }) => d.dish_name || 'Unknown');
        }
      }

      const message = dishNames.length > 0
        ? `Cannot delete recipe. It is used in dishes: ${dishNames.join(', ')}. Please remove it from all dishes first.`
        : `Cannot delete recipe. It is used in dishes. Please remove it from all dishes first.`;

      return NextResponse.json(
        {
          error: 'Cannot delete recipe',
          message,
          dishNames,
        },
        { status: 400 },
      );
    }

    // If only used in menu_dishes (old system), we'll clean them up automatically
    if (usedInMenuDishes) {
      console.log('[RecipeDelete] Recipe is only used in menu_dishes (old system), will clean up automatically');
    }

    console.log('[RecipeDelete] Recipe not used in dishes, proceeding with deletion:', recipeId);

    // Delete recipe ingredients first (child records)
    console.log('[RecipeDelete] Deleting recipe ingredients...');
    const { error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      console.error('[RecipeDelete] Error deleting recipe ingredients:', ingredientsError);
      return NextResponse.json(
        { error: 'Failed to delete recipe ingredients', message: ingredientsError.message },
        { status: 500 },
      );
    }
    console.log('[RecipeDelete] Recipe ingredients deleted successfully');

    // Also clean up any orphaned menu_dishes references (set recipe_id to NULL)
    // This handles cases where menu_dishes exist but aren't visible in the UI
    const { error: cleanupError } = await supabaseAdmin
      .from('menu_dishes')
      .update({ recipe_id: null })
      .eq('recipe_id', recipeId);

    if (cleanupError) {
      console.warn('[RecipeDelete] Warning: Could not clean up menu_dishes references:', cleanupError);
      // Don't fail the deletion if cleanup fails - just log it
    } else {
      console.log('[RecipeDelete] Cleaned up menu_dishes references');
    }

    // Delete recipe
    console.log('[RecipeDelete] Deleting recipe...');
    const { error: recipeError } = await supabaseAdmin.from('recipes').delete().eq('id', recipeId);

    if (recipeError) {
      console.error('[RecipeDelete] Error deleting recipe:', recipeError);
      console.error('[RecipeDelete] Error details:', JSON.stringify(recipeError, null, 2));
      // Check if it's a foreign key constraint error
      if (
        recipeError.message.includes('foreign key constraint') ||
        recipeError.message.includes('menu_dishes') ||
        recipeError.message.includes('dish_recipes') ||
        recipeError.code === '23503'
      ) {
        return NextResponse.json(
          {
            error: 'Cannot delete recipe',
            message: 'Recipe is used in dishes. Please remove it from all dishes first.',
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: 'Failed to delete recipe', message: recipeError.message },
        { status: 500 },
      );
    }
    console.log('[RecipeDelete] Recipe deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
