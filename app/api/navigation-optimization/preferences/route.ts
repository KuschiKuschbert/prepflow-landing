import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const preferencesSchema = z.object({
  enabled: z.boolean(),
  selectedSections: z.array(z.string()),
});

/**
 * GET /api/navigation-optimization/preferences
 * Get user navigation optimization preferences
 *
 * @returns {Promise<NextResponse>} User preferences
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userId = user.email;

    if (!supabaseAdmin) {
      logger.error('[Navigation Optimization API] Supabase not available');
      return NextResponse.json(
        {
          enabled: false,
          selectedSections: [],
          note: 'Database not available, using defaults',
        },
        { status: 200 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('navigation_optimization_preferences')
      .select('enabled, selected_sections, last_updated')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine for first-time users
      logger.error('[Navigation Optimization API] Failed to fetch preferences:', {
        error: error.message,
        userId,
      });
    }

    if (!data) {
      // Return defaults if no preferences found
      return NextResponse.json({
        enabled: false,
        selectedSections: [],
        lastUpdated: null,
      });
    }

    return NextResponse.json({
      enabled: data.enabled || false,
      selectedSections: data.selected_sections || [],
      lastUpdated: data.last_updated ? new Date(data.last_updated).getTime() : null,
    });
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

/**
 * PUT /api/navigation-optimization/preferences
 * Update user navigation optimization preferences
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (validated against preferencesSchema)
 * @param {boolean} req.body.enabled - Whether optimization is enabled
 * @param {string[]} req.body.selectedSections - Selected navigation sections
 * @returns {Promise<NextResponse>} Updated preferences
 */
export async function PUT(req: NextRequest) {
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
      logger.warn('[Navigation Optimization Preferences API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    const validationResult = preferencesSchema.safeParse(body);

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

    const preferences = validationResult.data;

    if (!supabaseAdmin) {
      logger.error('[Navigation Optimization API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('navigation_optimization_preferences')
      .upsert(
        {
          user_id: userId,
          enabled: preferences.enabled,
          selected_sections: preferences.selectedSections,
          last_updated: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (error) {
      logger.error('[preferences/route] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    if (error) {
      logger.error('[Navigation Optimization API] Failed to update preferences:', {
        error: error.message,
        userId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to update preferences', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      enabled: data.enabled,
      selectedSections: data.selected_sections || [],
      lastUpdated: data.last_updated ? new Date(data.last_updated).getTime() : null,
    });
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
