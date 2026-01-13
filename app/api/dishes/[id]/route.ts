/**
 * Dish API Routes (by ID)
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after dish
 * update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enrichDishWithAllergens } from './helpers/enrichDishWithAllergens';
import { fetchDishWithRelations } from './helpers/fetchDishWithRelations';
import { handleDishError } from './helpers/handleDishError';
import { handlePutRequest } from './helpers/handlePutRequest';

const recipeSchema = z.object({
  recipe_id: z.string().min(1, 'Recipe ID is required'),
  quantity: z.number().positive().optional().default(1),
});

const ingredientSchema = z.object({
  ingredient_id: z.string().min(1, 'Ingredient ID is required'),
  quantity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  unit: z.string().min(1, 'Unit is required'),
});

const updateDishSchema = z.object({
  dish_name: z.string().min(1).optional(),
  description: z.string().optional(),
  selling_price: z
    .union([z.number().positive(), z.string().transform(val => parseFloat(val))])
    .optional(),
  recipes: z.array(recipeSchema).optional(),
  ingredients: z.array(ingredientSchema).optional(),
  category: z.string().optional(),
});

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json(ApiErrorHandler.createError('Missing dish id', 'BAD_REQUEST', 400), {
        status: 400,
      });
    }

    const dish = await fetchDishWithRelations(dishId);
    const enrichedDish = await enrichDishWithAllergens(dish, dishId);

    return NextResponse.json({
      success: true,
      dish: enrichedDish,
    });
  } catch (err) {
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleDishError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dishId = id;
  try {
    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

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

    const validationResult = updateDishSchema.safeParse(body);
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

    // Validation passed - proceed to helper (it will parse body again, but structure is validated)
    return handlePutRequest(request, dishId);
  } catch (err) {
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleDishError(err, 'PUT', dishId);
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
        code: error.code,
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
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleDishError(err, 'DELETE');
  }
}
