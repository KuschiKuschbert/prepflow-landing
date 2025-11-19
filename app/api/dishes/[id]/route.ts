import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildDishUpdateData } from './helpers/buildDishUpdateData';
import { fetchDishWithRelations } from './helpers/fetchDishWithRelations';
import { handleDishError } from './helpers/handleDishError';
import { updateDishIngredients } from './helpers/updateDishIngredients';
import { updateDishRecipes } from './helpers/updateDishRecipes';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    const dish = await fetchDishWithRelations(dishId);

    // Aggregate allergens and dietary status
    const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');
    const { aggregateDishDietaryStatus } = await import('@/lib/dietary/dietary-aggregation');

    const [allergens, dietaryStatus] = await Promise.all([
      aggregateDishAllergens(dishId),
      aggregateDishDietaryStatus(dishId),
    ]);

    // Enrich dish with allergens and dietary info
    const enrichedDish = {
      ...dish,
      allergens: allergens || [],
      is_vegetarian: dietaryStatus?.isVegetarian ?? null,
      is_vegan: dietaryStatus?.isVegan ?? null,
      dietary_confidence: dietaryStatus?.confidence ?? null,
      dietary_method: dietaryStatus?.method ?? null,
    };

    return NextResponse.json({
      success: true,
      dish: enrichedDish,
    });
  } catch (err: any) {
    return handleDishError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dishId = id;
  try {
    const body = await request.json();
    const { recipes, ingredients } = body;

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

    // Build update data
    const updateData = buildDishUpdateData(body);

    // Update dish
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

    // Update recipes if provided
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

    // Update ingredients if provided
    if (ingredients !== undefined) {
      try {
        await updateDishIngredients(dishId, ingredients);
        // Invalidate allergen cache when ingredients change
        const { invalidateDishAllergenCache } = await import('@/lib/allergens/cache-invalidation');
        invalidateDishAllergenCache(dishId).catch(err => {
          logger.error('[Dishes API] Error invalidating allergen cache:', err);
        });
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

    // Invalidate allergen cache when recipes change
    if (recipes !== undefined) {
      const { invalidateDishAllergenCache } = await import('@/lib/allergens/cache-invalidation');
      invalidateDishAllergenCache(dishId).catch(err => {
        logger.error('[Dishes API] Error invalidating allergen cache:', err);
      });
    }

    return NextResponse.json({
      success: true,
      dish: updatedDish,
    });
  } catch (err) {
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
    return handleDishError(err, 'DELETE');
  }
}
