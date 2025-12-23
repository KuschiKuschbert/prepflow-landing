import { logger } from '@/lib/logger';
import { detectVegetarianVeganFromIngredients } from './detectFromIngredients';
import type { Ingredient, DietaryDetectionResult } from './detectFromIngredients';

/**
 * Detect vegetarian/vegan suitability using AI (fallback)
 * Uses OpenAI API to analyze the recipe
 */
export async function detectVegetarianVeganWithAI(
  recipeName: string,
  ingredients: Ingredient[],
  description?: string,
): Promise<DietaryDetectionResult> {
  const { isAIEnabled, generateTextWithHuggingFace, getHuggingFaceTextModel } =
    await import('@/lib/ai/huggingface-client');

  if (!isAIEnabled()) {
    logger.warn('[Dietary Detection] AI not enabled, falling back to non-AI detection');
    return detectVegetarianVeganFromIngredients(ingredients, recipeName);
  }

  try {
    const ingredientNames = ingredients.map(i => i.ingredient_name).join(', ');
    const allergenInfo = ingredients
      .filter(i => i.allergens && i.allergens.length > 0)
      .map(i => `${i.ingredient_name}: ${i.allergens?.join(', ')}`)
      .join('; ');

    const prompt = `Analyze the following recipe to determine if it is suitable for vegetarians and vegans.

Recipe Name: ${recipeName}
${description ? `Description: ${description}` : ''}
Ingredients: ${ingredientNames}
${allergenInfo ? `Known Allergens: ${allergenInfo}` : ''}

Please determine:
1. Is this recipe suitable for vegetarians? (vegetarians don't eat meat, fish, or poultry, but may eat dairy and eggs)
2. Is this recipe suitable for vegans? (vegans don't eat any animal products including meat, fish, poultry, dairy, eggs, honey, etc.)

Respond in JSON format:
{
  "isVegetarian": boolean,
  "isVegan": boolean,
  "confidence": "high" | "medium" | "low",
  "reason": "brief explanation"
}`;

    const messages = [
      {
        role: 'system' as const,
        content:
          'You are a dietary analysis expert. Analyze recipes and determine their suitability for vegetarians and vegans. Always respond with valid JSON.',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ];

    const result = await generateTextWithHuggingFace(messages, {
      model: getHuggingFaceTextModel(),
      temperature: 0.3,
      maxTokens: 500,
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

    const parsed = JSON.parse(responseText);
    return {
      isVegetarian: parsed.isVegetarian === true,
      isVegan: parsed.isVegan === true,
      confidence: parsed.confidence || 'medium',
      reason: parsed.reason,
      method: 'ai',
    };
  } catch (err) {
    logger.error('[Dietary Detection] AI detection failed:', err);
    // Fallback to non-AI detection
    return detectVegetarianVeganFromIngredients(ingredients, recipeName);
  }
}

