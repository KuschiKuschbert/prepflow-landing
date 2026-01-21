import {
    generateTextWithHuggingFace,
    getHuggingFaceTextModel,
    isAIEnabled,
} from '@/lib/ai/huggingface-client';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { AUSTRALIAN_ALLERGENS } from '../australian-allergens';
import { cacheComposition, getCachedComposition } from './cache';
import { parseAIResponse } from './parser';
import type { AIAllergenDetectionResult } from './types';

/**
 * Detect allergens from ingredient using AI
 */
export async function detectAllergensFromIngredient(
  ingredientName: string,
  brand?: string,
): Promise<AIAllergenDetectionResult> {
  // Check cache first
  const cached = await getCachedComposition(ingredientName, brand);
  if (cached) {
    return cached;
  }

  // Check if AI is enabled
  if (!isAIEnabled()) {
    logger.dev('[AI Allergen Detection] AI not enabled, returning empty result');
    return {
      allergens: [],
      confidence: 'low',
      cached: false,
    };
  }

  try {
    // Build prompt for AI
    const allergenList = AUSTRALIAN_ALLERGENS.map(a => a.displayName).join(', ');
    const prompt = `Analyze this ingredient and identify which Australian FSANZ allergens are present.

Ingredient: ${ingredientName}${brand ? ` (Brand: ${brand})` : ''}

The 14 major allergens are: ${allergenList}

Please provide:
1. The composition/ingredients list (if this is a processed ingredient)
2. Which allergens are present (if any)

Format your response as:
Composition: [list of ingredients if processed, or "single ingredient" if not]
Allergens: [comma-separated list of allergen names, or "none" if no allergens]

Be thorough and check for hidden allergens in processed ingredients.`;

    const messages = [
      {
        role: 'system' as const,
        content:
          'You are a food safety expert analyzing ingredients for allergen content according to Australian FSANZ standards. Be precise and thorough.',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    const result = await generateTextWithHuggingFace(messages, {
      model: getHuggingFaceTextModel(),
      temperature: 0.3, // Lower temperature for more consistent results
      maxTokens: 500,
    });

    if (!result || !result.content) {
      throw ApiErrorHandler.createError('No response from AI', 'DATABASE_ERROR', 500);
    }

    const content = result.content;
    const { allergens, composition } = parseAIResponse(content);

    // Cache the result
    await cacheComposition(ingredientName, brand || null, allergens, composition);

    return {
      allergens,
      composition,
      confidence: allergens.length > 0 ? 'high' : 'medium',
      cached: false,
    };
  } catch (err) {
    logger.error('[AI Allergen Detection] Error detecting allergens:', err);
    return {
      allergens: [],
      confidence: 'low',
      cached: false,
    };
  }
}
