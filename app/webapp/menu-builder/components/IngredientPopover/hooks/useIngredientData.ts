import { logger } from '@/lib/logger';
import { useEffect, useRef, useState } from 'react';
import { fetchDishIngredients } from './useIngredientData/helpers/fetchDishIngredients';
import { fetchRecipeIngredients } from './useIngredientData/helpers/fetchRecipeIngredients';
import type { IngredientData, RecipeSource } from './useIngredientData/ingredient-data-types';

export type { IngredientData, RecipeSource } from './useIngredientData/ingredient-data-types';

export function useIngredientData(
  isOpen: boolean,
  menuItemId: string,
  menuItemType: 'dish' | 'recipe',
) {
  const [ingredients, setIngredients] = useState<IngredientData[]>([]);
  const [recipeSources, setRecipeSources] = useState<RecipeSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen || previousOpenRef.current === isOpen) {
      previousOpenRef.current = isOpen;
      return;
    }
    previousOpenRef.current = isOpen;

    if (!isOpen) {
      return;
    }

    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);
      setIngredients([]);
      setRecipeSources([]);

      try {
        if (menuItemType === 'dish') {
          const { ingredients: dishIngredients, recipeSources: dishRecipes } =
            await fetchDishIngredients(menuItemId);
          setIngredients(dishIngredients);
          setRecipeSources(dishRecipes);
        } else {
          const allIngredients: IngredientData[] = [];
          await fetchRecipeIngredients(menuItemId, allIngredients);
          setIngredients(allIngredients);
        }
      } catch (err) {
        logger.error('[IngredientPopover] Error fetching ingredients:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ingredients');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [isOpen, menuItemId, menuItemType]);

  return { ingredients, recipeSources, loading, error };
}
