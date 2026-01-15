import { getCachedRecipes, prefetchRecipes } from '@/lib/cache/recipe-cache';
import { Recipe } from '../../types';

/**
 * Initialize recipes from cache on client-side mount.
 *
 * @param {Function} setRecipes - State setter for recipes
 * @param {Function} setIsHydrated - State setter for hydration flag
 * @returns {Recipe[]} Cached recipes or empty array
 */
export function initializeRecipes(
  setRecipes: (recipes: Recipe[]) => void,
  setIsHydrated: (hydrated: boolean) => void,
): Recipe[] {
  if (typeof window === 'undefined') return [];

  const cached = getCachedRecipes();
  if (cached && cached.length > 0) {
    const recipes: Recipe[] = cached.map(scraped => ({
      id: scraped.id,
      recipe_name: scraped.recipe_name,
      description: scraped.description,
      instructions: Array.isArray(scraped.instructions)
        ? scraped.instructions.join('\n')
        : scraped.instructions || '',
      yield: scraped.yield || 1,
      yield_unit: scraped.yield_unit || 'servings',
      category: scraped.category,
      created_at: scraped.scraped_at,
      updated_at: scraped.updated_at || scraped.scraped_at,
      image_url: scraped.image_url,
      // Default values for required Recipe fields not present in ScrapedRecipe
      selling_price: 0,
    } as unknown as Recipe)); // Cast needed due to some differing optional/required fields potentially

    setRecipes(recipes);
    setIsHydrated(true);
    return recipes;
  }

  prefetchRecipes();
  return [];
}
