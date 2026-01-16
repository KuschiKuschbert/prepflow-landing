import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

interface Ingredient {
  category?: string;
}

interface UseAutoCategorizationProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  handleCategorizeAllUncategorized: (
    silent: boolean,
    refetchIngredients: () => void,
  ) => Promise<void>;
  refetchIngredients: () => void;
}

/**
 * Hook to handle auto-categorization of uncategorized ingredients on first load
 */
export function useAutoCategorization({
  ingredients,
  isLoading,
  handleCategorizeAllUncategorized,
  refetchIngredients,
}: UseAutoCategorizationProps) {
  const [hasAutoCategorized, setHasAutoCategorized] = useState(false);

  useEffect(() => {
    if (
      !hasAutoCategorized &&
      !isLoading &&
      ingredients.length > 0 &&
      ingredients.some(ing => !ing.category || ing.category.trim() === '')
    ) {
      setHasAutoCategorized(true);
      handleCategorizeAllUncategorized(true, refetchIngredients).catch((err: unknown) => {
        logger.error('Auto-categorization failed:', {
          error: err instanceof Error ? err.message : String(err),
        });
      });
    }
  }, [
    ingredients,
    isLoading,
    hasAutoCategorized,
    handleCategorizeAllUncategorized,
    refetchIngredients,
  ]);

  return hasAutoCategorized;
}
