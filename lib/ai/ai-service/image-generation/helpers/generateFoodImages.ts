import type { AIResponse } from '../../../types';
import type { FoodImageResult, FoodImageGenerationOptions } from '../types';
import { buildFoodImagePrompt } from '../../image-generation';
import { generateImageWithRetry } from './generateImageWithRetry';

/**
 * Generate food images with multiple plating methods in parallel
 *
 * Generates 4 images with different plating styles:
 * - classic: Traditional elegant plating (primary)
 * - stacking: Vertical tower with layered ingredients
 * - landscape: Horizontal flow mimicking natural landscapes
 * - deconstructed: Components separated for individual experience
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param options - Generation options
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Object with all 4 plating method image results
 */
export async function generateFoodImages(
  dishName: string,
  ingredients: string[],
  options: FoodImageGenerationOptions = {},
  instructions?: string | null,
): Promise<{
  classic: AIResponse<FoodImageResult>;
  stacking: AIResponse<FoodImageResult>;
  landscape: AIResponse<FoodImageResult>;
  deconstructed: AIResponse<FoodImageResult>;
  // Legacy aliases for backward compatibility
  primary: AIResponse<FoodImageResult>;
  alternative: AIResponse<FoodImageResult>;
}> {
  // Build prompts for all 4 plating methods
  const classicPrompt = buildFoodImagePrompt(dishName, ingredients, 'classic', instructions);
  const stackingPrompt = buildFoodImagePrompt(dishName, ingredients, 'stacking', instructions);
  const landscapePrompt = buildFoodImagePrompt(dishName, ingredients, 'landscape', instructions);
  const deconstructedPrompt = buildFoodImagePrompt(
    dishName,
    ingredients,
    'deconstructed',
    instructions,
  );

  // Generate all 4 images in parallel
  const [classicResult, stackingResult, landscapeResult, deconstructedResult] = await Promise.all([
    generateImageWithRetry(classicPrompt, { ...options, platingMethod: 'classic' }),
    generateImageWithRetry(stackingPrompt, { ...options, platingMethod: 'stacking' }),
    generateImageWithRetry(landscapePrompt, { ...options, platingMethod: 'landscape' }),
    generateImageWithRetry(deconstructedPrompt, { ...options, platingMethod: 'deconstructed' }),
  ]);

  return {
    classic: classicResult,
    stacking: stackingResult,
    landscape: landscapeResult,
    deconstructed: deconstructedResult,
    // Legacy aliases for backward compatibility
    primary: classicResult,
    alternative: landscapeResult,
  };
}
