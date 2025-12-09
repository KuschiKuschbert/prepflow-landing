/**
 * Image generation logic
 */

import type { AIResponse } from '@/lib/ai/types';
import type { FoodImageResult } from '@/lib/ai/ai-service/image-generation';
import { generateFoodImagesForMethods } from '@/lib/ai/ai-service/image-generation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { PlatingMethod } from '@/lib/ai/ai-service/image-generation';
import { NextResponse } from 'next/server';

/**
 * Generate food images for specified plating methods
 *
 * @param {string} dishName - Dish name
 * @param {string[]} ingredientNames - List of ingredient names
 * @param {PlatingMethod[]} methodsToGenerate - Plating methods to generate
 * @param {string[]} recipeInstructions - Recipe instructions
 * @param {string} dishId - Dish ID for logging
 * @returns {Promise<Record<string, AIResponse<FoodImageResult>> | NextResponse>} Generated images or error response
 */
export async function generateFoodImages(
  dishName: string,
  ingredientNames: string[],
  methodsToGenerate: PlatingMethod[],
  recipeInstructions: string[],
  dishId: string,
): Promise<Record<string, AIResponse<FoodImageResult>> | NextResponse> {
  logger.dev('[Dish Image Generation] Starting image generation:', {
    dishId,
    dishName,
    methodsToGenerate,
    ingredientCount: ingredientNames.length,
  });

  try {
    // Combine all recipe instructions into a single string (first 500 chars to keep prompt manageable)
    const combinedInstructions =
      recipeInstructions.length > 0 ? recipeInstructions.join(' ').substring(0, 500) : null;

    const imageResults = await generateFoodImagesForMethods(
      dishName || 'Dish',
      ingredientNames,
      methodsToGenerate,
      {},
      combinedInstructions,
    );

    return imageResults;
  } catch (genError) {
    logger.error('[Dish Image Generation] Image generation failed:', {
      error: genError instanceof Error ? genError.message : String(genError),
      dishId,
      dishName,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        genError instanceof Error ? genError.message : 'Failed to generate images',
        'IMAGE_GENERATION_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
