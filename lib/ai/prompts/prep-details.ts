/**
 * Prep Details AI Prompt
 *
 * Extracts detailed prep information from recipes including cut shapes, sauces, marination, etc.
 */

import type { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';

export function buildPrepDetailsPrompt(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
  instructions?: string | null,
): string {
  const ingredientList = ingredients
    .map(ri => `- ${ri.ingredients.ingredient_name}: ${ri.quantity} ${ri.unit}`)
    .join('\n');

  const instructionsText = instructions || recipe.instructions || 'No instructions provided';

  const prompt = `You are a professional chef analyzing a recipe to extract detailed prep information for kitchen prep lists.

**Recipe Information:**
- Name: ${recipe.recipe_name}
- Description: ${recipe.description || 'No description'}
- Yield: ${recipe.yield} ${recipe.yield_unit}

**Ingredients:**
${ingredientList}

**Instructions:**
${instructionsText}

**Your Task:**
Analyze the recipe and extract ALL prep details in the following structured format. Return ONLY valid JSON, no markdown, no explanations.

Extract:
1. **Cut Shapes**: Specific cutting techniques for each ingredient (e.g., diced, julienned, brunoise, chiffonade, minced, sliced, etc.)
2. **Sauces**: Any sauces, dressings, or condiments that need to be prepared separately
3. **Marination**: Ingredients that need marination, including method and duration
4. **Pre-Cooking Steps**: Any ingredients that need pre-cooking (blanching, roasting, etc.)
5. **Special Techniques**: Any special prep techniques (brining, curing, fermenting, etc.)

**Required JSON Format:**
{
  "cutShapes": [
    {
      "ingredient": "onion",
      "shape": "diced",
      "quantity": "2 cups"
    }
  ],
  "sauces": [
    {
      "name": "Honey Mustard Dressing",
      "ingredients": ["honey", "dijon mustard", "olive oil", "lemon juice"],
      "instructions": "Whisk together honey, mustard, olive oil, and lemon juice until emulsified"
    }
  ],
  "marinations": [
    {
      "ingredient": "chicken breast",
      "method": "marinate in olive oil, garlic, lemon juice, and herbs",
      "duration": "30 minutes minimum, up to 4 hours"
    }
  ],
  "preCookingSteps": [
    {
      "ingredient": "potatoes",
      "step": "parboil for 10 minutes, then roast"
    }
  ],
  "specialTechniques": [
    {
      "description": "Toast spices before grinding",
      "details": "Toast cumin and coriander seeds in dry pan until fragrant, then grind"
    }
  ]
}

**Important:**
- Only include prep details that are explicitly mentioned or clearly implied
- Use professional kitchen terminology
- Be specific about quantities and methods
- Group similar prep techniques together
- If no prep details exist for a category, return empty array []
- Match ingredient names to the provided ingredient list
- Return valid JSON only, no markdown formatting`;

  return prompt;
}

/**
 * Parse AI response into structured prep details
 */
export function parsePrepDetailsResponse(aiResponse: string): {
  cutShapes: Array<{ ingredient: string; shape: string; quantity?: string }>;
  sauces: Array<{ name: string; ingredients: string[]; instructions: string }>;
  marinations: Array<{ ingredient: string; method: string; duration?: string }>;
  preCookingSteps: Array<{ ingredient: string; step: string }>;
  specialTechniques: Array<{ description: string; details?: string }>;
} {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        cutShapes: Array.isArray(parsed.cutShapes) ? parsed.cutShapes : [],
        sauces: Array.isArray(parsed.sauces) ? parsed.sauces : [],
        marinations: Array.isArray(parsed.marinations) ? parsed.marinations : [],
        preCookingSteps: Array.isArray(parsed.preCookingSteps) ? parsed.preCookingSteps : [],
        specialTechniques: Array.isArray(parsed.specialTechniques) ? parsed.specialTechniques : [],
      };
    }
  } catch (_error) {
    // Fallback: return empty structure
  }

  // Fallback: return empty structure
  return {
    cutShapes: [],
    sauces: [],
    marinations: [],
    preCookingSteps: [],
    specialTechniques: [],
  };
}
