import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
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

    // Always aggregate allergens and dietary status (even if cached)
    // This ensures we have the latest data from recipes/ingredients
    const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');
    const { aggregateDishDietaryStatus } = await import('@/lib/dietary/dietary-aggregation');
    const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');

    const [allergens, dietaryStatus] = await Promise.all([
      aggregateDishAllergens(dishId),
      aggregateDishDietaryStatus(dishId),
    ]);

    // Consolidate allergens for validation
    const consolidatedAllergens = consolidateAllergens(allergens || []);

    // Runtime validation: check for conflict between vegan status and allergens
    let validatedIsVegan = dietaryStatus?.isVegan ?? null;
    if (validatedIsVegan === true) {
      const hasMilk = consolidatedAllergens.includes('milk');
      const hasEggs = consolidatedAllergens.includes('eggs');
      if (hasMilk || hasEggs) {
        logger.warn('[Dishes API] Runtime validation: vegan=true but allergens include milk/eggs', {
          dishId,
          dishName: dish.dish_name,
          allergens: consolidatedAllergens,
          hasMilk,
          hasEggs,
        });
        validatedIsVegan = false;
      }
    }

    // Update dish cache with aggregated allergens if they differ
    if (
      allergens &&
      allergens.length > 0 &&
      (!dish.allergens || JSON.stringify(dish.allergens) !== JSON.stringify(allergens))
    ) {
      // Update cache in background (don't await)
      if (supabaseAdmin) {
        supabaseAdmin
          .from('dishes')
          .update({ allergens })
          .eq('id', dishId)
          .then(({ error }) => {
            if (error) {
              logger.warn('[Dishes API] Failed to cache aggregated allergens:', {
                dishId,
                error: error.message,
              });
            }
          });
      }
    }

    // Enrich dish with allergens and dietary info
    const enrichedDish = {
      ...dish,
      allergens: consolidatedAllergens,
      is_vegetarian: dietaryStatus?.isVegetarian ?? null,
      is_vegan: validatedIsVegan,
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

    // Get user email for change tracking
    let userEmail: string | null = null;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      userEmail = (token?.email as string) || null;
    } catch (tokenError) {
      // Continue without user email if auth fails (for development)
      logger.warn('[Dishes API] Could not get user email for change tracking:', tokenError);
    }

    // Fetch current dish to detect changes
    let currentDish: any = null;
    try {
      const dish = await fetchDishWithRelations(dishId);
      currentDish = dish;
    } catch (err) {
      logger.warn('[Dishes API] Could not fetch current dish for change detection:', err);
    }

    // Build update data
    const updateData = buildDishUpdateData(body);

    // Detect changes
    const changes: string[] = [];
    const changeDetails: any = {};

    if (currentDish) {
      // Check price change
      if (
        updateData.selling_price !== undefined &&
        updateData.selling_price !== currentDish.selling_price
      ) {
        changes.push('price_changed');
        changeDetails.price = {
          field: 'selling_price',
          before: currentDish.selling_price,
          after: updateData.selling_price,
          change: updateData.selling_price > currentDish.selling_price ? 'increased' : 'decreased',
        };
      }

      // Check description change
      if (
        updateData.description !== undefined &&
        updateData.description !== currentDish.description
      ) {
        changes.push('updated');
        changeDetails.description = {
          field: 'description',
          before: currentDish.description,
          after: updateData.description,
        };
      }
    }

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

    const dishName = updatedDish.dish_name || currentDish?.dish_name || 'Unknown Dish';

    // Update recipes if provided
    if (recipes !== undefined) {
      try {
        await updateDishRecipes(dishId, recipes);
        changes.push('recipes_changed');
        changeDetails.recipes = {
          field: 'recipes',
          change: 'recipes updated',
        };
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
        changes.push('ingredients_changed');
        changeDetails.ingredients = {
          field: 'ingredients',
          change: 'ingredients updated',
        };
        // Invalidate allergen cache when ingredients change
        const { invalidateDishAllergenCache } = await import('@/lib/allergens/cache-invalidation');
        invalidateDishAllergenCache(dishId).catch(err => {
          logger.error('[Dishes API] Error invalidating allergen cache:', err);
        });
        // Invalidate cached recommended prices for menu items using this dish (with change tracking)
        const { invalidateMenuItemsWithDish } = await import(
          '@/lib/menu-pricing/cache-invalidation'
        );
        invalidateMenuItemsWithDish(
          dishId,
          dishName,
          'ingredients_changed',
          changeDetails.ingredients,
          userEmail,
        ).catch(err => {
          logger.error('[Dishes API] Error invalidating menu pricing cache:', err);
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
      // Invalidate cached recommended prices for menu items using this dish (with change tracking)
      const { invalidateMenuItemsWithDish } = await import('@/lib/menu-pricing/cache-invalidation');
      invalidateMenuItemsWithDish(
        dishId,
        dishName,
        'recipes_changed',
        changeDetails.recipes,
        userEmail,
      ).catch(err => {
        logger.error('[Dishes API] Error invalidating menu pricing cache:', err);
      });
    }

    // Track price changes for locked menus
    if (changes.includes('price_changed')) {
      const { trackChangeForLockedMenus } = await import('@/lib/menu-lock/change-tracking');
      trackChangeForLockedMenus(
        'dish',
        dishId,
        dishName,
        'price_changed',
        changeDetails.price,
        userEmail,
      ).catch(err => {
        logger.error('[Dishes API] Error tracking price change:', err);
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
