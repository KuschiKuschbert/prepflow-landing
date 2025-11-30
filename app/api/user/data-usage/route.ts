import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/user/data-usage
 * Get current user's data usage breakdown
 *
 * @returns {Promise<NextResponse>} Data usage breakdown
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      logger.warn('[Data Usage API] Supabase not available');
      return NextResponse.json({
        usage: {
          ingredients: { count: 0, size_bytes: 0 },
          recipes: { count: 0, size_bytes: 0 },
          dishes: { count: 0, size_bytes: 0 },
          temperature_logs: { count: 0, size_bytes: 0 },
          cleaning_tasks: { count: 0, size_bytes: 0 },
          compliance_records: { count: 0, size_bytes: 0 },
        },
        total_size_bytes: 0,
        note: 'Database not available. Using default values.',
      });
    }

    // Get counts for each table with individual error handling
    // Use Promise.allSettled to handle missing tables gracefully
    const results = await Promise.allSettled([
      supabaseAdmin.from('ingredients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('menu_dishes').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('temperature_logs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('cleaning_tasks').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('compliance_records').select('*', { count: 'exact', head: true }),
    ]);

    // Helper to extract count from result, handling errors gracefully
    const getCount = (result: PromiseSettledResult<any>, tableName: string): number => {
      if (result.status === 'fulfilled') {
        const { data, error, count } = result.value;
        if (error) {
          const errorCode = (error as any).code;
          // Handle missing table gracefully (PostgreSQL error code 42P01)
          if (errorCode === '42P01') {
            logger.dev(`[Data Usage API] Table '${tableName}' does not exist, using 0`);
            return 0;
          }
          logger.warn(`[Data Usage API] Error fetching count for '${tableName}':`, {
            error: error.message,
            code: errorCode,
          });
          return 0;
        }
        return count || 0;
      } else {
        logger.warn(`[Data Usage API] Promise rejected for '${tableName}':`, {
          error: result.reason,
        });
        return 0;
      }
    };

    // Estimate sizes (rough approximation: ~500 bytes per record average)
    const estimateSize = (count: number) => count * 500;

    // Extract counts once for each table
    const ingredientsCount = getCount(results[0], 'ingredients');
    const recipesCount = getCount(results[1], 'recipes');
    const dishesCount = getCount(results[2], 'menu_dishes');
    const temperatureLogsCount = getCount(results[3], 'temperature_logs');
    const cleaningTasksCount = getCount(results[4], 'cleaning_tasks');
    const complianceRecordsCount = getCount(results[5], 'compliance_records');

    const usage = {
      ingredients: {
        count: ingredientsCount,
        size_bytes: estimateSize(ingredientsCount),
      },
      recipes: {
        count: recipesCount,
        size_bytes: estimateSize(recipesCount),
      },
      dishes: {
        count: dishesCount,
        size_bytes: estimateSize(dishesCount),
      },
      temperature_logs: {
        count: temperatureLogsCount,
        size_bytes: estimateSize(temperatureLogsCount),
      },
      cleaning_tasks: {
        count: cleaningTasksCount,
        size_bytes: estimateSize(cleaningTasksCount),
      },
      compliance_records: {
        count: complianceRecordsCount,
        size_bytes: estimateSize(complianceRecordsCount),
      },
    };

    const total_size_bytes = Object.values(usage).reduce(
      (sum, item) => sum + item.size_bytes,
      0,
    );

    return NextResponse.json({
      usage,
      total_size_bytes,
    });
  } catch (error) {
    logger.error('[Data Usage API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/data-usage', method: 'GET' },
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
