import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users/[id]/data
 * Get all data associated with a user
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Note: Currently the app uses shared workspace, so we can't filter by user_id
    // This will need to be updated when user isolation is implemented
    // For now, we return all data (admin has full access)

    // Get counts and data for each table
    const [
      ingredientsResult,
      recipesResult,
      dishesResult,
      temperatureResult,
      cleaningResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('ingredients')
        .select('id, ingredient_name, created_at', { count: 'exact' }),
      supabaseAdmin.from('recipes').select('id, recipe_name, created_at', { count: 'exact' }),
      supabaseAdmin.from('dishes').select('id, dish_name, created_at', { count: 'exact' }),
      supabaseAdmin
        .from('temperature_logs')
        .select('id, created_at', { count: 'exact' })
        .limit(100),
      supabaseAdmin
        .from('cleaning_tasks')
        .select('id, task_name, created_at', { count: 'exact' })
        .limit(100),
    ]);

    // Check for errors in each result
    const errors: string[] = [];
    if (ingredientsResult.error) {
      logger.error('[Admin User Data API] Error fetching ingredients:', {
        error: ingredientsResult.error.message,
        code: (ingredientsResult.error as any).code,
        context: { endpoint: '/api/admin/users/[id]/data', operation: 'GET' },
      });
      errors.push(`Ingredients: ${ingredientsResult.error.message}`);
    }
    if (recipesResult.error) {
      logger.error('[Admin User Data API] Error fetching recipes:', {
        error: recipesResult.error.message,
        code: (recipesResult.error as any).code,
        context: { endpoint: '/api/admin/users/[id]/data', operation: 'GET' },
      });
      errors.push(`Recipes: ${recipesResult.error.message}`);
    }
    if (dishesResult.error) {
      logger.error('[Admin User Data API] Error fetching dishes:', {
        error: dishesResult.error.message,
        code: (dishesResult.error as any).code,
        context: { endpoint: '/api/admin/users/[id]/data', operation: 'GET' },
      });
      errors.push(`Dishes: ${dishesResult.error.message}`);
    }
    if (temperatureResult.error) {
      logger.error('[Admin User Data API] Error fetching temperature logs:', {
        error: temperatureResult.error.message,
        code: (temperatureResult.error as any).code,
        context: { endpoint: '/api/admin/users/[id]/data', operation: 'GET' },
      });
      errors.push(`Temperature logs: ${temperatureResult.error.message}`);
    }
    if (cleaningResult.error) {
      logger.error('[Admin User Data API] Error fetching cleaning tasks:', {
        error: cleaningResult.error.message,
        code: (cleaningResult.error as any).code,
        context: { endpoint: '/api/admin/users/[id]/data', operation: 'GET' },
      });
      errors.push(`Cleaning tasks: ${cleaningResult.error.message}`);
    }

    // If all queries failed, return error
    if (errors.length === 5) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch user data', 'DATABASE_ERROR', 500, {
          errors,
        }),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      ingredients: ingredientsResult.count || 0,
      recipes: recipesResult.count || 0,
      dishes: dishesResult.count || 0,
      temperatureLogs: temperatureResult.count || 0,
      cleaningTasks: cleaningResult.count || 0,
      data: {
        ingredients: ingredientsResult.data || [],
        recipes: recipesResult.data || [],
        dishes: dishesResult.data || [],
        temperatureLogs: temperatureResult.data || [],
        cleaningTasks: cleaningResult.data || [],
      },
      note: 'Currently showing all data (shared workspace). User isolation not yet implemented.',
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin User Data API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/users/[id]/data', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
