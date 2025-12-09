import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/data/search
 * Search across all tables
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const table = searchParams.get('table') || 'all';

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        results: [],
      });
    }

    const results: any[] = [];
    const tablesToSearch =
      table === 'all'
        ? ['ingredients', 'recipes', 'dishes', 'users', 'temperature_logs', 'cleaning_tasks']
        : [table];

    for (const tableName of tablesToSearch) {
      try {
        // Build search query based on table structure
        let searchQuery = supabaseAdmin.from(tableName).select('*').limit(100);

        // Apply search filter based on table
        if (tableName === 'ingredients') {
          searchQuery = searchQuery.or(
            `ingredient_name.ilike.%${query}%,supplier.ilike.%${query}%`,
          );
        } else if (tableName === 'recipes') {
          searchQuery = searchQuery.or(`recipe_name.ilike.%${query}%,name.ilike.%${query}%`);
        } else if (tableName === 'dishes') {
          searchQuery = searchQuery.or(`dish_name.ilike.%${query}%,name.ilike.%${query}%`);
        } else if (tableName === 'users') {
          searchQuery = searchQuery.or(
            `email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`,
          );
        } else {
          // Generic search for other tables
          searchQuery = searchQuery.or(`name.ilike.%${query}%`);
        }

        const { data, error } = await searchQuery;

        if (error) {
          logger.warn(`[Admin Data Search] Error searching ${tableName}:`, error);
          continue;
        }

        if (data) {
          results.push(
            ...data.map((item: any) => ({
              table: tableName,
              id: item.id,
              data: item,
              created_at: item.created_at,
            })),
          );
        }
      } catch (error) {
        logger.warn(`[Admin Data Search] Error searching ${tableName}:`, error);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      results: results.slice(0, 100), // Limit to 100 results
      total: results.length,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Data Search API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/data/search', method: 'GET' },
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
