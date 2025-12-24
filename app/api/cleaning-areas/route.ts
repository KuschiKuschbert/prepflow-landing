import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCleaningArea } from './helpers/createCleaningArea';
import { handleCleaningAreaError } from './helpers/handleCleaningAreaError';
import { updateCleaningArea } from './helpers/updateCleaningArea';
import { createCleaningAreaSchema, updateCleaningAreaSchema } from './helpers/schemas';
import { handleDeleteCleaningArea } from './helpers/deleteCleaningAreaHandler';
import { handleCreateCleaningArea } from './helpers/createCleaningAreaHandler';

/**
 * GET /api/cleaning-areas
 * Get all cleaning areas
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} List of cleaning areas
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .select('*')
      .order('area_name');

    if (error) {
      logger.error('[Cleaning Areas API] Database error fetching areas:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-areas', operation: 'GET', table: 'cleaning_areas' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleCleaningAreaError(err, 'GET');
  }
}

/**
 * POST /api/cleaning-areas
 * Create a new cleaning area
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.area_name - Area name (required)
 * @param {string} [request.body.description] - Area description
 * @param {string} [request.body.cleaning_frequency] - Cleaning frequency
 * @returns {Promise<NextResponse>} Created cleaning area
 */
export async function POST(request: NextRequest) {
  return handleCreateCleaningArea(request);
}

/**
 * PUT /api/cleaning-areas
 * Update an existing cleaning area
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.id - Cleaning area ID (required)
 * @param {string} [request.body.area_name] - Area name
 * @param {string} [request.body.description] - Area description
 * @param {string} [request.body.cleaning_frequency] - Cleaning frequency
 * @param {boolean} [request.body.is_active] - Active status
 * @returns {Promise<NextResponse>} Updated cleaning area
 */
export async function PUT(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Cleaning Areas API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateCleaningAreaSchema.safeParse(body);
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

    const { id, area_name, description, cleaning_frequency, is_active } = validationResult.data;

    const updateData: any = {};
    if (area_name !== undefined) updateData.area_name = area_name;
    if (description !== undefined) updateData.description = description;
    if (cleaning_frequency !== undefined) updateData.cleaning_frequency = cleaning_frequency;
    if (is_active !== undefined) updateData.is_active = is_active;

    const data = await updateCleaningArea(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Cleaning area updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      logger.error('[Cleaning Areas API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/cleaning-areas', method: 'PUT' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningAreaError(err, 'PUT');
  }
}

/**
 * DELETE /api/cleaning-areas
 * Delete a cleaning area
 *
 * @param {NextRequest} request - Request object
 * @param {string} request.url.searchParams.id - Cleaning area ID (required)
 * @returns {Promise<NextResponse>} Deletion response
 */
export async function DELETE(request: NextRequest) {
  return handleDeleteCleaningArea(request);
}
