/**
 * Format helpers for recipe database
 */

import { ScrapedRecipe } from '../../../../scripts/recipe-scraper/parsers/types';

const PROFESSIONAL_SOURCES = new Set([
  'serious-eats',
  'food-network',
  'epicurious',
  'bon-appetit',
  'food52',
  'simply-recipes',
  'smitten-kitchen',
  'the-kitchn',
  'delish',
]);

/**
 * Format recipes for AI prompt context
 */
export function formatRecipesForPrompt(recipes: ScrapedRecipe[]): string {
  if (recipes.length === 0) {
    return '';
  }

  const formatted = recipes.map((recipe, index) => {
    const ingredients = recipe.ingredients
      .map(ing => (typeof ing === 'string' ? ing : ing.original_text))
      .join(', ');

    const sourceDisplay = recipe.source.replace(/-/g, ' ');
    const isProfessional = PROFESSIONAL_SOURCES.has(recipe.source);
    const sourceQuality = isProfessional ? 'Professional source' : 'User-rated source';
    const ratingDisplay = recipe.rating
      ? ` (${recipe.rating.toFixed(1)}★ ${sourceQuality})`
      : ` (${sourceQuality})`;

    return `
Recipe ${index + 1}: ${recipe.recipe_name}${ratingDisplay}
- Source: ${sourceDisplay}
- Ingredients: ${ingredients}
- Instructions: ${recipe.instructions.slice(0, 3).join('; ')}${recipe.instructions.length > 3 ? '...' : ''}
${recipe.category ? `- Category: ${recipe.category}` : ''}
${recipe.cuisine ? `- Cuisine: ${recipe.cuisine}` : ''}
${recipe.dietary_tags && recipe.dietary_tags.length > 0 ? `- Dietary: ${recipe.dietary_tags.join(', ')}` : ''}
${recipe.rating ? `- Rating: ${recipe.rating.toFixed(1)}/5.0` : ''}
`;
  });

  return `
Similar recipes from our database that use these ingredients:
${formatted.join('\n')}
`;
}
