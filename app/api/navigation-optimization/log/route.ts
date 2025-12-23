import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const navigationLogSchema = z.object({
  href: z.string().min(1),
  timestamp: z.number().optional(),
  dayOfWeek: z.number().min(0).max(6),
  hourOfDay: z.number().min(0).max(23),
  timeSpent: z.number().optional(),
  returnFrequency: z.number().optional(),
});

/**
 * POST /api/navigation-optimization/log
 * Log navigation usage for adaptive optimization
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (validated against navigationLogSchema)
 * @param {string} req.body.href - Navigation href
 * @param {number} [req.body.timestamp] - Timestamp
 * @param {number} req.body.dayOfWeek - Day of week (0-6)
 * @param {number} req.body.hourOfDay - Hour of day (0-23)
 * @param {number} [req.body.timeSpent] - Time spent in milliseconds
 * @param {number} [req.body.returnFrequency] - Return frequency
 * @returns {Promise<NextResponse>} Log response
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userId = user.email;
    let body = {};
    try {
      body = await req.json();
    } catch (err) {
      logger.warn('[Navigation Optimization Log API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    const validationResult = navigationLogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const logData = validationResult.data;
    const timestamp = logData.timestamp ? new Date(logData.timestamp) : new Date();

    if (!supabaseAdmin) {
      logger.error('[Navigation Optimization API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    const { error } = await supabaseAdmin.from('navigation_usage_logs').insert({
      user_id: userId,
      href: logData.href,
      timestamp: timestamp.toISOString(),
      day_of_week: logData.dayOfWeek,
      hour_of_day: logData.hourOfDay,
      time_spent: logData.timeSpent || null,
      return_frequency: logData.returnFrequency || null,
    });

    if (error) {
      logger.error('[Navigation Optimization API] Failed to insert log:', {
        error: error.message,
        userId,
        href: logData.href,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to log navigation usage', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Navigation usage logged' });
  } catch (error) {
    logger.error('[Navigation Optimization API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
