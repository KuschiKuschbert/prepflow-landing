/**
 * Plating Method Detection AI Prompt
 *
 * Generates AI prompts to analyze dishes and suggest suitable plating methods
 */

import type { Ingredient } from '@/app/webapp/ingredients/types';

export interface PlatingMethodSuggestion {
  method: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export function buildPlatingMethodDetectionPrompt(
  dishName: string,
  ingredients: Ingredient[],
  description?: string,
): string {
  const ingredientNames = ingredients.map(i => i.ingredient_name).join(', ');
  const ingredientDetails = ingredients
    .map(i => {
      const details = [i.ingredient_name];
      if (i.category) details.push(`Category: ${i.category}`);
      if (i.storage_location) details.push(`Storage: ${i.storage_location}`);
      return details.join(', ');
    })
    .join('; ');

  const prompt = `You are a professional chef and food styling expert. Analyze the following dish to suggest the most suitable plating methods.

**Dish Information:**
- Name: ${dishName}
${description ? `- Description: ${description}` : ''}
- Ingredients: ${ingredientNames}
- Ingredient Details: ${ingredientDetails}

**Available Plating Methods:**
1. **Classic plating** - Traditional, centered presentation with main protein, starch, and vegetables arranged in a balanced, symmetrical way
2. **Landscape plating** - Horizontal arrangement creating visual flow across the plate, ideal for showcasing multiple components
3. **Futuristic technique** - Modern, geometric arrangements with precise placement, often using negative space and architectural elements
4. **Hide and seek technique** - Layered presentation where some ingredients are partially hidden, creating depth and intrigue
5. **Super bowl technique** - Deep bowl presentation with ingredients arranged in layers or concentric circles, great for soups, salads, and grain bowls
6. **Bathing plating** - Ingredients arranged in or around a sauce or broth, creating a "bathing" effect with visual appeal
7. **Deconstructed plating** - Components separated and arranged individually, allowing diners to see each element clearly
8. **Stacking method** - Vertical presentation with ingredients layered on top of each other, creating height and visual interest
9. **The brush stroke** - Artistic presentation mimicking brush strokes with sauces and purees, creating an abstract, painterly effect
10. **Free form** - Organic, asymmetrical arrangement that follows natural shapes and flows, less structured but visually dynamic

**Your Task:**
Analyze the dish and suggest 3-5 most suitable plating methods based on:
- Dish name and type (appetizer, main course, dessert, etc.)
- Ingredient characteristics (texture, color, shape, quantity)
- Dish category and cultural/regional context
- Visual appeal and practical considerations

Respond in JSON format:
{
  "suggestions": [
    {
      "method": "method_name",
      "confidence": "high" | "medium" | "low",
      "reasoning": "brief explanation of why this method suits this dish"
    }
  ],
  "dishCategory": "appetizer" | "main" | "dessert" | "side" | "other",
  "overallReasoning": "brief summary of the dish's characteristics that influenced the suggestions"
}

Return ONLY valid JSON, no additional text or markdown formatting.`;

  return prompt;
}

