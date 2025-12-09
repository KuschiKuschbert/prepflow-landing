/**
 * Generate food images for recipe
 */

import { NextResponse } from 'next/server';
import {
  generateFoodImagesForMethods,
  type PlatingMethod,
  type FoodImageResult,
} from '@/lib/ai/ai-service/image-generation';
import type { AIResponse } from '@/lib/ai/types';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function generateRecipeImages(
  recipeName: string,
  ingredientNames: string[],
  methodsToGenerate: PlatingMethod[],
  recipeInstructions: string | null,
): Promise<NextResponse | Record<string, AIResponse<FoodImageResult>>> {
  try {
    logger.dev('[Recipe Image Generation] Starting image generation:', {
      recipeName,
      methodsToGenerate,
      ingredientCount: ingredientNames.length,
    });

    const imageResults = await generateFoodImagesForMethods(
      recipeName,
      ingredientNames,
      methodsToGenerate,
      {},
      recipeInstructions,
    );

    const errors: string[] = [];
    const successfulMethods: string[] = [];
    for (const [method, result] of Object.entries(imageResults)) {
      if (result.error) {
        errors.push(`${method}: ${result.error}`);
        logger.error(`[Recipe Image Generation] Failed to generate ${method} image:`, {
          error: result.error,
          method,
        });
      } else if (result.content?.imageUrl) {
        successfulMethods.push(method);
      }
    }

    logger.dev('[Recipe Image Generation] Generation results:', {
      successfulMethods,
      errors,
      totalMethods: methodsToGenerate.length,
    });

    if (errors.length === methodsToGenerate.length) {
      const errorMessage =
        errors.length === 1
          ? `Failed to generate image: ${errors[0]}`
          : `Failed to generate all images. Errors: ${errors.join('; ')}`;
      return NextResponse.json(ApiErrorHandler.createError(errorMessage, 'AI_SERVICE_ERROR', 500), {
        status: 500,
      });
    }

    return imageResults;
  } catch (genError) {
    logger.error('[Recipe Image Generation] Image generation threw error:', {
      error: genError instanceof Error ? genError.message : String(genError),
      stack: genError instanceof Error ? genError.stack : undefined,
      recipeName,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        `Failed to generate images: ${genError instanceof Error ? genError.message : String(genError)}`,
        'AI_SERVICE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
