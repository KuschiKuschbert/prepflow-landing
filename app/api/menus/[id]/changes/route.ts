/**
 * Menu Changes API Endpoint
 * GET /api/menus/[id]/changes - Get all unhandled changes for menu
 * POST /api/menus/[id]/changes/handle - Mark changes as handled
 * DELETE /api/menus/[id]/changes - Clear all changes (admin/debug)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import {
  getMenuChanges,
  markChangesHandled,
  clearMenuChanges,
} from '@/lib/menu-lock/change-tracking';

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

    // Get user email for auth (optional for development)
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token?.email && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
          { status: 401 },
        );
      }
    } catch (tokenError) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        );
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify menu exists
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
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

    // Get user email for auth
    let userEmail: string | null = null;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      userEmail = (token?.email as string) || null;
      if (!userEmail && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
          { status: 401 },
        );
      }
    } catch (tokenError) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        );
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify menu exists
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
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

    // Get user email for auth
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token?.email && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
          { status: 401 },
        );
      }
    } catch (tokenError) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        );
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify menu exists
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
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
