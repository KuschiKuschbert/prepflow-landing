import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch all data in parallel for better performance
    const [
      { count: ing },
      { count: rec },
      dishesPricesResult,
      { count: menuDishes },
      { data: allRecipes },
      { data: allIngredients },
      { count: tempChecksToday },
      { count: cleaningTasksPending },
    ] = await Promise.all([
      // Basic counts
      supabaseAdmin.from('ingredients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('*', { count: 'exact', head: true }),
      // Fetch dish prices (dishes have selling_price, not recipes)
      supabaseAdmin.from('dishes').select('selling_price').not('selling_price', 'is', null),
      // Menu dishes count (from menu_items)
      supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }),
      // All recipes for completeness check
      supabaseAdmin.from('recipes').select('id'),
      // All ingredients for stock check
      supabaseAdmin.from('ingredients').select('id, current_stock, min_stock_level'),
      // Temperature checks today
      supabaseAdmin
        .from('temperature_logs')
        .select('*', { count: 'exact', head: true })
        .eq('log_date', today),
      // Pending cleaning tasks
      supabaseAdmin
        .from('cleaning_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);

    // Calculate average dish price from dishes table
    // Handle case where dishes table doesn't exist gracefully
    let averageDishPrice = 0;
    if (dishesPricesResult.error) {
      const errorCode = (dishesPricesResult.error as any).code;
      if (
        errorCode === 'PGRST116' ||
        dishesPricesResult.error.message?.includes('does not exist')
      ) {
        // Dishes table doesn't exist, default to 0
        logger.dev(
          '[Dashboard Stats API] Dishes table not found, defaulting average dish price to 0',
        );
      } else {
        logger.warn('[Dashboard Stats API] Error fetching dish prices:', {
          error: dishesPricesResult.error.message,
          code: errorCode,
        });
      }
    } else {
      const valid = (dishesPricesResult.data || [])
        .map((d: any) => Number(d.selling_price || 0))
        .filter((v: number) => v > 0);
      averageDishPrice =
        valid.length > 0 ? valid.reduce((a: number, b: number) => a + b, 0) / valid.length : 0;
    }

    // Count recipes ready to cook (recipes with ingredients)
    // Check which recipes have recipe_ingredients and ensure they have at least one ingredient
    const { data: recipeIngredientsData, error: recipeIngredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .not('recipe_id', 'is', null);

    if (recipeIngredientsError) {
      logger.warn('[Dashboard Stats API] Error fetching recipe ingredients:', {
        error: recipeIngredientsError.message,
      });
    }

    // Count ingredients per recipe to ensure recipes actually have ingredients
    const recipeIngredientCounts = (recipeIngredientsData || []).reduce(
      (acc: Record<string, number>, ri: any) => {
        if (ri.recipe_id) {
          acc[ri.recipe_id] = (acc[ri.recipe_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Only count recipes that have at least one ingredient
    const recipesReady = (allRecipes || []).filter(
      (r: any) => recipeIngredientCounts[r.id] > 0,
    ).length;

    // Count recipes without cost data (recipes don't have selling_price, dishes do)
    // This metric is now deprecated but kept for backward compatibility
    const recipesWithoutCost = 0;

    // Count ingredients needing restock (current_stock <= min_stock_level)
    const ingredientsLowStock = (allIngredients || []).filter((ing: any) => {
      const currentStock = Number(ing.current_stock || 0);
      const minStock = Number(ing.min_stock_level || 0);
      return minStock > 0 && currentStock <= minStock;
    }).length;

    return NextResponse.json({
      success: true,
      // Existing metrics
      totalIngredients: ing || 0,
      totalRecipes: rec || 0,
      averageDishPrice,
      // New chef-relevant metrics
      totalMenuDishes: menuDishes || 0,
      recipesReady,
      recipesWithoutCost,
      ingredientsLowStock,
      temperatureChecksToday: tempChecksToday || 0,
      cleaningTasksPending: cleaningTasksPending || 0,
    });
  } catch (err) {
    logger.error('[Dashboard Stats API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dashboard/stats', method: 'GET' },
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
