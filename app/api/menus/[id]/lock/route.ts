/**
 * Menu Lock API Endpoint
 * POST /api/menus/[id]/lock - Lock menu
 * DELETE /api/menus/[id]/lock - Unlock menu
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import { getMenuChanges } from '@/lib/menu-lock/change-tracking';

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
    // Use getToken (same as middleware) for consistent auth checking in App Router
    let token;
    try {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    } catch (tokenError) {
      logger.error('[Menu Lock API] Error getting token:', {
        error: tokenError instanceof Error ? tokenError.message : String(tokenError),
        menuId,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      logger.dev('[Menu Lock API] Token check:', {
        hasToken: !!token,
        tokenKeys: token ? Object.keys(token) : [],
        hasEmail: !!token?.email,
        cookies: request.headers.get('cookie') ? 'present' : 'missing',
        cookieHeader: request.headers.get('cookie')?.substring(0, 100) || 'none',
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
    }

    if (!token?.email) {
      logger.warn('[Menu Lock API] Unauthorized lock attempt:', {
        menuId,
        hasToken: !!token,
        hasEmail: !!token?.email,
        cookies: request.headers.get('cookie') ? 'present' : 'missing',
        nodeEnv: process.env.NODE_ENV,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }
    const userEmail = token.email as string;
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);
    if (fetchError || !menus || menus.length === 0) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked, locked_at, locked_by')
      .eq('id', menuId)
      .single();
    const isLocked = lockStatusError?.code === '42703' ? false : menuWithLock?.is_locked || false;
    if (isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is already locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    const migrationError = ApiErrorHandler.createError(
      'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
      'MIGRATION_REQUIRED',
      503,
    );
    if (lockStatusError?.code === '42703') {
      return NextResponse.json(migrationError, { status: 503 });
    }
    // Update menu with lock information
    // Note: locked_by stores email address (VARCHAR), not UUID
    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update({
        is_locked: true,
        locked_at: new Date().toISOString(),
        locked_by: userEmail,
      })
      .eq('id', menuId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === '42703') return NextResponse.json(migrationError, { status: 503 });

      // Handle type mismatch if locked_by column is still UUID type
      // This happens if migration hasn't been run or column type wasn't updated
      if (
        updateError.message?.includes('locked_by') ||
        updateError.code === '42804' ||
        updateError.message?.includes('invalid input syntax for type uuid')
      ) {
        logger.error('[Menu Lock API] locked_by column type mismatch - migration needed:', {
          menuId,
          userEmail,
          error: updateError.message,
          code: updateError.code,
          hint: 'Run migrations/add-menu-lock.sql to update locked_by column to VARCHAR',
        });
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Database schema mismatch: locked_by column needs to be VARCHAR. Please run migrations/add-menu-lock.sql',
            'MIGRATION_REQUIRED',
            503,
          ),
          { status: 503 },
        );
      }

      logger.error('[Menu Lock API] Database error:', {
        error: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        menuId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Failed to lock menu: ${updateError.message || 'Database error'}`,
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }
    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu locked successfully',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', err);
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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    // Use getToken (same as middleware) for consistent auth checking in App Router
    let token;
    try {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    } catch (tokenError) {
      logger.error('[Menu Lock API] Error getting token:', {
        error: tokenError instanceof Error ? tokenError.message : String(tokenError),
        menuId,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    if (!token?.email) {
      logger.warn('[Menu Lock API] Unauthorized unlock attempt:', {
        menuId,
        hasToken: !!token,
        hasEmail: !!token?.email,
        cookies: request.headers.get('cookie') ? 'present' : 'missing',
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      });
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }
    const userEmail = token.email as string;
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);
    if (fetchError || !menus || menus.length === 0) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked')
      .eq('id', menuId)
      .single();
    if (lockStatusError?.code === '42703') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
          'MIGRATION_REQUIRED',
          503,
        ),
        { status: 503 },
      );
    }
    const isLocked = lockStatusError?.code === '42703' ? false : menuWithLock?.is_locked || false;
    if (!isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is not locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    // Check for unhandled changes before unlocking
    const changes = await getMenuChanges(menuId);

    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update({
        is_locked: false,
        locked_at: null,
        locked_by: null,
      })
      .eq('id', menuId)
      .select()
      .single();
    if (updateError) {
      logger.error('[Menu Lock API] Database error unlocking menu:', {
        error: updateError.message,
        menuId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to unlock menu', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Return changes if any exist
    if (changes.length > 0) {
      return NextResponse.json({
        success: true,
        menu: updatedMenu,
        hasChanges: true,
        changes,
        message: 'Menu unlocked successfully. Changes detected while menu was locked.',
      });
    }

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      hasChanges: false,
      message: 'Menu unlocked successfully',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', err);
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
