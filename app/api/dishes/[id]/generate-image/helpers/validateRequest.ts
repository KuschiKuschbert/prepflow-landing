/**
 * Request validation and authentication helpers
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate dish ID from route params
 *
 * @param {string | undefined} dishId - Dish ID from route params
 * @returns {NextResponse | null} Error response if invalid, null if valid
 */
export function validateDishId(dishId: string | undefined): NextResponse | null {
  if (!dishId) {
    return NextResponse.json(
      ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }
  return null;
}

/**
 * Authenticate request and get user ID
 *
 * @param {NextRequest} req - Next.js request object
 * @returns {Promise<{userId: string} | NextResponse>} User ID or error response
 */
export async function authenticateRequest(
  req: NextRequest,
): Promise<{ userId: string } | NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user || !user.sub) {
    return NextResponse.json(
      ApiErrorHandler.createError('Authentication required', 'AUTH_ERROR', 401),
      { status: 401 },
    );
  }
  return { userId: user.sub };
}

/**
 * Check if AI service is enabled
 *
 * @returns {Promise<NextResponse | null>} Error response if disabled, null if enabled
 */
export async function validateAIService(): Promise<NextResponse | null> {
  const { isAIEnabled } = await import('@/lib/ai/huggingface-client');
  if (!isAIEnabled()) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Image generation service is not available. Please configure HUGGINGFACE_API_KEY to generate images.',
        'SERVICE_UNAVAILABLE',
        503,
      ),
      { status: 503 },
    );
  }
  return null;
}

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validate database connection
 *
 * @param {SupabaseClient | null} supabaseAdmin - Supabase admin client
 * @returns {NextResponse | null} Error response if unavailable, null if available
 */
export function validateDatabase(supabaseAdmin: SupabaseClient | null): NextResponse | null {

  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }
  return null;
}
