/**
 * Cost audit API endpoint.
 * Audits dish costs by comparing API calculations with UI calculations.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { auditDish } from './helpers/auditDish';
import { calculateSummary } from './helpers/calculateSummary';
import type { AuditResult } from './types';

export async function GET(request: NextRequest) {
  try {
    // Check admin key for security
    const adminKey = request.headers.get('X-Admin-Key');
    const expectedKey = process.env.SEED_ADMIN_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError('This endpoint is disabled in production', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all dishes
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, selling_price');

    if (dishesError) {
      logger.error('[Audit Costs] Error fetching dishes:', {
        error: dishesError,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No dishes found',
        results: [],
      });
    }

    // Audit each dish
    const auditResults: AuditResult[] = [];
    for (const dish of dishes) {
      const result = await auditDish(dish);
      auditResults.push(result);
    }

    // Calculate summary statistics
    const summary = calculateSummary(auditResults);

    return NextResponse.json({
      success: true,
      summary,
      results: auditResults,
    });
  } catch (err) {
    logger.error('[Audit Costs] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
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
