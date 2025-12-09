/**
 * Request validation and authentication for recipe image generation
 */

import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { PlatingMethod } from '@/lib/ai/ai-service/image-generation';

export interface ValidatedRequest {
  recipeId: string;
  userId: string;
  selectedPlatingMethods?: PlatingMethod[];
}

export async function validateRequest(
  req: NextRequest,
  recipeId: string,
): Promise<NextResponse | ValidatedRequest> {
  // Parse request body to get optional platingMethods array
  let selectedPlatingMethods: PlatingMethod[] | undefined;
  try {
    const body = await req.json().catch(() => ({}));
    if (
      body.platingMethods &&
      Array.isArray(body.platingMethods) &&
      body.platingMethods.length > 0
    ) {
      const validMethods: PlatingMethod[] = ['classic', 'landscape', 'deconstructed', 'stacking'];
      selectedPlatingMethods = body.platingMethods.filter(
        (method: string): method is PlatingMethod => validMethods.includes(method as PlatingMethod),
      );

      logger.dev('[Recipe Image Generation] Parsed plating methods from request:', {
        raw: body.platingMethods,
        validated: selectedPlatingMethods,
        recipeId,
      });
    }
  } catch (error) {
    logger.dev('[Recipe Image Generation] Failed to parse request body:', {
      error: error instanceof Error ? error.message : String(error),
      recipeId,
    });
  }

  if (!recipeId) {
    return NextResponse.json(
      ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  // Check authentication
  let token;
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (tokenError) {
    logger.error('[Recipe Image Generation] Error getting token:', {
      error: tokenError instanceof Error ? tokenError.message : String(tokenError),
      recipeId,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
    });
    if (process.env.NODE_ENV === 'development') {
      token = null;
    } else {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }
  }

  if (process.env.NODE_ENV === 'development') {
    logger.dev('[Recipe Image Generation] Auth check:', {
      hasToken: !!token,
      tokenEmail: token?.email,
      tokenSub: token?.sub,
      cookies: req.headers.get('cookie') ? 'present' : 'missing',
    });
  }

  const userId =
    token?.email || token?.sub || (process.env.NODE_ENV === 'development' ? 'dev-user' : null);

  if (!userId && process.env.NODE_ENV === 'production') {
    logger.warn('[Recipe Image Generation] Unauthorized attempt:', {
      recipeId,
      hasToken: !!token,
      cookies: req.headers.get('cookie') ? 'present' : 'missing',
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Authentication required', 'AUTH_ERROR', 401),
      { status: 401 },
    );
  }

  return {
    recipeId,
    userId: userId || 'anonymous',
    selectedPlatingMethods,
  };
}
