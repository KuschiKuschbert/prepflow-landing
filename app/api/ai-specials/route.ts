import { checkFeatureAccess } from '@/lib/api-feature-gate';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';
import { handleAISpecialsError } from './helpers/handleAISpecialsError';
import { validateAISpecialsRequest } from './helpers/validateRequest';
import { generateAISpecials } from './helpers/generateAISpecials';
import { saveAISpecials } from './helpers/saveAISpecials';
import { z } from 'zod';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const aiSpecialsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  imageData: z.string().min(1, 'Image data is required'),
  prompt: z.string().optional(),
  countryCode: z.string().optional().default('AU'),
});

/**
 * POST /api/ai-specials
 * Generate AI-powered specials suggestions from image analysis
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.userId - User ID
 * @param {string} request.body.imageData - Image data (data URL or public URL)
 * @param {string} [request.body.prompt] - Optional prompt
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} AI specials response
 */
export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  logger.info('[AI Specials API] POST request received', {
    requestId,
    url: request.url,
    method: request.method,
    hasAuthHeader: request.headers.get('authorization') ? true : false,
  });

  try {
    // Check feature access (requires Pro tier)
    logger.debug('[AI Specials API] Starting authentication and feature check', { requestId });
    try {
      const user = await requireAuth(request);
      logger.info('[AI Specials API] Authentication successful', {
        requestId,
        userId: user.sub,
        email: user.email,
      });
      await checkFeatureAccess('ai_specials', user.email, request);
      logger.info('[AI Specials API] Feature access check passed', { requestId });
    } catch (error) {
      // checkFeatureAccess throws NextResponse, so return it
      if (error instanceof NextResponse) {
        logger.warn('[AI Specials API] Feature access check failed (NextResponse)', {
          requestId,
          status: error.status,
        });
        return error;
      }
      // If requireAuth throws, it's already a NextResponse, so rethrow
      logger.error('[AI Specials API] Authentication or feature check failed', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        isNextResponse: error instanceof NextResponse,
      });
      throw error;
    }

    let body: unknown;
    try {
      logger.debug('[AI Specials API] Parsing request body', { requestId });
      body = await request.json();
      logger.debug('[AI Specials API] Request body parsed successfully', { requestId });
    } catch (err) {
      logger.warn('[AI Specials API] Failed to parse request body:', {
        requestId,
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    logger.debug('[AI Specials API] Validating request body with Zod schema', { requestId });
    const zodValidation = aiSpecialsSchema.safeParse(body);
    if (!zodValidation.success) {
      logger.warn('[AI Specials API] Zod validation failed', {
        requestId,
        errors: zodValidation.error.issues,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    logger.debug('[AI Specials API] Validating AI specials request', { requestId });
    const validationResult = validateAISpecialsRequest(zodValidation.data);
    if (validationResult instanceof NextResponse) {
      logger.warn('[AI Specials API] AI specials validation failed', {
        requestId,
        status: validationResult.status,
      });
      return validationResult;
    }

    const { userId, imageData, prompt, countryCode } = validationResult;
    logger.info('[AI Specials API] Request validated, generating AI specials', {
      requestId,
      userId,
      hasPrompt: !!prompt,
      countryCode,
    });

    // Generate AI specials
    logger.debug('[AI Specials API] Calling generateAISpecials', { requestId, userId });
    const aiResponse = await generateAISpecials(imageData, prompt, countryCode);
    logger.info('[AI Specials API] AI specials generated successfully', {
      requestId,
      userId,
      hasSuggestions: !!aiResponse?.suggestions,
      suggestionsCount: aiResponse?.suggestions?.length || 0,
    });

    // Save to database
    logger.debug('[AI Specials API] Saving AI specials to database', { requestId, userId });
    const saveResult = await saveAISpecials(userId, imageData, prompt, aiResponse, requestId);
    if (saveResult instanceof NextResponse) {
      logger.warn('[AI Specials API] Save operation returned error response', {
        requestId,
        userId,
        status: saveResult.status,
      });
      return saveResult;
    }

    logger.info('[AI Specials API] POST request completed successfully', {
      requestId,
      userId,
      recordId: saveResult.aiRecord?.id,
    });

    return NextResponse.json({
      success: true,
      message: 'AI specials generated successfully',
      data: {
        aiRecord: saveResult.aiRecord,
        suggestions: aiResponse.suggestions,
        ingredients: aiResponse.ingredients,
      },
    });
  } catch (error) {
    logger.error('[AI Specials API] POST handler catch block', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
      isNextResponse: error instanceof NextResponse,
    });

    return handleAISpecialsError(error, 'POST', { requestId, url: request.url });
  }
}

import { fetchAISpecialsHistory } from './helpers/fetchAISpecialsHistory';

/**
 * GET /api/ai-specials
 * Fetch AI specials history for a user
 *
 * @param {NextRequest} request - Request object
 * @param {string} request.url - Request URL with search params
 * @param {string} request.url.searchParams.userId - User ID query parameter
 * @returns {Promise<NextResponse>} AI specials history response
 */
export async function GET(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  logger.info('[AI Specials API] GET request received', {
    requestId,
    url: request.url,
    method: request.method,
    hasAuthHeader: request.headers.get('authorization') ? true : false,
  });

  try {
    // Log authentication check
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

    const result = await fetchAISpecialsHistory(userId, requestId);

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
    logger.error('[AI Specials API] GET handler catch block', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
      isNextResponse: error instanceof NextResponse,
    });

    return handleAISpecialsError(error, 'GET', { requestId });
  }
}
