import { logger } from '@/lib/logger';
/**
 * AI Specials Prompt
 *
 * Generates prompt for analyzing food images and suggesting specials
 */

export function buildAISpecialsPrompt(customPrompt?: string): string {
  const basePrompt = `You are a professional restaurant chef analyzing a photo of ingredients or prepared food.

**Your Task:**
Analyze the image and identify:
1. All visible ingredients (be specific - e.g., "Fresh Roma tomatoes" not just "tomatoes")
2. Suggested menu specials that would showcase these ingredients
3. Preparation methods that would highlight ingredient quality
4. Pricing considerations based on ingredient value

**Guidelines:**
- Be specific about ingredient quality and freshness
- Suggest 3-5 menu specials that would work well
- Consider seasonal availability and ingredient combinations
- Provide professional kitchen recommendations
- Think about cost-effectiveness and profit margins

**Output Format:**
Return a JSON object with this structure:
{
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "suggestions": ["special 1", "special 2", ...],
  "confidence": 0.0-1.0,
  "notes": "Additional professional insights"
}`;

  if (customPrompt) {
    return `${basePrompt}\n\n**Additional Context:**\n${customPrompt}`;
  }

  return basePrompt;
}

/**
 * Parse AI response into structured format
 */
export function parseAISpecialsResponse(aiResponse: string): {
  ingredients: string[];
  suggestions: string[];
  confidence: number;
  notes?: string;
} {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
        notes: parsed.notes || undefined,
      };
    }
  } catch (error) {
    logger.warn('Failed to parse AI specials response:', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Fallback: Try to extract lists from text
  const ingredientsMatch = aiResponse.match(/ingredients?[:\s]+\[?([^\]]+)\]?/i);
  const suggestionsMatch = aiResponse.match(/suggestions?[:\s]+\[?([^\]]+)\]?/i);

  return {
    ingredients: ingredientsMatch
      ? ingredientsMatch[1]
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [],
    suggestions: suggestionsMatch
      ? suggestionsMatch[1]
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [],
    confidence: 0.7,
    notes: 'Parsed from text response',
  };
}
