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

  // Safe logging - wrap in try-catch to prevent logging failures from crashing the request
  try {
    logger.info('[AI Specials API] GET request received', {
      requestId,
      url: request.url,
      method: request.method,
      hasAuthHeader: request.headers.get('authorization') ? true : false,
    });
  } catch (logErr) {
    // Logging failed, but continue with request processing
    // Try to log with logger first, fallback to safeLogger if logger itself failed
    try {
      logger.error('[AI Specials API] Logger failed:', logErr);
    } catch {
      // If logger.error also fails, use safeLogger (which uses console.error as last resort)
      safeLogger.error('[AI Specials API] Logger failed:', logErr);
    }
  }

  try {
    // Log authentication check
    try {
      logger.debug('[AI Specials API] Starting authentication check', { requestId });
    } catch (logErr) {
      try {
        logger.error('[AI Specials API] Logger failed in auth check:', logErr);
      } catch {
        safeLogger.error('[AI Specials API] Logger failed in auth check:', logErr);
      }
    }

    try {
      const user = await requireAuth(request);
      try {
        logger.info('[AI Specials API] Authentication successful', {
          requestId,
          userId: user.sub,
          email: user.email,
        });
      } catch (logErr) {
        try {
          logger.error('[AI Specials API] Logger failed after auth success:', logErr);
        } catch {
          safeLogger.error('[AI Specials API] Logger failed after auth success:', logErr);
        }
      }
    } catch (authErr) {
      // requireAuth throws NextResponse for auth errors, return it
      if (authErr instanceof NextResponse) {
        try {
          logger.error('[AI Specials API] Authentication failed (NextResponse)', {
            requestId,
            status: authErr.status,
          });
        } catch (logErr) {
          try {
            logger.error('[AI Specials API] Logger failed in auth error:', logErr);
          } catch {
            safeLogger.error('[AI Specials API] Logger failed in auth error:', logErr);
          }
        }
        return authErr;
      }
      try {
        logger.error('[AI Specials API] Authentication failed', {
          requestId,
          error: authErr instanceof Error ? authErr.message : String(authErr),
          isNextResponse: authErr instanceof NextResponse,
          errorType: authErr?.constructor?.name,
        });
      } catch (logErr) {
        try {
          logger.error('[AI Specials API] Logger failed in auth error logging:', logErr);
        } catch {
          safeLogger.error('[AI Specials API] Logger failed in auth error logging:', logErr);
        }
      }
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Log userId extraction
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    try {
      logger.debug('[AI Specials API] Extracted userId from query params', {
        requestId,
        userId: userId || 'MISSING',
      });
    } catch (logErr) {
      try {
        logger.error('[AI Specials API] Logger failed in userId extraction:', logErr);
      } catch {
        safeLogger.error('[AI Specials API] Logger failed in userId extraction:', logErr);
      }
    }

    if (!userId) {
      try {
        logger.warn('[AI Specials API] Missing userId in query params', { requestId });
      } catch (logErr) {
        try {
          logger.warn('[AI Specials API] Logger failed in missing userId warning:', logErr);
        } catch {
          safeLogger.warn('[AI Specials API] Logger failed in missing userId warning:', logErr);
        }
      }
      return NextResponse.json(
        ApiErrorHandler.createError('Please provide a valid user ID', 'MISSING_USER_ID', 400),
        { status: 400 },
      );
    }

    // Log before fetchAISpecialsHistory
    try {
      logger.info('[AI Specials API] Calling fetchAISpecialsHistory', {
        requestId,
        userId,
      });
    } catch (logErr) {
      try {
        logger.error('[AI Specials API] Logger failed before fetchAISpecialsHistory:', logErr);
      } catch {
        safeLogger.error('[AI Specials API] Logger failed before fetchAISpecialsHistory:', logErr);
      }
    }

    let result;
    try {
      result = await fetchAISpecialsHistory(userId, requestId);
    } catch (fetchErr) {
      // fetchAISpecialsHistory threw an unexpected error
      try {
        logger.error('[AI Specials API] fetchAISpecialsHistory threw unexpected error', {
          requestId,
          userId,
          error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
          stack: fetchErr instanceof Error ? fetchErr.stack : undefined,
        });
      } catch (logErr) {
        try {
          logger.error('[AI Specials API] Logger failed in fetchAISpecialsHistory error:', logErr);
        } catch {
          safeLogger.error(
            '[AI Specials API] Logger failed in fetchAISpecialsHistory error:',
            logErr,
          );
        }
      }
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch AI specials history', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    try {
      logger.info('[AI Specials API] fetchAISpecialsHistory completed', {
        requestId,
        userId,
        isErrorResponse: result instanceof NextResponse,
        hasData: !(result instanceof NextResponse) && result?.data ? true : false,
        dataCount: !(result instanceof NextResponse) && result?.data ? result.data.length : 0,
      });
    } catch (logErr) {
      try {
        logger.error('[AI Specials API] Logger failed after fetchAISpecialsHistory:', logErr);
      } catch {
        safeLogger.error('[AI Specials API] Logger failed after fetchAISpecialsHistory:', logErr);
      }
    }

    if (result instanceof NextResponse) {
      try {
        logger.warn('[AI Specials API] fetchAISpecialsHistory returned error response', {
          requestId,
          userId,
          status: result.status,
        });
      } catch (logErr) {
        try {
          logger.warn('[AI Specials API] Logger failed in error response warning:', logErr);
        } catch {
          safeLogger.warn('[AI Specials API] Logger failed in error response warning:', logErr);
        }
      }
      return result;
    }

    try {
      logger.info('[AI Specials API] Preparing successful response', {
        requestId,
        userId,
        dataCount: result.data?.length || 0,
      });
    } catch (logErr) {
      try {
        logger.error('[AI Specials API] Logger failed in success response logging:', logErr);
      } catch {
        safeLogger.error('[AI Specials API] Logger failed in success response logging:', logErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    // Defensive error handling - try to log, but don't fail if logging fails
    try {
      logger.error('[AI Specials API] GET handler catch block', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error?.constructor?.name,
        isNextResponse: error instanceof NextResponse,
      });
    } catch (logErr) {
      // Logger failed, try safe logger as fallback
      try {
        logger.error('[AI Specials API] GET handler error (logger failed):', {
          requestId,
          originalError: error instanceof Error ? error.message : String(error),
          logError: logErr instanceof Error ? logErr.message : String(logErr),
        });
      } catch {
        safeLogger.error('[AI Specials API] GET handler error (logger failed):', {
          requestId,
          originalError: error instanceof Error ? error.message : String(error),
          logError: logErr instanceof Error ? logErr.message : String(logErr),
        });
      }
    }

    // Always return a proper response, even if error handling fails
    try {
      return handleAISpecialsError(error, 'GET', { requestId });
    } catch (handlerErr) {
      // Error handler itself failed, return a basic error response
      try {
        logger.error('[AI Specials API] Error handler failed:', handlerErr);
      } catch {
        safeLogger.error('[AI Specials API] Error handler failed:', handlerErr);
      }
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
