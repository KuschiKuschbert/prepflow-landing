/**
 * Recipe Image Generation API Endpoint
 * POST /api/recipes/[id]/generate-image
 *
 * Generates photorealistic food images for a recipe based on its name and ingredients.
 * By default, generates 1 image with the 'classic' plating method.
 * Users can optionally specify multiple plating methods in the request body.
 */

import type { PlatingMethod } from '@/lib/ai/ai-service/image-generation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './helpers/rateLimit';
import { validateRequest } from './helpers/validateRequest';
import { fetchRecipeWithIngredients } from './helpers/fetchRecipe';
import { generateRecipeImages } from './helpers/generateImages';
import { saveRecipeImages } from './helpers/saveImages';
import { formatImageResponse } from './helpers/formatResponse';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    // Validate request and authenticate
    const validationResult = await validateRequest(req, recipeId);
    if (validationResult instanceof NextResponse) return validationResult;
    const { userId, selectedPlatingMethods } = validationResult;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Rate limit exceeded. Maximum 10 image generations per hour.',
          'RATE_LIMIT_ERROR',
          429,
        ),
        { status: 429 },
      );
    }

    // Check if AI is enabled
    const { isAIEnabled } = await import('@/lib/ai/huggingface-client');
    if (!isAIEnabled()) {
      logger.error('[Recipe Image Generation] AI not enabled - missing HUGGINGFACE_API_KEY');
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Image generation service is not available. Please configure HUGGINGFACE_API_KEY to generate images.',
          'SERVICE_UNAVAILABLE',
          503,
        ),
        { status: 503 },
      );
    }

    // Fetch recipe with ingredients
    const recipeResult = await fetchRecipeWithIngredients(recipeId);
    if (recipeResult instanceof NextResponse) return recipeResult;
    const { recipe, ingredientNames } = recipeResult;

    const recipeName = (recipe as any).name || 'Recipe';

    // Determine which plating methods to generate
    const defaultMethod: PlatingMethod[] = ['classic'];
    const methodsToGenerate =
      selectedPlatingMethods && selectedPlatingMethods.length > 0
        ? selectedPlatingMethods
        : defaultMethod;

    logger.dev('[Recipe Image Generation] Generating images:', {
      recipeId,
      recipeName,
      methods: methodsToGenerate,
      ingredientCount: ingredientNames.length,
    });

    // Generate images
    const imageResults = await generateRecipeImages(
      recipeName,
      ingredientNames,
      methodsToGenerate,
      recipe.instructions,
    );
    if (imageResults instanceof NextResponse) return imageResults;

    // Save images to storage and database
    const saveResult = await saveRecipeImages(recipeId, recipe, imageResults);
    if (saveResult instanceof NextResponse) return saveResult;

    // Format and return response
    return NextResponse.json(formatImageResponse(saveResult));
  } catch (err) {
    logger.error('[Recipe Image Generation] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]/generate-image', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        'An unexpected error occurred while generating images',
        'INTERNAL_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
