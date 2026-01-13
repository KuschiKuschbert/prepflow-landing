import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateMenuItemInput } from '../../../helpers/schemas';
import { deleteMenuItem } from './helpers/deleteMenuItem';
import { updateMenuItemSchema } from './helpers/schemas';
import { updateMenuItem } from './helpers/updateMenuItem';
import { validateMenuItemRequest } from './helpers/validateMenuItemRequest';

/**
 * PUT /api/menus/[id]/items/[itemId]
 * Update menu item (category, position, or price)
 *
 * @param {NextRequest} request - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string, itemId: string}>} context.params - Route parameters
 * @param {Object} request.body - Request body
 * @param {string} [request.body.category] - Category name
 * @param {number} [request.body.position] - Position in category
 * @param {number} [request.body.actual_selling_price] - Actual selling price
 * @returns {Promise<NextResponse>} Update response
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id: menuId, itemId: menuItemId } = await context.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch (err: unknown) {
      logger.warn('[Menu Item API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateMenuItemSchema.safeParse(body);
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

    // Validate request
    const validationError = validateMenuItemRequest(menuId, menuItemId);
    if (validationError) {
      return validationError;
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    const result = await updateMenuItem(
      menuId,
      menuItemId,
      validationResult.data as UpdateMenuItemInput,
    );
    if ('error' in result) {
      return NextResponse.json(result.error, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'INTERNAL_SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id: menuId, itemId: menuItemId } = await context.params;

    // Validate request
    const validationError = validateMenuItemRequest(menuId, menuItemId);
    if (validationError) {
      return validationError;
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    const result = await deleteMenuItem(menuId, menuItemId);
    if ('error' in result) {
      return NextResponse.json(result.error, { status: (result as any).status });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'INTERNAL_SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
