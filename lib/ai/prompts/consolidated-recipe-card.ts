/**
 * Consolidated Recipe Card AI Prompt
 *
 * Generates a unified recipe card for a menu item, consolidating sub-recipes
 * and generating missing instructions.
 */

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

interface SubRecipe {
  name: string;
  ingredients: Ingredient[];
  instructions?: string;
}

interface MenuItemDetails {
  name: string;
  description?: string;
  yield?: string;
  ingredients: Ingredient[];
  subRecipes: SubRecipe[];
  existingInstructions?: string;
}

export function buildConsolidatedRecipeCardPrompt(details: MenuItemDetails): string {
  const ingredientsList = details.ingredients
    .map(i => `- ${i.name} | ${i.quantity} | ${i.unit}${i.notes ? ` (${i.notes})` : ''}`)
    .join('\n');

  const subRecipesList = details.subRecipes
    .map(
      sr => `
### Sub-Recipe: ${sr.name}
**Ingredients:**
${sr.ingredients.map(i => `- ${i.name} | ${i.quantity} | ${i.unit}`).join('\n')}
**Existing Instructions:**
${sr.instructions || 'None provided'}
`,
    )
    .join('\n');

  return `You are a professional executive chef creating a standard recipe card for a restaurant kitchen.

**Menu Item:** ${details.name}
**Description:** ${details.description || 'N/A'}
**Yield:** ${details.yield || '1 serving'}

**Primary Ingredients (per serving):**
${ingredientsList}

**Sub-Recipes / Components:**
${subRecipesList || 'None'}

**Base Instructions Provided:**
${details.existingInstructions || 'None'}

**Your Task:**
Create a single, consolidated recipe card following professional kitchen workflow standards.

**Critical Requirements:**

1. **Consolidate Methods:** Combine all instructions (main item + sub-recipes) into ONE unified workflow. Do not list sub-recipes separately - integrate their steps into the main method.

2. **Generate Missing Steps:** If instructions are missing, generate professional culinary steps based on:
   - Dish/recipe name and regional style
   - Included ingredients and their typical preparation methods
   - Common professional culinary techniques for this type of dish

3. **Professional Kitchen Workflow Ordering (MANDATORY):**
   - **Mise en Place:** Prep all ingredients first (cutting, measuring, marinating)
   - **Sub-Recipe Prep:** Prepare any sub-recipes/components before main cooking
   - **Cooking:** Apply heat, batch cooking, timing coordination
   - **Assembly:** Combine components in logical order
   - **Plating/Service:** Final presentation, garnish, holding instructions

4. **Efficiency Focus:** Order steps for maximum kitchen efficiency - batch prep where sensible, coordinate timing, minimize steps.

**REQUIRED OUTPUT FORMAT (follow EXACTLY):**

Title: ${details.name}
Yield/Portions: 1
Ingredients:
- [Ingredient Name] | [Quantity] | [Unit]
- [Ingredient Name] | [Quantity] | [Unit]
(List ALL ingredients from main item and sub-recipes, flattened into single list)

Method:
1. [First step - mise en place or prep]
2. [Second step - continue logical workflow]
3. [Continue numbered steps in kitchen order]
...

Notes:
- [Allergen information if applicable]
- [Special equipment needed]
- [Holding times and storage instructions]
- [Service notes and plating guidelines]

**Formatting Rules:**
- Use EXACT format above with pipe separators (|) for ingredients
- Number method steps sequentially (1., 2., 3., etc.)
- Use imperative mood ("Chop onions", "Sear steak", "Combine ingredients")
- Be concise but complete - every step needed to finish the dish
- Include timing, temperatures, and techniques where relevant
- No conversational filler or explanations outside the format
`;
}
