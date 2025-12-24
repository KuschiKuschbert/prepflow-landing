/**
 * Vegetarian and Vegan Suitability Detection
 * Hybrid approach: Non-AI keyword matching (primary) with AI fallback
 */

import { logger } from '@/lib/logger';
import { detectVegetarianVeganFromIngredients } from './vegetarian-vegan-detection/helpers/detectFromIngredients';
import { detectVegetarianVeganWithAI } from './vegetarian-vegan-detection/helpers/detectWithAI';
import {
  isNonVegetarianIngredient,
  isNonVeganIngredient,
} from './vegetarian-vegan-detection/helpers/checkIngredients';

// Re-export types and interfaces
export type {
  DietaryDetectionResult,
  Ingredient,
} from './vegetarian-vegan-detection/helpers/detectFromIngredients';

// Re-export helper functions
export {
  isNonVegetarianIngredient,
  isNonVeganIngredient,
  detectVegetarianVeganFromIngredients,
  detectVegetarianVeganWithAI,
};

/**
 * Hybrid detection function
 * Tries non-AI first, falls back to AI if confidence is low/medium or user requests it
 */
export async function detectDietarySuitability(
  recipeIdOrDishId: string,
  ingredients: import('./vegetarian-vegan-detection/helpers/detectFromIngredients').Ingredient[],
  recipeName?: string,
  description?: string,
  useAI?: boolean,
): Promise<
  import('./vegetarian-vegan-detection/helpers/detectFromIngredients').DietaryDetectionResult
> {
  // First try non-AI detection (includes name check)
  const nonAIResult = detectVegetarianVeganFromIngredients(ingredients, recipeName);

  // If confidence is high and user didn't request AI, return non-AI result
  if (nonAIResult.confidence === 'high' && !useAI) {
    return nonAIResult;
  }

  // If confidence is low/medium or user requested AI, try AI detection
  if (
    (nonAIResult.confidence === 'low' || nonAIResult.confidence === 'medium' || useAI) &&
    recipeName
  ) {
    try {
      const aiResult = await detectVegetarianVeganWithAI(recipeName, ingredients, description);
      // AI takes precedence if used
      return aiResult;
    } catch (err) {
      logger.error('[Dietary Detection] AI detection failed, using non-AI result:', err);
      // Fallback to non-AI result if AI fails
      return nonAIResult;
    }
  }

  return nonAIResult;
}
