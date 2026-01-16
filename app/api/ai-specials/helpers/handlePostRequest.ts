import { ApiErrorHandler } from '@/lib/api-error-handler';
import { checkFeatureAccess } from '@/lib/api-feature-gate';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAISpecials } from './generateAISpecials';
import { handleAISpecialsError } from './handleAISpecialsError';
import { saveAISpecials } from './saveAISpecials';
import { validateAISpecialsRequest } from './validateRequest';

const aiSpecialsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'), // Will be set from session
  imageData: z.string().min(1, 'Image data is required'),
  prompt: z.string().optional(),
  countryCode: z.string().optional().default('AU'),
});

/**
 * Handle POST request for AI specials generation
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} AI specials response
 */
export async function handlePostRequest(request: NextRequest): Promise<NextResponse> {
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
    let user;
    try {
      user = await requireAuth(request);
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
    // Use session user ID instead of body userId for security (prevents users from accessing other users' data)
    const bodyObj = body && typeof body === 'object' ? body : {};
    const bodyWithSessionUserId = { ...bodyObj, userId: user.sub };
    const zodValidation = aiSpecialsSchema.safeParse(bodyWithSessionUserId);
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
    const aiResponse = (await generateAISpecials(imageData, prompt, countryCode)) as {
      suggestions?: string[];
      ingredients?: unknown[];
    };
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
      recordId: (saveResult.aiRecord as { id: string })?.id,
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
