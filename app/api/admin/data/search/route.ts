import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { performTableSearch } from './helpers/performTableSearch';

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

    const results: unknown[] = [];
    const tablesToSearch =
      table === 'all'
        ? ['ingredients', 'recipes', 'dishes', 'users', 'temperature_logs', 'cleaning_tasks']
        : [table];

    for (const tableName of tablesToSearch) {
      const tableResults = await performTableSearch(tableName, query);
      results.push(...tableResults);
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
