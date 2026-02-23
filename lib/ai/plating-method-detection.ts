/**
 * AI Plating Method Detection Service
 *
 * Uses AI to analyze dishes and suggest suitable plating methods
 */

import type { Ingredient } from '@/lib/types/ingredients';
import { logger } from '@/lib/logger';
import {
  buildPlatingMethodDetectionPrompt,
  type PlatingMethodSuggestion,
} from './prompts/plating-method-detection';

export interface PlatingMethodDetectionResult {
  suggestions: PlatingMethodSuggestion[];
  dishCategory?: string;
  overallReasoning?: string;
  method: 'ai' | 'fallback';
}

/**
 * Detect suitable plating methods using AI
 *
 * @param dishName - Name of the dish
 * @param ingredients - List of ingredients
 * @param description - Optional dish description
 * @returns Array of suggested plating methods with confidence scores
 */
export async function detectSuitablePlatingMethods(
  dishName: string,
  ingredients: Ingredient[],
  description?: string,
): Promise<PlatingMethodDetectionResult> {
  const { isAIEnabled, generateTextWithHuggingFace, getHuggingFaceTextModel } =
    await import('@/lib/ai/huggingface-client');

  if (!isAIEnabled()) {
    logger.warn('[Plating Method Detection] AI not enabled, using fallback suggestions');
    return getFallbackSuggestions(dishName, ingredients);
  }

  try {
    const prompt = buildPlatingMethodDetectionPrompt(dishName, ingredients, description);

    const messages = [
      {
        role: 'system' as const,
        content:
          'You are a professional chef and food styling expert. Analyze dishes and suggest suitable plating methods. Always respond with valid JSON only, no markdown formatting or additional text.',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    const result = await generateTextWithHuggingFace(messages, {
      model: getHuggingFaceTextModel(),
      temperature: 0.5,
      maxTokens: 1000,
    });

    if (!result || !result.content) {
      throw new Error('No response from AI');
    }

    // Extract JSON from response (may contain markdown code blocks)
    let responseText = result.content.trim();
    const jsonMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      responseText = jsonMatch[1].trim();
    }

    // Remove any leading/trailing non-JSON text
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd + 1);
    }

    const parsed = JSON.parse(responseText);

    // Validate and normalize the response
    const suggestions: PlatingMethodSuggestion[] = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.map((s: Record<string, unknown>) => ({
          method: (s.method as string) || '',
          confidence: (s.confidence as 'high' | 'medium' | 'low') || 'medium',
          reasoning: (s.reasoning as string) || '',
        }))
      : [];

    return {
      suggestions,
      dishCategory: parsed.dishCategory,
      overallReasoning: parsed.overallReasoning,
      method: 'ai',
    };
  } catch (err) {
    logger.error('[Plating Method Detection] AI detection failed:', err);
    // Fallback to default suggestions
    return getFallbackSuggestions(dishName, ingredients);
  }
}

/**
 * Fallback suggestions when AI is not available
 *
 * @param dishName - Name of the dish
 * @param ingredients - List of ingredients
 * @returns Default plating method suggestions
 */
function getFallbackSuggestions(
  dishName: string,
  _ingredients: Ingredient[],
): PlatingMethodDetectionResult {
  const dishNameLower = dishName.toLowerCase();

  // Simple heuristics based on dish name
  const suggestions: PlatingMethodSuggestion[] = [];

  // Soup/stew/bowl dishes
  if (
    dishNameLower.includes('soup') ||
    dishNameLower.includes('stew') ||
    dishNameLower.includes('bowl') ||
    dishNameLower.includes('salad')
  ) {
    suggestions.push({
      method: 'super_bowl',
      confidence: 'high',
      reasoning: 'Bowl-based dishes work well with super bowl technique',
    });
  }

  // Desserts
  if (
    dishNameLower.includes('dessert') ||
    dishNameLower.includes('cake') ||
    dishNameLower.includes('tart') ||
    dishNameLower.includes('mousse')
  ) {
    suggestions.push({
      method: 'deconstructed',
      confidence: 'high',
      reasoning: 'Desserts often benefit from deconstructed presentation',
    });
    suggestions.push({
      method: 'stacking',
      confidence: 'medium',
      reasoning: 'Stacking creates visual interest for desserts',
    });
  }

  // Always include classic as a safe default
  suggestions.push({
    method: 'classic',
    confidence: 'high',
    reasoning: 'Classic plating works well for most dishes',
  });

  // Add modern for contemporary dishes
  suggestions.push({
    method: 'modern',
    confidence: 'medium',
    reasoning: 'Modern plating adds contemporary appeal',
  });

  return {
    suggestions: suggestions.slice(0, 4), // Limit to 4 suggestions
    method: 'fallback',
  };
}
