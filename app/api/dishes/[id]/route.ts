import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

async function updateDishRecipes(
  dishId: string,
  recipes: Array<{ recipe_id: string; quantity?: number }>,
) {
  await supabaseAdmin.from('dish_recipes').delete().eq('dish_id', dishId);
  if (recipes.length > 0) {
    const dishRecipes = recipes.map(r => ({
      dish_id: dishId,
      recipe_id: r.recipe_id,
      quantity: r.quantity || 1,
    }));
    const { error } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);
    if (error) throw error;
  }
}

async function updateDishIngredients(
  dishId: string,
  ingredients: Array<{ ingredient_id: string; quantity: number; unit: string }>,
) {
  await supabaseAdmin.from('dish_ingredients').delete().eq('dish_id', dishId);
  if (ingredients.length > 0) {
    const dishIngredients = ingredients.map(i => ({
      dish_id: dishId,
      ingredient_id: i.ingredient_id,
      quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
      unit: i.unit,
    }));
    const { error } = await supabaseAdmin.from('dish_ingredients').insert(dishIngredients);
    if (error) throw error;
  }
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch dish with recipes and ingredients
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('*')
      .eq('id', dishId)
      .single();

    if (dishError) {
      logger.error('[Dishes API] Database error fetching dish:', {
        error: dishError.message,
        code: (dishError as any).code,
        context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishError, 404);
      return NextResponse.json(apiError, { status: apiError.status || 404 });
    }

    if (!dish) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404, { dishId }),
        { status: 404 },
      );
    }

    // Fetch dish recipes
    const { data: dishRecipes, error: recipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        id,
        recipe_id,
        quantity,
        recipes (
          id,
          name,
          description,
          yield,
          yield_unit
        )
      `,
      )
      .eq('dish_id', dishId);

    // Fetch dish ingredients
    const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          unit,
          supplier_name,
          category
        )
      `,
      )
      .eq('dish_id', dishId);

    return NextResponse.json({
      success: true,
      dish: {
        ...dish,
        recipes: dishRecipes || [],
        ingredients: dishIngredients || [],
      },
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;
    const body = await request.json();
    const { dish_name, description, selling_price, recipes, ingredients } = body;

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const updateData: { dish_name?: string; description?: string | null; selling_price?: number } =
      {};
    if (dish_name !== undefined) updateData.dish_name = dish_name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (selling_price !== undefined) updateData.selling_price = parseFloat(selling_price);

    const { data: updatedDish, error: updateError } = await supabaseAdmin
      .from('dishes')
      .update(updateData)
      .eq('id', dishId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Dishes API] Database error updating dish:', {
        error: updateError.message,
        code: (updateError as any).code,
        context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    if (recipes !== undefined) {
      try {
        await updateDishRecipes(dishId, recipes);
      } catch (recipesError: any) {
        logger.error('[Dishes API] Database error updating dish recipes:', {
          error: recipesError.message,
          code: recipesError.code,
          context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
        });
        const apiError = ApiErrorHandler.fromSupabaseError(recipesError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
    }

    if (ingredients !== undefined) {
      try {
        await updateDishIngredients(dishId, ingredients);
      } catch (ingredientsError: any) {
        logger.error('[Dishes API] Database error updating dish ingredients:', {
          error: ingredientsError.message,
          code: ingredientsError.code,
          context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
        });
        const apiError = ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
    }

    return NextResponse.json({
      success: true,
      dish: updatedDish,
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Delete dish (cascade will handle related records)
    const { error } = await supabaseAdmin.from('dishes').delete().eq('id', dishId);

    if (error) {
      logger.error('[Dishes API] Database error deleting dish:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/dishes/[id]', operation: 'DELETE', dishId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dish deleted successfully',
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
