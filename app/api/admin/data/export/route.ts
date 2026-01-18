import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { fetchTableData } from './helpers/fetchTableData';
import { normalizeForCSV } from './helpers/normalizeForCSV';

function createCsvResponse(allData: unknown[]): NextResponse {
  if (allData.length === 0) {
    return new NextResponse('No data to export', { status: 404 });
  }

  // Normalize data for CSV export (handle objects and nulls)
  const dataToNormalize = allData as Record<string, unknown>[];
  const normalizedData = normalizeForCSV(dataToNormalize);

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

/**
 * GET /api/admin/data/export
 * Export data as CSV or JSON
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const table = searchParams.get('table') || 'all';
    const format = searchParams.get('format') || 'json';

    // Get data (reuse search logic)
    const tablesToSearch = table === 'all' ? ['ingredients', 'recipes', 'dishes', 'users'] : [table];

    const allData: unknown[] = [];

    for (const tableName of tablesToSearch) {
      const data = await fetchTableData(tableName, query);
      allData.push(...data);
    }

    if (format === 'csv') {
      return createCsvResponse(allData);
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
