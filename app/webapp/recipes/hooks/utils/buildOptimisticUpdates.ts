import { Recipe } from '@/lib/types/recipes';

import { logger } from '@/lib/logger';
/**
 * Build optimistic update functions for recipe mutations.
 *
 * @param {Function} setRecipes - State setter for recipes
 * @param {Function} fetchRecipes - Function to fetch recipes
 * @param {Function} setError - State setter for error
 * @returns {Object} Optimistic update functions
 */
export function buildOptimisticUpdates(
  setRecipes: (recipes: Recipe[] | ((prev: Recipe[]) => Recipe[])) => void,
  fetchRecipes: () => Promise<void>,
  setError: (error: string | null) => void,
) {
  const optimisticallyUpdateRecipes = (updater: (recipes: Recipe[]) => Recipe[]) => {
    setRecipes(prev => updater(prev));
  };

  const rollbackRecipes = () => {
    fetchRecipes().catch(err => {
      logger.error('Failed to rollback recipes:', err);
      setError('Failed to refresh recipes after error');
    });
  };

  return { optimisticallyUpdateRecipes, rollbackRecipes };
}
