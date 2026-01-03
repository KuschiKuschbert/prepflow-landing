import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';
import { handleAISpecialsError } from './handleAISpecialsError';
import { fetchAISpecialsHistory } from './fetchAISpecialsHistory';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { safeLogger } from './safeLogger';

/**
 * Handle GET request for AI specials history
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} AI specials history response
 */
export async function handleGetRequest(request: NextRequest): Promise<NextResponse> {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  logger.info('[AI Specials API] GET request received', {
    requestId,
    url: request.url,
    method: request.method,
    hasAuthHeader: request.headers.get('authorization') ? true : false,
  });

  try {
    logger.debug('[AI Specials API] Starting authentication check', { requestId });

    try {
      const user = await requireAuth(request);
      logger.info('[AI Specials API] Authentication successful', {
        requestId,
        userId: user.sub,
        email: user.email,
      });
    } catch (authErr) {
      // requireAuth throws NextResponse for auth errors, return it
      if (authErr instanceof NextResponse) {
        logger.error('[AI Specials API] Authentication failed (NextResponse)', {
          requestId,
          status: authErr.status,
        });
        return authErr;
      }
      logger.error('[AI Specials API] Authentication failed', {
        requestId,
        error: authErr instanceof Error ? authErr.message : String(authErr),
        isNextResponse: authErr instanceof NextResponse,
        errorType: authErr?.constructor?.name,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Log userId extraction
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    logger.debug('[AI Specials API] Extracted userId from query params', {
      requestId,
      userId: userId || 'MISSING',
    });

    if (!userId) {
      logger.warn('[AI Specials API] Missing userId in query params', { requestId });
      return NextResponse.json(
        ApiErrorHandler.createError('Please provide a valid user ID', 'MISSING_USER_ID', 400),
        { status: 400 },
      );
    }

    // Log before fetchAISpecialsHistory
    logger.info('[AI Specials API] Calling fetchAISpecialsHistory', {
      requestId,
      userId,
    });

    let result;
    try {
      result = await fetchAISpecialsHistory(userId, requestId);
    } catch (fetchErr) {
      // fetchAISpecialsHistory threw an unexpected error
      logger.error('[AI Specials API] fetchAISpecialsHistory threw unexpected error', {
        requestId,
        userId,
        error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
        stack: fetchErr instanceof Error ? fetchErr.stack : undefined,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch AI specials history', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    logger.info('[AI Specials API] fetchAISpecialsHistory completed', {
      requestId,
      userId,
      isErrorResponse: result instanceof NextResponse,
      hasData: !(result instanceof NextResponse) && result?.data ? true : false,
      dataCount: !(result instanceof NextResponse) && result?.data ? result.data.length : 0,
    });

    if (result instanceof NextResponse) {
      logger.warn('[AI Specials API] fetchAISpecialsHistory returned error response', {
        requestId,
        userId,
        status: result.status,
      });
      return result;
    }

    logger.info('[AI Specials API] Preparing successful response', {
      requestId,
      userId,
      dataCount: result.data?.length || 0,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    // Top-level error handling - use safeLogger as fallback if logger fails
    try {
      logger.error('[AI Specials API] GET handler catch block', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error?.constructor?.name,
        isNextResponse: error instanceof NextResponse,
      });
    } catch (logErr) {
      // Logger failed, use safeLogger as last resort
      safeLogger.error('[AI Specials API] GET handler error (logger failed):', {
        requestId,
        originalError: error instanceof Error ? error.message : String(error),
        logError: logErr instanceof Error ? logErr.message : String(logErr),
      });
    }

    // Always return a proper response, even if error handling fails
    try {
      return handleAISpecialsError(error, 'GET', { requestId });
    } catch (handlerErr) {
      // Error handler itself failed, return a basic error response
      safeLogger.error('[AI Specials API] Error handler failed:', handlerErr);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Something went wrong while processing your request. Give it another go, chef.',
          requestId,
        },
        { status: 500 },
      );
    }
  }
}
