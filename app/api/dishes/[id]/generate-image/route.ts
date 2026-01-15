/**
 * Dish Image Generation API Endpoint
 * POST /api/dishes/[id]/generate-image
 *
 * Generates photorealistic food images for a dish based on its name and ingredients.
 * Aggregates ingredients from both direct dish ingredients and recipe ingredients.
 * By default, generates 1 image with the 'classic' plating method.
 * Users can optionally specify multiple plating methods in the request body.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { aggregateDishIngredients } from './helpers/aggregateIngredients';
import { checkExistingImages, fetchDish } from './helpers/fetchDish';
import { formatImageResponse } from './helpers/formatResponse';
import { generateFoodImages } from './helpers/generateImages';
import { determinePlatingMethods, parsePlatingMethods } from './helpers/parsePlatingMethods';
import { checkRateLimit } from './helpers/rateLimit';
import { uploadAndSaveImages } from './helpers/uploadAndSaveImages';
import {
    authenticateRequest,
    validateAIService,
    validateDatabase,
    validateDishId,
} from './helpers/validateRequest';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    // Validate dish ID
    const dishIdError = validateDishId(dishId);
    if (dishIdError) return dishIdError;

    // Authenticate request
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

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

    // Validate AI service
    const aiError = await validateAIService();
    if (aiError) return aiError;

    // Validate database
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection error',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }
    const dbError = validateDatabase(supabaseAdmin);
    if (dbError) return dbError;

    // Fetch dish
    const dishResult = await fetchDish(dishId!);
    if (dishResult instanceof NextResponse) return dishResult;
    const { dish } = dishResult;

    // Check for existing images
    const cachedResponse = checkExistingImages(dish, dishId!);
    if (cachedResponse) return cachedResponse;

    // Aggregate ingredients from dish and recipes
    const { ingredientNames, recipeInstructions } = await aggregateDishIngredients(dishId);

    if (ingredientNames.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish has no ingredients. Add ingredients or recipes before generating images.',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Parse request body for optional plating methods
    const selectedPlatingMethods = await parsePlatingMethods(req, dishId);

    // Determine which plating methods to generate
    const methodsToGenerate = determinePlatingMethods(
      selectedPlatingMethods,
      dishId,
      dish.dish_name || 'Dish',
      ingredientNames.length,
    );

    // Generate images
    const imageResults = await generateFoodImages(
      dish.dish_name || 'Dish',
      ingredientNames,
      methodsToGenerate,
      recipeInstructions,
      dishId!,
    );

    if (imageResults instanceof NextResponse) return imageResults;

    // Upload images and save to database
    let generatedImages: Record<string, string | null>;
    let updateData: Record<string, string>;
    try {
      const result = await uploadAndSaveImages(dishId, imageResults);
      generatedImages = result.generatedImages;
      updateData = result.updateData;
    } catch (uploadError: unknown) {
      logger.error('[Dish Image Generation] Failed to upload/save images:', {
        error: uploadError instanceof Error ? uploadError.message : String(uploadError),
        dishId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          uploadError instanceof Error ? uploadError.message : 'Failed to upload images',
          'STORAGE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    return NextResponse.json(formatImageResponse(generatedImages, updateData));
  } catch (err) {
    logger.error('[Dish Image Generation] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]/generate-image', method: 'POST' },
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
