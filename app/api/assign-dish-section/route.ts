import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';

const assignDishSectionSchema = z.object({
  dishId: z.string().min(1, 'Dish ID is required'),
  sectionId: z.string().nullable().optional(),
});

/**
 * POST /api/assign-dish-section
 * Assign a dish to a kitchen section
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.dishId - Dish ID (required)
 * @param {string} [request.body.sectionId] - Kitchen section ID (optional, null to unassign)
 * @returns {Promise<NextResponse>} Assignment response with updated dish data
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Assign Dish Section API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = assignDishSectionSchema.safeParse(body);
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

    const { dishId, sectionId } = validationResult.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('menu_dishes')
      .update({
        kitchen_section_id: sectionId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dishId)
      .select(
        `
        id,
        name,
        kitchen_section_id,
        kitchen_sections (
          id,
          name,
          color
        )
      `,
      )
      .single();

    if (error) {
      logger.error('Error assigning dish to section:', error);
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(error, 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dish section assignment updated successfully',
      data,
    });
  } catch (error) {
    logger.error('Assign dish section API error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('An unexpected error occurred', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
