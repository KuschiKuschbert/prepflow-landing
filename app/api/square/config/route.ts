/**
 * Square Configuration API Routes
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (API Endpoints section) for
 * comprehensive API documentation, request/response formats, and usage examples.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getSquareConfig, saveSquareConfig, deleteSquareConfig } from '@/lib/square/config';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getUserIdFromEmail } from './helpers/getUserId';
import { handleSquareConfigError } from './helpers/handleError';
import { checkSquareFeatureFlag } from './helpers/checkFeatureFlag';
import { z } from 'zod';

/**
 * GET /api/square/config
 * Get Square configuration for current user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    // Check feature flag
    const featureFlagError = await checkSquareFeatureFlag(user.email);
    if (featureFlagError) return featureFlagError;

    const userId = await getUserIdFromEmail(user.email);
    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User not found in database', 'USER_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const config = await getSquareConfig(userId);

    return NextResponse.json({
      success: true,
      config: config
        ? {
            ...config,
            square_access_token_encrypted: undefined, // Don't send encrypted token to client
          }
        : null,
    });
  } catch (error) {
    logger.error('[Square Config API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/config', method: 'GET' },
    });
    return handleSquareConfigError(error);
  }
}

const squareConfigSchema = z.object({
  square_location_id: z.string().min(1).optional(),
  square_access_token_encrypted: z.string().optional(),
  square_application_id: z.string().optional(),
  square_application_secret: z.string().optional(),
  sync_enabled: z.boolean().optional(),
  sync_direction: z.enum(['from_square', 'to_square', 'bidirectional']).optional(),
  auto_sync_interval: z.number().int().positive().optional(),
}).passthrough(); // Allow additional fields

/**
 * POST /api/square/config
 * Save Square configuration for current user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    // Check feature flag
    const featureFlagError = await checkSquareFeatureFlag(user.email);
    if (featureFlagError) return featureFlagError;

    const userId = await getUserIdFromEmail(user.email);
    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User not found in database', 'USER_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Square Config API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = squareConfigSchema.safeParse(body);
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

    const config = await saveSquareConfig(userId, validationResult.data);

    if (!config) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to save Square configuration', 'SAVE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        square_access_token_encrypted: undefined, // Don't send encrypted token to client
      },
    });
  } catch (error) {
    logger.error('[Square Config API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/config', method: 'POST' },
    });
    return handleSquareConfigError(error);
  }
}

/**
 * DELETE /api/square/config
 * Delete Square configuration for current user
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    // Check feature flag
    const featureFlagError = await checkSquareFeatureFlag(user.email);
    if (featureFlagError) return featureFlagError;

    const userId = await getUserIdFromEmail(user.email);
    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User not found in database', 'USER_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const deleted = await deleteSquareConfig(userId);

    if (!deleted) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to delete Square configuration', 'DELETE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Square configuration deleted',
    });
  } catch (error) {
    logger.error('[Square Config API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/config', method: 'DELETE' },
    });
    return handleSquareConfigError(error);
  }
}
