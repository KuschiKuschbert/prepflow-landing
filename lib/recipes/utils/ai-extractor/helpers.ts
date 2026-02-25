/**
 * AI Extractor helpers. Extracted for filesize limit.
 */
import * as cheerio from 'cheerio';
import type { RecipeIngredient, ScrapedRecipe } from '../../types';

export function extractRecipeTextFromHtml(html: string): {
  recipeText: string;
  recipeName: string;
  description: string;
} {
  const $ = cheerio.load(html);
  const recipeName =
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().trim() ||
    '';
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('.recipe-description, .recipe-summary').first().text().trim() ||
    '';

  const ingredients: string[] = [];
  const ingredientSelectors = [
    'li[itemprop="recipeIngredient"]',
    '.ingredient',
    '.ingredients-item',
    'ul.ingredients li',
    '[class*="ingredient"] li',
  ];
  for (const s of ingredientSelectors) {
    const found = $(s)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(t => t.length > 0 && t.length < 200);
    if (found.length > 0) {
      ingredients.push(...found);
      break;
    }
  }

  const instructions: string[] = [];
  const instructionSelectors = [
    'li[itemprop="recipeInstructions"]',
    '.instruction',
    '.step',
    '.direction',
    'ol.instructions li',
    '[class*="step"] li',
  ];
  for (const s of instructionSelectors) {
    const found = $(s)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(t => t.length > 0 && t.length < 500);
    if (found.length > 0) {
      instructions.push(...found);
      break;
    }
  }

  const recipeText = [
    `Recipe Name: ${recipeName}`,
    description ? `Description: ${description}` : '',
    ingredients.length > 0
      ? `Ingredients:\n${ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}`
      : '',
    instructions.length > 0
      ? `Instructions:\n${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return { recipeText, recipeName, description };
}

export function parseAIResponse(
  aiResponse: string,
  fallbackName: string,
  fallbackDescription: string,
  url: string,
): Partial<ScrapedRecipe> | null {
  try {
    const cleaned = aiResponse
      .trim()
      .replace(/```json\s*/g, '')
      .replace(/\s*```/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    const ingredients: RecipeIngredient[] = (parsed.ingredients || []).map((ing: string) => ({
      name: ing.replace(/^\d+\s*/, '').trim() || ing,
      original_text: ing,
    }));

    return {
      id: url,
      source_url: url,
      scraped_at: new Date().toISOString(),
      recipe_name: parsed.recipe_name || fallbackName || 'Untitled Recipe',
      description: parsed.description || fallbackDescription || '',
      ingredients,
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : undefined,
      yield: typeof parsed.yield === 'number' ? parsed.yield : undefined,
      prep_time_minutes:
        typeof parsed.prep_time_minutes === 'number' ? parsed.prep_time_minutes : undefined,
      cook_time_minutes:
        typeof parsed.cook_time_minutes === 'number' ? parsed.cook_time_minutes : undefined,
      rating: typeof parsed.rating === 'number' ? parsed.rating : undefined,
    };
  } catch {
    return null;
  }
}
