/**
 * Menu Lock API Endpoint
 * POST /api/menus/[id]/lock - Lock menu
 * DELETE /api/menus/[id]/lock - Unlock menu
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getMenuChanges } from '@/lib/menu-lock/change-tracking';
import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeCardsForMenu } from './helpers/generateRecipeCards';
import { checkLockStatus, lockMenu, unlockMenu } from './helpers/lockOperations';
import { validateAuth, validateMenuExists } from './helpers/validateLockRequest';

/**
 * Lock a menu to prevent modifications.
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} context - Route context containing params
 * @param {Promise<{id: string}>} context.params - Route parameters containing menu ID
 * @returns {Promise<NextResponse>} Response with locked menu data or error
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
    const { userEmail, error: authError } = await validateAuth(request, menuId);
    if (authError) {
      return authError;
    }
    if (!userEmail) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }

    // Validate menu exists
    const { error: menuError } = await validateMenuExists(menuId);
    if (menuError) {
      return menuError;
    }

    // Check if already locked
    const { isLocked, error: lockStatusError } = await checkLockStatus(menuId);
    if (lockStatusError) {
      return lockStatusError;
    }
    if (isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is already locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Lock menu
    const { menu, error: lockError } = await lockMenu(menuId, userEmail);
    if (lockError) {
      return lockError;
    }

    // Generate recipe cards in background (non-blocking)
    // Fire and forget - don't wait for generation to complete
    // This allows the lock response to return immediately while cards generate in background
    (async () => {
      try {
        await generateRecipeCardsForMenu(menuId);
      } catch (genError) {
        logger.error('[Menu Lock API] Failed to generate recipe cards during lock (background):', {
          error: genError instanceof Error ? genError.message : String(genError),
          context: { menuId, operation: 'generateRecipeCardsForMenu' },
        });
        // We don't fail the lock request if card generation fails, but we log it.
      }
    })();

    return NextResponse.json({
      success: true,
      menu,
      message: 'Menu locked successfully. Recipe cards are being generated in the background.',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus/[id]/lock', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to lock menu',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

/**
 * Unlock a menu to allow modifications.
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} context - Route context containing params
 * @param {Promise<{id: string}>} context.params - Route parameters containing menu ID
 * @returns {Promise<NextResponse>} Response with unlocked menu data or error
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
    const { error: authError } = await validateAuth(request, menuId);
    if (authError) {
      return authError;
    }

    // Validate menu exists
    const { error: menuError } = await validateMenuExists(menuId);
    if (menuError) {
      return menuError;
    }

    // Check if locked
    const { isLocked, error: lockStatusError } = await checkLockStatus(menuId);
    if (lockStatusError) {
      return lockStatusError;
    }
    if (!isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is not locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check for unhandled changes before unlocking
    const changes = await getMenuChanges(menuId);

    // Unlock menu
    const { menu, error: unlockError } = await unlockMenu(menuId);
    if (unlockError) {
      return unlockError;
    }

    // Return changes if any exist
    if (changes.length > 0) {
      return NextResponse.json({
        success: true,
        menu,
        hasChanges: true,
        changes,
        message: 'Menu unlocked successfully. Changes detected while menu was locked.',
      });
    }

    return NextResponse.json({
      success: true,
      menu,
      hasChanges: false,
      message: 'Menu unlocked successfully',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus/[id]/lock', method: 'DELETE' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to unlock menu',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
