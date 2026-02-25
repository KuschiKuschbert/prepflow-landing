/**
 * Helpers for JSONStorage. Extracted for filesize limit.
 */
import { v4 as uuidv4 } from 'uuid';
import type { ScrapedRecipe } from '../../types';

export function generateRecipeFilename(recipe: ScrapedRecipe): string {
  const sanitized = recipe.recipe_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);

  let id = recipe.id || uuidv4();
  if (id.startsWith('http://') || id.startsWith('https://')) {
    try {
      const urlObj = new URL(id);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const numericId = pathParts.find(part => /^\d+$/.test(part));
      if (numericId) id = numericId;
      else {
        const lastPart = pathParts[pathParts.length - 1] || '';
        id = lastPart || urlObj.pathname.replace(/[^a-z0-9]/gi, '-').substring(0, 32);
      }
    } catch {
      const urlParts = id.split('/').filter(Boolean);
      id = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '' || uuidv4();
    }
  }

  const sanitizedId = id
    .replace(/[^a-z0-9-]/gi, '')
    .replace(/^-+|-+$/g, '')
    .substring(0, 32);
  const finalId = sanitizedId || uuidv4().substring(0, 8);
  return `${sanitized}-${finalId}.json.gz`;
}
