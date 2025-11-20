/**
 * AI-based ingredient category detection.
 * Uses OpenAI API to categorize ingredients when rule-based detection fails.
 * Follows the same pattern as allergen detection.
 */

import { getOpenAIClient, isAIEnabled } from '@/lib/ai/openai-client';
import { logger } from '@/lib/logger';
import { STANDARD_CATEGORIES, type IngredientCategory } from './category-detection';

/**
 * Result of AI category detection.
 */
export interface AICategoryDetectionResult {
  category: IngredientCategory;
  confidence: 'high' | 'medium' | 'low';
  reasoning?: string;
}

/**
 * Detect ingredient category using AI.
 *
 * @param {string} ingredientName - Ingredient name
 * @param {string} [brand] - Optional brand name
 * @param {string} [storageLocation] - Optional storage location (can help with categorization)
 * @returns {Promise<AICategoryDetectionResult>} Detection result with category and confidence
 */
export async function detectCategoryWithAI(
  ingredientName: string,
  brand?: string,
  storageLocation?: string,
): Promise<AICategoryDetectionResult> {
  if (!isAIEnabled()) {
    logger.dev('[AI Category Detection] AI not enabled, returning Other category');
    return {
      category: 'Other',
      confidence: 'low',
    };
  }

  const client = getOpenAIClient();
  if (!client) {
    logger.warn('[AI Category Detection] OpenAI client not available');
    return {
      category: 'Other',
      confidence: 'low',
    };
  }

  try {
    const categoryList = STANDARD_CATEGORIES.join(', ');
    const prompt = `Categorize this restaurant ingredient into one of these food categories: ${categoryList}.

Ingredient: ${ingredientName}${brand ? ` (Brand: ${brand})` : ''}${storageLocation ? ` (Storage: ${storageLocation})` : ''}

Respond with ONLY the category name from the list above. Choose the most specific and appropriate category. If it's a fruit or vegetable, use "Fruit & Veg" for mixed items, or "Fruits" or "Vegetables" for specific types.

Category:`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a restaurant inventory expert. Categorize ingredients accurately into food-based categories. Be precise and choose the most specific category.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 50,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';

    // Find matching category (case-insensitive, partial match)
    const detectedCategory =
      STANDARD_CATEGORIES.find(
        cat =>
          content.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(content.toLowerCase()),
      ) || 'Other';

    // Determine confidence based on exact match
    const isExactMatch =
      content.toLowerCase() === detectedCategory.toLowerCase() ||
      content.toLowerCase().includes(detectedCategory.toLowerCase());

    return {
      category: detectedCategory,
      confidence: isExactMatch
        ? 'high'
        : STANDARD_CATEGORIES.includes(detectedCategory)
          ? 'medium'
          : 'low',
      reasoning: content,
    };
  } catch (err) {
    logger.error('[AI Category Detection] Error detecting category:', err);
    return {
      category: 'Other',
      confidence: 'low',
    };
  }
}
