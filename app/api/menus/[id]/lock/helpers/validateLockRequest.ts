/**
 * Helper for validating menu lock/unlock requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Validates authentication for menu lock operations
 *
 * @param {NextRequest} request - Request object
 * @param {string} menuId - Menu ID
 * @returns {Promise<{ userEmail: string | null; error: NextResponse | null }>} User email and error if any
 */
export async function validateAuth(
  request: NextRequest,
  menuId: string,
): Promise<{ userEmail: string | null; error: NextResponse | null }> {
  let token;
  try {
    token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  } catch (tokenError) {
    logger.error('[Menu Lock API] Error getting token:', {
      error: tokenError instanceof Error ? tokenError.message : String(tokenError),
      menuId,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
    });
    return {
      userEmail: null,
      error: NextResponse.json(
        ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
        { status: 401 },
      ),
    };
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
    logger.warn('[Menu Lock API] Unauthorized attempt:', {
      menuId,
      hasToken: !!token,
      hasEmail: !!token?.email,
      cookies: request.headers.get('cookie') ? 'present' : 'missing',
      nodeEnv: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
    });
    return {
      userEmail: null,
      error: NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      }),
    };
  }

  return { userEmail: token.email as string, error: null };
}

/**
 * Validates menu exists
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<{ exists: boolean; error: NextResponse | null }>} Existence status and error if any
 */
export async function validateMenuExists(
  menuId: string,
): Promise<{ exists: boolean; error: NextResponse | null }> {
  if (!supabaseAdmin) {
    return {
      exists: false,
      error: NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      ),
    };
  }

  const { data: menus, error: fetchError } = await supabaseAdmin
    .from('menus')
    .select('id')
    .eq('id', menuId);

  if (fetchError || !menus || menus.length === 0) {
    return {
      exists: false,
      error: NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      }),
    };
  }

  return { exists: true, error: null };
}
