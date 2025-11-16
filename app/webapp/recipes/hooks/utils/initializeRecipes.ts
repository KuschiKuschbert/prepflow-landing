import { Recipe } from '../../types';
import { getCachedRecipes, prefetchRecipes } from '@/lib/cache/recipe-cache';

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
    setRecipes(cached);
    setIsHydrated(true);
    return cached;
  }

  prefetchRecipes();
  return [];
}
