import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from './helpers/getProfile';
import { updateProfile } from './helpers/updateProfile';
import { z } from 'zod';

/**
 * GET /api/user/profile
 * Get current user's profile information
 *
 * @returns {Promise<NextResponse>} User profile data
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return await getProfile(user.email);
  } catch (error) {
    logger.error('[Profile API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/profile', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * PUT /api/user/profile
 * Update current user's profile information
 *
 * @param {NextRequest} req - Request object with profile data
 * @returns {Promise<NextResponse>} Updated profile data
 */
const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatar_url: z.string().url().optional().nullable(),
  timezone: z.string().optional(),
  language: z.string().optional(),
}).passthrough(); // Allow additional fields for profile updates

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    let body: unknown;
    try {
      body = await req.json();
    } catch (err) {
      logger.warn('[Profile API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateProfileSchema.safeParse(body);
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

    return await updateProfile(userEmail, validationResult.data);
  } catch (error) {
    logger.error('[Profile API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/profile', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
