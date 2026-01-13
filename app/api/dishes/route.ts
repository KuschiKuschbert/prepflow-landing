/**
 * Dishes API Routes
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after dish
 * create operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { triggerDishSync } from '@/lib/square/sync/hooks';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createDishWithRelations } from './helpers/createDishWithRelations';
import { handleDishListError } from './helpers/handleDishListError';

const recipeSchema = z.object({
  recipe_id: z.string().min(1, 'Recipe ID is required'),
  quantity: z.number().positive().optional().default(1),
});

const ingredientSchema = z.object({
  ingredient_id: z.string().min(1, 'Ingredient ID is required'),
  quantity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  unit: z.string().min(1, 'Unit is required'),
});

const createDishSchema = z
  .object({
    dish_name: z.string().min(1, 'Dish name is required'),
    selling_price: z.number().positive('Selling price must be positive'),
    description: z.string().optional(),
    recipes: z.array(recipeSchema).optional(),
    ingredients: z.array(ingredientSchema).optional(),
    category: z.string().optional(),
  })
  .refine(
    data => {
      const hasRecipes = data.recipes && data.recipes.length > 0;
      const hasIngredients = data.ingredients && data.ingredients.length > 0;
      return hasRecipes || hasIngredients;
    },
    {
      message: 'Dish must contain at least one recipe or ingredient',
      path: ['recipes'],
    },
  );

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
      const pgError = error as PostgrestError;
      logger.error('[Dishes API] Database error fetching dishes:', {
        error: pgError.message,
        code: pgError.code,
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
      context: { endpoint: '/api/dishes', method: 'GET' },
    });
    return handleDishListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Dishes API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createDishSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { dish_name, description, selling_price, recipes, ingredients, category } =
      validationResult.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const newDish = await createDishWithRelations(
      {
        dish_name,
        description,
        selling_price, // Already validated as number by Zod schema
        category,
      },
      recipes,
      ingredients,
    );

    // Trigger Square sync hook (non-blocking)
    (async () => {
      try {
        await triggerDishSync(request, newDish.id, 'create');
      } catch (err) {
        logger.error('[Dishes API] Error triggering Square sync:', {
          error: err instanceof Error ? err.message : String(err),
          dishId: newDish.id,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      dish: newDish,
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/dishes', method: 'POST' },
    });
    if (err instanceof Error && 'status' in err) {
      const statusError = err as { status: number; message: string };
      return NextResponse.json(err, { status: statusError.status });
    }
    return handleDishListError(err, 'POST');
  }
}
