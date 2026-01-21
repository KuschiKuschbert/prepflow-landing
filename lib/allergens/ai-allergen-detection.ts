/**
 * AI-based allergen detection service
 * Uses OpenAI to analyze ingredient composition and detect allergens
 */

import { detectAllergensFromIngredient } from './detection/detector';
import type { AIAllergenDetectionResult } from './detection/types';

export { detectAllergensFromIngredient };
export type { AIAllergenDetectionResult };

/**
 * Enrich ingredient with allergens (merge manual + AI)
 * @deprecated Use enrichIngredientWithAllergensHybrid from hybrid-allergen-detection.ts instead
 * This function is kept for backward compatibility but now uses hybrid detection internally
 */
export async function enrichIngredientWithAllergens(ingredient: {
  ingredient_name: string;
  brand?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}): Promise<{
  allergens: string[];
  allergen_source: {
    manual: boolean;
    ai: boolean;
    ai_detected_at?: string;
  };
}> {
  // Use hybrid detection internally
  const { enrichIngredientWithAllergensHybrid } = await import('./hybrid-allergen-detection');
  const result = await enrichIngredientWithAllergensHybrid(ingredient);

  // Convert hybrid result to legacy format
  return {
    allergens: result.allergens,
    allergen_source: {
      manual: result.allergen_source.manual || false,
      ai: result.allergen_source.ai || false,
      ai_detected_at: result.allergen_source.ai_detected_at,
    },
  };
}
