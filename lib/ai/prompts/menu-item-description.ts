/**
 * Menu Item Description AI Prompt
 *
 * Generates professional, appetizing menu descriptions for dishes and recipes
 */

import type { MenuItem } from '@/app/webapp/menu-builder/types';
import { getAllergenDisplayName } from '@/lib/allergens/australian-allergens';

/**
 * Build AI prompt for generating menu item descriptions.
 *
 * @param {MenuItem} menuItem - Menu item (dish or recipe)
 * @param {any[]} [ingredients] - Optional ingredients list for recipes
 * @returns {string} AI prompt for description generation
 */
export function buildMenuItemDescriptionPrompt(
  menuItem: MenuItem,
  ingredients?: Record<string, unknown>[],
): string {
  const isDish = !!menuItem.dish_id;
  const isRecipe = !!menuItem.recipe_id;

  const itemName = isDish
    ? menuItem.dishes?.dish_name || 'Unknown Dish'
    : menuItem.recipes?.recipe_name || 'Unknown Recipe';

  const existingDescription = isDish ? menuItem.dishes?.description : menuItem.recipes?.description;

  const allergens = menuItem.allergens || [];
  const allergenList =
    allergens.length > 0 ? allergens.map(code => getAllergenDisplayName(code)).join(', ') : 'None';

  const dietaryInfo: string[] = [];
  if (menuItem.is_vegetarian) dietaryInfo.push('vegetarian');
  if (menuItem.is_vegan) dietaryInfo.push('vegan');
  const dietaryText = dietaryInfo.length > 0 ? dietaryInfo.join(', ') : 'Standard';

  const price = menuItem.actual_selling_price || menuItem.recommended_selling_price || 0;

  let ingredientText = '';
  if (ingredients && ingredients.length > 0) {
    const ingredientNames = ingredients
      .map(
        ing =>
          ((ing.ingredients as Record<string, unknown>)?.ingredient_name as string) ||
          (ing.ingredient_name as string) ||
          '',
      )
      .filter(Boolean)
      .slice(0, 10); // Limit to first 10 ingredients
    ingredientText = `\n**Key Ingredients:**\n${ingredientNames.map(name => `- ${name}`).join('\n')}`;
  }

  const prompt = `You are a professional restaurant menu writer creating an appetizing, professional menu description for a dish.

**Menu Item Information:**
- Name: ${itemName}
- Type: ${isDish ? 'Dish' : 'Recipe'}
- Current Description: ${existingDescription || 'None - needs to be created'}
- Price: $${price.toFixed(2)}
- Allergens: ${allergenList}
- Dietary: ${dietaryText}${ingredientText}

**Your Task:**
Generate a professional, appetizing menu description for this item. The description should:

1. **Be concise and compelling:**
   - 1-2 sentences maximum (30-50 words)
   - Appetizing and mouth-watering
   - Highlight key flavors, textures, or cooking methods
   - Use descriptive, professional language

2. **Be accurate:**
   - Reflect the ingredients and preparation style
   - Match dietary information (vegetarian/vegan if applicable)
   - Avoid mentioning allergens (they're listed separately)

3. **Use professional menu language:**
   - Avoid clichés like "delicious" or "amazing"
   - Focus on specific flavors, textures, and techniques
   - Use active, descriptive verbs (braised, roasted, seared, etc.)
   - Highlight unique or standout ingredients

4. **Examples of good descriptions:**
   - "Slow-braised beef short ribs with red wine reduction, served over creamy mashed potatoes and seasonal vegetables."
   - "Pan-seared salmon fillet with lemon butter sauce, accompanied by roasted asparagus and herbed quinoa."
   - "House-made pasta tossed in a rich tomato basil sauce with fresh mozzarella and parmesan."

**Important:**
- Return ONLY the description text, no additional commentary
- Do not include the item name in the description
- Do not include price information
- Keep it professional and appetizing
- Make it sound like it belongs on a high-quality restaurant menu

Generate the menu description now:`;

  return prompt;
}
