import { logger } from '@/lib/logger';

/**
 * AI Specials Prompt
 *
 * Generates prompt for analyzing food images and suggesting specials
 */

export interface WeatherContext {
  temp_celsius: number | null;
  weather_status: string;
}

export async function buildAISpecialsPrompt(
  customPrompt?: string,
  detectedIngredients?: string[],
  weatherContext?: WeatherContext | null,
): Promise<string> {
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
- Think about cost-effectiveness and profit margins`;

  // Add recipe database context if ingredients are detected
  let recipeContext = '';
  if (detectedIngredients && detectedIngredients.length > 0) {
    try {
      // Dynamic import to handle module load failures gracefully
      const recipeDatabase = await import('../recipe-database');
      const similarRecipes = await recipeDatabase.searchRecipesByIngredients(
        detectedIngredients,
        3,
      );
      if (similarRecipes.length > 0) {
        recipeContext = recipeDatabase.formatRecipesForPrompt(similarRecipes);
      }
    } catch (error) {
      // Gracefully degrade - continue without recipe context
      logger.warn('Recipe database unavailable, continuing without context:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  const outputFormat = `
**Output Format:**
Return a JSON object with this structure:
{
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "suggestions": ["special 1", "special 2", ...],
  "confidence": 0.0-1.0,
  "notes": "Additional professional insights"
}`;

  let fullPrompt = basePrompt;

  if (recipeContext) {
    fullPrompt += `\n\n${recipeContext}\n\n**Use these similar recipes as inspiration, but adapt them to create unique specials that showcase the ingredients in the photo.**`;
  }

  if (
    weatherContext &&
    (weatherContext.weather_status !== 'Unavailable' || weatherContext.temp_celsius != null)
  ) {
    const tempStr =
      weatherContext.temp_celsius != null ? `${Math.round(weatherContext.temp_celsius)}°C` : '';
    const conditions =
      tempStr && weatherContext.weather_status
        ? `${weatherContext.weather_status}, ${tempStr}`
        : weatherContext.weather_status || tempStr;
    fullPrompt += `\n\n**Today's Conditions:** ${conditions}. Suggest specials that suit these conditions—e.g. refreshing cold dishes on hot days, warm comfort food on cold or rainy days.`;
  }

  fullPrompt += outputFormat;

  if (customPrompt) {
    fullPrompt += `\n\n**Additional Context:**\n${customPrompt}`;
  }

  return fullPrompt;
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
