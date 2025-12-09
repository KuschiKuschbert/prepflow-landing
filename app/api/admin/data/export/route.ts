import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

/**
 * GET /api/admin/data/export
 * Export data as CSV or JSON
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
    const format = searchParams.get('format') || 'json';

    // Get data (reuse search logic)
    const tablesToSearch =
      table === 'all' ? ['ingredients', 'recipes', 'dishes', 'users'] : [table];

    const allData: any[] = [];

    for (const tableName of tablesToSearch) {
      try {
        let searchQuery = supabaseAdmin.from(tableName).select('*').limit(1000);

        if (query) {
          if (tableName === 'ingredients') {
            searchQuery = searchQuery.or(
              `ingredient_name.ilike.%${query}%,supplier.ilike.%${query}%`,
            );
          } else if (tableName === 'recipes') {
            searchQuery = searchQuery.or(`recipe_name.ilike.%${query}%,name.ilike.%${query}%`);
          } else if (tableName === 'dishes') {
            searchQuery = searchQuery.or(`dish_name.ilike.%${query}%,name.ilike.%${query}%`);
          } else if (tableName === 'users') {
            searchQuery = searchQuery.or(`email.ilike.%${query}%`);
          }
        }

        const { data } = await searchQuery;
        if (data) {
          allData.push(...data.map((item: any) => ({ ...item, _table: tableName })));
        }
      } catch (error) {
        logger.warn(`[Admin Data Export] Error exporting ${tableName}:`, error);
      }
    }

    if (format === 'csv') {
      // Convert to CSV using PapaParse for proper formatting
      if (allData.length === 0) {
        return new NextResponse('No data to export', { status: 404 });
      }

      // Normalize data for CSV export (handle objects and nulls)
      const normalizedData = allData.map(row => {
        const normalized: Record<string, any> = {};
        Object.keys(row).forEach(key => {
          const value = row[key];
          if (value === null || value === undefined) {
            normalized[key] = '';
          } else if (typeof value === 'object') {
            normalized[key] = JSON.stringify(value);
          } else {
            normalized[key] = String(value);
          }
        });
        return normalized;
      });

      const headers = Object.keys(normalizedData[0]);
      const csv = Papa.unparse(normalizedData, {
        columns: headers,
        header: true,
        delimiter: ',',
        newline: '\n',
        quoteChar: '"',
        escapeChar: '"',
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
          'Content-Disposition': `attachment; filename="data-export-${new Date().toISOString()}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({
      success: true,
      data: allData,
      count: allData.length,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Data Export API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/data/export', method: 'GET' },
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
