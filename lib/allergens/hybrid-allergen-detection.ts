/**
 * Hybrid Allergen Detection
 * Uses non-AI keyword matching first, falls back to AI for complex/processed ingredients
 */

import { logger } from '@/lib/logger';
import { detectAllergensFromText, consolidateAllergens } from './australian-allergens';
import { detectAllergensFromIngredient, AIAllergenDetectionResult } from './ai-allergen-detection';

export interface HybridAllergenDetectionResult {
  allergens: string[];
  composition?: string;
  confidence: 'high' | 'medium' | 'low';
  method: 'non-ai' | 'ai' | 'hybrid';
  cached: boolean;
  reason?: string;
}

/**
 * Check if ingredient name suggests it's a processed/complex ingredient
 * that might benefit from AI detection
 */
function isProcessedIngredient(ingredientName: string, brand?: string): boolean {
  const lowerName = ingredientName.toLowerCase();
  const lowerBrand = brand?.toLowerCase() || '';

  // Indicators of processed ingredients
  const processedIndicators = [
    'mix',
    'blend',
    'sauce',
    'dressing',
    'marinade',
    'paste',
    'powder',
    'seasoning',
    'spice blend',
    'rub',
    'marinade',
    'glaze',
    'syrup',
    'concentrate',
    'extract',
    'essence',
    'flavor',
    'flavour',
    'stock',
    'broth',
    'bouillon',
    'base',
    'prepared',
    'ready-made',
    'ready made',
    'pre-mixed',
    'pre mixed',
  ];

  // Check if name contains processed indicators
  const hasProcessedIndicator = processedIndicators.some(indicator =>
    lowerName.includes(indicator) || lowerBrand.includes(indicator),
  );

  // Check if it's a brand name (often processed)
  const hasBrand = brand && brand.trim().length > 0;

  // Check if name is very short (might be ambiguous)
  const isShort = ingredientName.trim().length < 3;

  // Check if name contains numbers or special characters (often processed products)
  const hasSpecialChars = /[0-9%()]/.test(ingredientName);

  return hasProcessedIndicator || (hasBrand && !hasProcessedIndicator) || isShort || hasSpecialChars;
}

/**
 * Hybrid allergen detection: non-AI first, AI fallback
 */
export async function detectAllergensHybrid(
  ingredientName: string,
  brand?: string,
  forceAI: boolean = false,
): Promise<HybridAllergenDetectionResult> {
  const trimmedName = ingredientName.trim();
  const trimmedBrand = brand?.trim();

  // Step 1: Try non-AI keyword-based detection
  const nonAIAllergens = detectAllergensFromText(trimmedName);
  const brandAllergens = trimmedBrand ? detectAllergensFromText(trimmedBrand) : [];
  const allNonAIAllergens = [...new Set([...nonAIAllergens, ...brandAllergens])];

  logger.dev(
    `[Hybrid Allergen Detection] Non-AI detection found ${allNonAIAllergens.length} allergens for: ${trimmedName}`,
  );

  // Step 2: Determine if we should use AI
  const shouldUseAI =
    forceAI ||
    (allNonAIAllergens.length === 0 && isProcessedIngredient(trimmedName, trimmedBrand)) ||
    (allNonAIAllergens.length === 0 && trimmedBrand && trimmedBrand.length > 0);

  if (!shouldUseAI) {
    // Non-AI detection is sufficient
    return {
      allergens: allNonAIAllergens,
      confidence: allNonAIAllergens.length > 0 ? 'high' : 'medium',
      method: 'non-ai',
      cached: false,
      reason:
        allNonAIAllergens.length > 0
          ? 'Detected using keyword matching'
          : 'No allergens detected using keyword matching',
    };
  }

  // Step 3: Use AI detection as fallback or supplement
  logger.dev(`[Hybrid Allergen Detection] Using AI detection for: ${trimmedName}`);
  const aiResult: AIAllergenDetectionResult = await detectAllergensFromIngredient(trimmedName, trimmedBrand);

  // Step 4: Merge non-AI and AI results and consolidate
  const mergedAllergens = consolidateAllergens([
    ...allNonAIAllergens,
    ...aiResult.allergens.map(code => {
      // Map old codes from AI to consolidated codes
      const mapping: Record<string, string> = {
        crustacea: 'shellfish',
        molluscs: 'shellfish',
        peanuts: 'nuts',
        tree_nuts: 'nuts',
        wheat: 'gluten',
      };
      return mapping[code] || code;
    }),
  ]);

  // Determine confidence and method
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let method: 'non-ai' | 'ai' | 'hybrid' = 'hybrid';
  let reason: string | undefined;

  if (allNonAIAllergens.length > 0 && aiResult.allergens.length > 0) {
    // Both methods found allergens
    method = 'hybrid';
    confidence = 'high';
    reason = `Detected using keyword matching and AI (${allNonAIAllergens.length} from keywords, ${aiResult.allergens.length} from AI)`;
  } else if (allNonAIAllergens.length > 0) {
    // Only non-AI found allergens
    method = 'non-ai';
    confidence = 'high';
    reason = 'Detected using keyword matching';
  } else if (aiResult.allergens.length > 0) {
    // Only AI found allergens
    method = 'ai';
    confidence = aiResult.confidence;
    reason = `Detected using AI (${aiResult.allergens.length} allergens found)`;
  } else {
    // No allergens found
    method = 'hybrid';
    confidence = 'medium';
    reason = 'No allergens detected using keyword matching or AI';
  }

  return {
    allergens: mergedAllergens,
    composition: aiResult.composition,
    confidence,
    method,
    cached: aiResult.cached,
    reason,
  };
}

/**
 * Enrich ingredient with allergens using hybrid detection
 * Merges manual allergens with detected allergens
 */
export async function enrichIngredientWithAllergensHybrid(ingredient: {
  ingredient_name: string;
  brand?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
  forceAI?: boolean;
}): Promise<{
  allergens: string[];
  allergen_source: {
    manual: boolean;
    ai: boolean;
    non_ai?: boolean;
    hybrid?: boolean;
    ai_detected_at?: string;
  };
  composition?: string;
  confidence?: 'high' | 'medium' | 'low';
  method?: 'non-ai' | 'ai' | 'hybrid';
}> {
  const manualAllergens = ingredient.allergens || [];
  const hasManualAllergens = manualAllergens.length > 0;

  // If ingredient already has manual allergens, don't use detection
  if (hasManualAllergens) {
    return {
      allergens: manualAllergens,
      allergen_source: {
        manual: true,
        ai: false,
        non_ai: false,
        hybrid: false,
      },
    };
  }

  // Use hybrid detection
  const detectionResult = await detectAllergensHybrid(
    ingredient.ingredient_name,
    ingredient.brand,
    ingredient.forceAI || false,
  );

  // Merge manual and detected allergens (consolidate and deduplicate)
  const allAllergens = consolidateAllergens([...manualAllergens, ...detectionResult.allergens]);

  return {
    allergens: allAllergens,
    allergen_source: {
      manual: hasManualAllergens,
      ai: detectionResult.method === 'ai' || detectionResult.method === 'hybrid',
      non_ai: detectionResult.method === 'non-ai' || detectionResult.method === 'hybrid',
      hybrid: detectionResult.method === 'hybrid',
      ai_detected_at:
        (detectionResult.method === 'ai' || detectionResult.method === 'hybrid') &&
        detectionResult.allergens.length > 0
          ? new Date().toISOString()
          : undefined,
    },
    composition: detectionResult.composition,
    confidence: detectionResult.confidence,
    method: detectionResult.method,
  };
}
