/**
 * Food image generation service using Hugging Face Inference Providers
 *
 * Generates photorealistic food images based on dish/recipe names and ingredients.
 * Supports multiple plating methods: classic, modern, rustic, and minimalist.
 */

import { logger } from '@/lib/logger';
import type { AIResponse } from '../types';
import type {
  PlatingMethod,
  FoodImageGenerationOptions,
  FoodImageResult,
} from './image-generation/types';
import { buildPromptForPlatingMethod } from './image-generation/helpers/buildPromptForPlatingMethod';
import { extractCookingMethod } from './image-generation/helpers/extractCookingMethod';
import { generateImageWithRetry } from './image-generation/helpers/generateImageWithRetry';

export type {
  PlatingMethod,
  FoodImageGenerationOptions,
  FoodImageResult,
} from './image-generation/types';

/**
 * Build a detailed prompt for food image generation based on plating method
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param platingMethod - Plating method to use (classic, modern, rustic, minimalist, or custom description)
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Formatted prompt for image generation
 */
export function buildFoodImagePrompt(
  dishName: string,
  ingredients: string[],
  platingMethod: PlatingMethod | string = 'classic',
  instructions?: string | null,
): string {
  // Sanitize dish name (remove special characters that might confuse the model)
  const sanitizedName = dishName.trim().replace(/[^\w\s-]/g, '');

  // Format all ingredients as explicit comma-separated list
  const allIngredientsList = ingredients.join(', ');

  // Extract cooking method from instructions if available
  const cookingMethodText = instructions ? extractCookingMethod(instructions) : '';

  // Base prompt with visual constraints
  const basePrompt = `A photorealistic, high-resolution studio photograph of ${sanitizedName}.

The image should only feature the final dish and the following ingredients, visibly present: ${allIngredientsList}.

VISUAL CONSTRAINTS:

1. Ingredients **must not** include any item not explicitly listed above (e.g., if "water" or "salt" are common but not listed, they must not be visible).

2. Lighting: Professional, soft-box studio lighting.

3. Style: Clean, modern food photography setup.

4. Setting: Neutral-toned surface (e.g., slate, light wood, or marble).

5. Composition: Only the food on a plate in the center, no other elements around the plate/dish. No background elements, props, or decorative items. The plate should be centered and isolated.${cookingMethodText}`;

  const qualitySuffix =
    'High resolution, detailed textures, shallow depth of field, appetizing presentation, commercial food photography.';

  // Generate prompt based on plating method
  return buildPromptForPlatingMethod(basePrompt, qualitySuffix, platingMethod);
}

/**
 * Generate a food image using Hugging Face Inference Providers
 *
 * @param prompt - Image generation prompt
 * @param options - Generation options
 * @returns Generated image result
 */
export async function generateFoodImage(
  prompt: string,
  options: FoodImageGenerationOptions = {},
): Promise<AIResponse<FoodImageResult>> {
  return generateImageWithRetry(prompt, options);
}

export { generateFoodImages } from './image-generation/helpers/generateFoodImages';
export { generateFoodImagesForMethods } from './image-generation/helpers/generateFoodImagesForMethods';
