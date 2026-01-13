import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildMenuUpdateData } from './helpers/buildMenuUpdateData';
import { deleteMenu } from './helpers/deleteMenu';
import { fetchMenuWithItems } from './helpers/fetchMenuWithItems';
import { formatErrorResponse } from './helpers/formatErrorResponse';
import { handleMenuError } from './helpers/handleMenuError';
import { updateMenu } from './helpers/updateMenu';
import { validateMenuId } from './helpers/validateMenuId';

const updateMenuSchema = z.object({
  menu_name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const menuId = id;
  try {
    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    const menu = await fetchMenuWithItems(menuId);

    return NextResponse.json({
      success: true,
      menu,
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'GET', menuId },
    });
    if (typeof err === 'object' && err !== null && 'status' in err) {
      // @ts-ignore - Validated by runtime check
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const menuId = id;
  try {
    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Menus API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateMenuSchema.safeParse(body);
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

    const updateData = buildMenuUpdateData(validationResult.data);
    const updatedMenu = await updateMenu(menuId, updateData);

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu updated successfully',
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'PUT', menuId },
    });
    if (typeof err === 'object' && err !== null && 'status' in err) {
      // @ts-ignore - Validated by runtime check
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'PUT');
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const menuId = id;
  try {
    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    await deleteMenu(menuId);

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'DELETE', menuId },
    });
    if (typeof err === 'object' && err !== null && 'status' in err) {
      // @ts-ignore - Validated by runtime check
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'DELETE');
  }
}
