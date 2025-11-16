import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

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
      { data: prices },
      { count: menuDishes },
      { data: allRecipes },
      { data: allIngredients },
      { count: tempChecksToday },
      { count: cleaningTasksPending },
    ] = await Promise.all([
      // Basic counts
      supabaseAdmin.from('ingredients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('selling_price').not('selling_price', 'is', null),
      // Menu dishes count (from menu_items)
      supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }),
      // All recipes for completeness check
      supabaseAdmin.from('recipes').select('id, selling_price'),
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

    // Calculate average dish price
    const valid = (prices || []).map((r: any) => Number(r.selling_price || 0)).filter(v => v > 0);
    const averageDishPrice = valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;

    // Count recipes ready to cook (recipes with ingredients)
    // Check which recipes have recipe_ingredients
    const { data: recipeIngredientsData } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id');

    const recipesWithIngredients = new Set(
      (recipeIngredientsData || []).map((r: any) => r.recipe_id),
    );

    const recipesReady = (allRecipes || []).filter((r: any) =>
      recipesWithIngredients.has(r.id),
    ).length;

    // Count recipes without cost data
    const recipesWithoutCost = (allRecipes || []).filter(
      (r: any) => !r.selling_price || r.selling_price === null,
    ).length;

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
