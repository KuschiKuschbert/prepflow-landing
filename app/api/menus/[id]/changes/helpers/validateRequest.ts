/**
 * Helper for validating menu changes API requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Validates authentication for menu changes API
 *
 * @param {NextRequest} request - Request object
 * @param {boolean} requireEmail - Whether to require user email
 * @returns {Promise<{ userEmail: string | null; error: NextResponse | null }>} User email and error if any
 */
export async function validateAuth(
  request: NextRequest,
  requireEmail: boolean = false,
): Promise<{ userEmail: string | null; error: NextResponse | null }> {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userEmail = (token?.email as string) || null;

    if (!userEmail && process.env.NODE_ENV === 'production' && requireEmail) {
      return {
        userEmail: null,
        error: NextResponse.json(
          ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
          { status: 401 },
        ),
      };
    }

    return { userEmail, error: null };
  } catch (tokenError) {
    if (process.env.NODE_ENV === 'production') {
      return {
        userEmail: null,
        error: NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        ),
      };
    }
    return { userEmail: null, error: null };
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

  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('id')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    return {
      exists: false,
      error: NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      }),
    };
  }

  return { exists: true, error: null };
}




