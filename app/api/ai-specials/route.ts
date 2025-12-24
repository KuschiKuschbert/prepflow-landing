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
  try {
    // Check feature access (requires Pro tier)
    try {
      const user = await requireAuth(request);
      await checkFeatureAccess('ai_specials', user.email, request);
    } catch (error) {
      // checkFeatureAccess throws NextResponse, so return it
      if (error instanceof NextResponse) {
        return error;
      }
      // If requireAuth throws, it's already a NextResponse, so rethrow
      throw error;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[AI Specials API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = aiSpecialsSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const validationResult = validateAISpecialsRequest(zodValidation.data);
    if (validationResult instanceof NextResponse) return validationResult;

    const { userId, imageData, prompt, countryCode } = validationResult;

    // Generate AI specials
    const aiResponse = await generateAISpecials(imageData, prompt, countryCode);

    // Save to database
    const saveResult = await saveAISpecials(userId, imageData, prompt, aiResponse);
    if (saveResult instanceof NextResponse) return saveResult;

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
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleAISpecialsError(error, 'POST');
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
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Please provide a valid user ID', 'MISSING_USER_ID', 400),
        { status: 400 },
      );
    }

    const result = await fetchAISpecialsHistory(userId);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleAISpecialsError(error, 'GET');
  }
}
