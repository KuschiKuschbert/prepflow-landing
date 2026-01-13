/**
 * Helper for validating menu lock/unlock requests
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserEmail as getEmailFromAuth0 } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';
const authBypassDev = process.env.AUTH0_BYPASS_DEV === 'true';

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
  try {
    const userEmail = await getEmailFromAuth0(request);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      logger.dev('[Menu Lock API] Auth check:', {
        hasEmail: !!userEmail,
        cookies: request.headers.get('cookie') ? 'present' : 'missing',
        menuId,
      });
    }

    if (!userEmail && !(isDev && authBypassDev)) {
      logger.warn('[Menu Lock API] Unauthorized attempt:', {
        menuId,
        hasEmail: !!userEmail,
        cookies: request.headers.get('cookie') ? 'present' : 'missing',
        nodeEnv: process.env.NODE_ENV,
      });
      return {
        userEmail: null,
        error: NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
          status: 401,
        }),
      };
    }

    return { userEmail, error: null };
  } catch (tokenError: unknown) {
    logger.error('[Menu Lock API] Error getting user email:', {
      error: tokenError instanceof Error ? tokenError.message : String(tokenError),
      menuId,
    });
    return {
      userEmail: null,
      error: NextResponse.json(
        ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
        { status: 401 },
      ),
    };
  }
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
