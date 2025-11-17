/**
 * Recipe Instructions AI Prompt
 *
 * Generates professional kitchen instructions for recipes
 */

import type { Recipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';

export function buildRecipeInstructionsPrompt(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
): string {
  const ingredientList = ingredients
    .map(
      ri =>
        `- ${ri.ingredients.ingredient_name}: ${ri.quantity} ${ri.unit} (${ri.ingredients.cost_per_unit || 'N/A'} per ${ri.ingredients.unit || 'unit'})`,
    )
    .join('\n');

  const totalCost = ingredients.reduce(
    (sum, ri) => sum + ri.quantity * (ri.ingredients.cost_per_unit || 0),
    0,
  );

  const prompt = `You are a professional chef creating detailed cooking instructions for a restaurant kitchen.

**Recipe Information:**
- Name: ${recipe.name}
- Description: ${recipe.description || 'No description provided'}
- Yield: ${recipe.yield} ${recipe.yield_unit}
- Category: ${recipe.category || 'Not specified'}
- Total Cost: $${totalCost.toFixed(2)}

**Ingredients:**
${ingredientList}

**Your Task:**
Generate professional, detailed cooking instructions for this recipe. The instructions should:

1. **Follow professional kitchen structure:**
   - Mise en Place (preparation)
   - Ingredient Prep (specific cutting, seasoning, etc.)
   - Cooking Method (step-by-step cooking process)
   - Final Steps (plating, serving, storage)
   - Professional Tips (chef's notes for consistency)

2. **Be specific and actionable:**
   - Include exact temperatures, times, and techniques
   - Reference specific ingredients by name
   - Provide clear step-by-step instructions
   - Include yield information

3. **Use professional kitchen terminology:**
   - Use proper cooking terms (sauté, braise, sear, etc.)
   - Include mise en place organization
   - Reference standard kitchen equipment
   - Use professional plating techniques

4. **Be practical and efficient:**
   - Consider batch preparation
   - Include timing for multi-step processes
   - Provide storage and holding instructions
   - Include quality checkpoints

5. **Format as markdown:**
   - Use headers for sections (##)
   - Use numbered lists for steps
   - Use bullet points for tips
   - Bold important information

Return ONLY the formatted instructions, no additional commentary. Start with "## ${recipe.name} Preparation"`;

  return prompt;
}
