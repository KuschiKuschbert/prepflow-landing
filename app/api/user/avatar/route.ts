import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAvatar } from './helpers/getAvatar';
import { updateAvatar } from './helpers/updateAvatar';

const avatarSchema = z.object({
  avatar: z.string().nullable(),
});

/**
 * GET /api/user/avatar
 * Get current user's avatar preference
 *
 * @returns {Promise<NextResponse>} User avatar preference
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return await getAvatar(user.email);
  } catch (error) {
    logger.error('[Avatar API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

import { isValidAvatar } from '@/lib/avatars';

/**
 * PUT /api/user/avatar
 * Update user's avatar preference
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (validated against avatarSchema)
 * @param {string | null} req.body.avatar - Avatar ID (e.g., "avatar-01") or null
 * @returns {Promise<NextResponse>} Updated avatar preference
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = user.email;
    const body = await req.json().catch(() => ({}));
    const validationResult = avatarSchema.safeParse(body);

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

    const { avatar } = validationResult.data;

    // Validate avatar ID if provided
    if (avatar !== null && !isValidAvatar(avatar)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid avatar ID', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    return await updateAvatar(userEmail, avatar);
  } catch (error) {
    logger.error('[Avatar API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
