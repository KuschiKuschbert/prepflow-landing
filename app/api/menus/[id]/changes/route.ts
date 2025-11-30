/**
 * Menu Changes API Endpoint
 * GET /api/menus/[id]/changes - Get all unhandled changes for menu
 * POST /api/menus/[id]/changes/handle - Mark changes as handled
 * DELETE /api/menus/[id]/changes - Clear all changes (admin/debug)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import {
  getMenuChanges,
  markChangesHandled,
  clearMenuChanges,
} from '@/lib/menu-lock/change-tracking';
import { validateAuth, validateMenuExists } from './helpers/validateRequest';

/**
 * GET /api/menus/[id]/changes
 * Get all unhandled changes for a menu
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate authentication
    const { error: authError } = await validateAuth(request, false);
    if (authError) {
      return authError;
    }

    // Validate menu exists
    const { error: menuError } = await validateMenuExists(menuId);
    if (menuError) {
      return menuError;
    }

    const changes = await getMenuChanges(menuId);

    return NextResponse.json({
      success: true,
      changes,
      count: changes.length,
    });
  } catch (err) {
    logger.error('[Menu Changes API] Error getting changes:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to get menu changes',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

/**
 * POST /api/menus/[id]/changes/handle
 * Mark changes as handled
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate authentication
    const { error: authError } = await validateAuth(request, true);
    if (authError) {
      return authError;
    }

    // Validate menu exists
    const { error: menuError } = await validateMenuExists(menuId);
    if (menuError) {
      return menuError;
    }

    await markChangesHandled(menuId);

    return NextResponse.json({
      success: true,
      message: 'Changes marked as handled',
    });
  } catch (err) {
    logger.error('[Menu Changes API] Error marking changes as handled:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to mark changes as handled',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/menus/[id]/changes
 * Clear all changes for a menu (admin/debug)
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate authentication
    const { error: authError } = await validateAuth(request, false);
    if (authError) {
      return authError;
    }

    // Validate menu exists
    const { error: menuError } = await validateMenuExists(menuId);
    if (menuError) {
      return menuError;
    }

    await clearMenuChanges(menuId);

    return NextResponse.json({
      success: true,
      message: 'All changes cleared',
    });
  } catch (err) {
    logger.error('[Menu Changes API] Error clearing changes:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to clear changes',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}


