import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const category = searchParams.get('category');
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabaseAdmin.from('dishes').select('*', { count: 'exact' });

    // Filter by category if provided
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: dishes, error, count } = await query.order('dish_name').range(start, end);

    if (error) {
      logger.error('[Dishes API] Database error fetching dishes:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/dishes', operation: 'GET', table: 'dishes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      dishes: dishes || [],
      count: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes', method: 'GET' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dish_name, description, selling_price, recipes, ingredients, category } = body;

    if (!dish_name || !selling_price) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish name and selling price are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Validate that at least one recipe or ingredient is provided
    if ((!recipes || recipes.length === 0) && (!ingredients || ingredients.length === 0)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish must contain at least one recipe or ingredient',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Create the dish
    const { data: newDish, error: createError } = await supabaseAdmin
      .from('dishes')
      .insert({
        dish_name: dish_name.trim(),
        description: description?.trim() || null,
        selling_price: parseFloat(selling_price),
        category: category || 'Uncategorized',
      })
      .select()
      .single();

    if (createError) {
      logger.error('[Dishes API] Database error creating dish:', {
        error: createError.message,
        code: (createError as any).code,
        context: { endpoint: '/api/dishes', operation: 'POST', dishName: dish_name },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Add recipes if provided
    if (recipes && recipes.length > 0) {
      const dishRecipes = recipes.map((r: { recipe_id: string; quantity?: number }) => ({
        dish_id: newDish.id,
        recipe_id: r.recipe_id,
        quantity: r.quantity || 1,
      }));

      const { error: recipesError } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);

      if (recipesError) {
        logger.error('[Dishes API] Database error adding recipes to dish:', {
          error: recipesError.message,
          code: (recipesError as any).code,
          context: { endpoint: '/api/dishes', operation: 'POST', dishId: newDish.id },
        });

        // Rollback dish creation
        await supabaseAdmin.from('dishes').delete().eq('id', newDish.id);

        const apiError = ApiErrorHandler.fromSupabaseError(recipesError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
    }

    // Add ingredients if provided
    if (ingredients && ingredients.length > 0) {
      const dishIngredients = ingredients.map(
        (i: { ingredient_id: string; quantity: number; unit: string }) => ({
          dish_id: newDish.id,
          ingredient_id: i.ingredient_id,
          quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
          unit: i.unit,
        }),
      );

      const { error: ingredientsError } = await supabaseAdmin
        .from('dish_ingredients')
        .insert(dishIngredients);

      if (ingredientsError) {
        logger.error('[Dishes API] Database error adding ingredients to dish:', {
          error: ingredientsError.message,
          code: (ingredientsError as any).code,
          context: { endpoint: '/api/dishes', operation: 'POST', dishId: newDish.id },
        });

        // Rollback dish creation
        await supabaseAdmin.from('dishes').delete().eq('id', newDish.id);

        const apiError = ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }
    }

    return NextResponse.json({
      success: true,
      dish: newDish,
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes', method: 'POST' },
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
