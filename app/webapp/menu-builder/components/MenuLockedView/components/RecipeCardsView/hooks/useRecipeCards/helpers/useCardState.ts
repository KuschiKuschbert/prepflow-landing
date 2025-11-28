/**
 * Hook for managing recipe card state.
 */

import { useState } from 'react';
import { RecipeCardData, SubRecipeCards } from '../../../types';

/**
 * Hook for managing recipe card state.
 */
export function useCardState() {
  const [cards, setCards] = useState<RecipeCardData[]>([]);
  const [subRecipeCards, setSubRecipeCards] = useState<SubRecipeCards>({
    sauces: [],
    marinades: [],
    brines: [],
    slowCooked: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    cards,
    setCards,
    subRecipeCards,
    setSubRecipeCards,
    loading,
    setLoading,
    error,
    setError,
  };
}
