import { logger } from '@/lib/logger';
import type { AIResponse, FoodImageResult, FoodImageGenerationOptions, PlatingMethod } from '../types';
import { buildFoodImagePrompt } from '../image-generation';
import { generateImageWithRetry } from './generateImageWithRetry';

/**
 * Generate food images for specific plating methods
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param platingMethods - Array of plating methods to generate
 * @param options - Generation options
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Object with image results for each requested plating method
 */
export async function generateFoodImagesForMethods(
  dishName: string,
  ingredients: string[],
  platingMethods: PlatingMethod[],
  options: FoodImageGenerationOptions = {},
  instructions?: string | null,
): Promise<Record<string, AIResponse<FoodImageResult>>> {
  logger.dev('[Image Generation] Generating images for plating methods:', {
    dishName,
    platingMethods,
    ingredientCount: ingredients.length,
    hasInstructions: !!instructions,
  });

  // Build prompts for all requested plating methods
  const prompts = platingMethods.map(method => {
    const prompt = buildFoodImagePrompt(dishName, ingredients, method, instructions);
    logger.dev(`[Image Generation] Built prompt for ${method}:`, {
      method,
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 150),
    });
    return {
      method,
      prompt,
    };
  });

  // Generate all images in parallel
  const results = await Promise.all(
    prompts.map(({ method, prompt }) =>
      generateImageWithRetry(prompt, { ...options, platingMethod: method }).then(result => ({
        method,
        result,
      })),
    ),
  );

  // Convert array to object keyed by method name
  const resultObject: Record<string, AIResponse<FoodImageResult>> = {};
  for (const { method, result } of results) {
    resultObject[method] = result;
  }

  return resultObject;
}
