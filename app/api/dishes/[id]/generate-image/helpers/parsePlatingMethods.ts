/**
 * Parse plating methods from request body
 */

import type { PlatingMethod } from '@/lib/ai/ai-service/image-generation';
import { logger } from '@/lib/logger';

/**
 * Parse and validate plating methods from request body
 *
 * @param {Request} req - Next.js request object
 * @param {string} dishId - Dish ID for logging
 * @returns {Promise<PlatingMethod[] | undefined>} Validated plating methods or undefined for default
 */
export async function parsePlatingMethods(
  req: Request,
  dishId: string,
): Promise<PlatingMethod[] | undefined> {
  try {
    const body = await req.json().catch(() => ({}));
    if (
      body.platingMethods &&
      Array.isArray(body.platingMethods) &&
      body.platingMethods.length > 0
    ) {
      // Validate and cast plating methods to ensure type safety
      const selectedPlatingMethods = body.platingMethods.filter(
        (method: string): method is PlatingMethod => {
          const validMethods: PlatingMethod[] = [
            'classic',
            'landscape',
            'deconstructed',
            'stacking',
          ];
          return validMethods.includes(method as PlatingMethod);
        },
      );

      logger.dev('[Dish Image Generation] Parsed plating methods from request:', {
        raw: body.platingMethods,
        validated: selectedPlatingMethods,
        dishId,
      });

      return selectedPlatingMethods.length > 0 ? selectedPlatingMethods : undefined;
    }
  } catch (error) {
    // No body or invalid JSON - use defaults
    logger.dev('[Dish Image Generation] Failed to parse request body:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }

  return undefined;
}

/**
 * Determine which plating methods to generate
 *
 * @param {PlatingMethod[] | undefined} selectedMethods - User-selected methods
 * @returns {PlatingMethod[]} Methods to generate (defaults to ['classic'])
 */
export function determinePlatingMethods(
  selectedMethods: PlatingMethod[] | undefined,
  dishId: string,
  dishName: string,
  ingredientCount: number,
): PlatingMethod[] {
  if (selectedMethods && selectedMethods.length > 0) {
    logger.dev('[Dish Image Generation] Generating images for selected plating methods', {
      dishId,
      dishName,
      methods: selectedMethods,
      ingredientCount,
    });
    return selectedMethods;
  }

  // Default: generate only 1 image with 'classic' method
  logger.dev('[Dish Image Generation] Generating image with default classic plating method', {
    dishId,
    dishName,
    ingredientCount,
  });
  return ['classic'];
}
