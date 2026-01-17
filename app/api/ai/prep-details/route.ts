/**
 * Prep Details AI API Endpoint
 *
 * Analyzes recipes to extract detailed prep information (cut shapes, sauces, marination, etc.)
 */

import { generateAIResponse } from '@/lib/ai/ai-service';
import { buildPrepDetailsPrompt } from '@/lib/ai/prompts/prep-details';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { mapAIResponseToPrepDetails } from './helpers/mapAIResponse';
import { validateRequest } from './helpers/validateRequest';

/**
 * POST /api/ai/prep-details
 * Analyze recipes to extract detailed prep information (cut shapes, sauces, marination, etc.)
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Prep details response
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request
    const validation = await validateRequest(request);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error || 'Invalid request',
          'VALIDATION_ERROR',
          validation.statusCode || 400,
        ),
        { status: validation.statusCode || 400 },
      );
    }

    const { recipe, ingredients, instructions, countryCode } = validation.data;

    // Try AI mechanism
    try {
      const prompt = buildPrepDetailsPrompt(recipe, ingredients, instructions);
      const aiResponse = await generateAIResponse(
        [
          {
            role: 'user',
            content: prompt,
          },
        ],
        countryCode || 'AU',
        {
          temperature: 0.3, // Lower temperature for more consistent structured output
          maxTokens: 2000,
          useCache: true,
          cacheTTL: 7 * 24 * 60 * 60 * 1000, // 7 day cache (prep details don't change often)
        },
      );

      if (aiResponse.content && !aiResponse.error) {
        const prepDetails = mapAIResponseToPrepDetails(aiResponse.content, recipe);

        return NextResponse.json({
          prepDetails,
          source: 'ai',
          cached: aiResponse.cached,
        });
      }
    } catch (aiError) {
      logger.warn('AI prep details failed:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
      });
    }

    // Fallback: Return empty prep details
    return NextResponse.json({
      prepDetails: {
        recipeId: recipe.id,
        recipeName: recipe.recipe_name,
        prepDetails: [],
        sauces: [],
        marinations: [],
        cutShapes: [],
        preCookingSteps: [],
        specialTechniques: [],
      },
      source: 'fallback',
    });
  } catch (error) {
    logger.error('Prep details error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze prep details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
