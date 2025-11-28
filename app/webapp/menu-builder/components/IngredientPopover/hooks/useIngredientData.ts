import { useEffect, useState, useRef } from 'react';
import { logger } from '@/lib/logger';
import { fetchDishIngredients } from './useIngredientData/helpers/fetchDishIngredients';
import { fetchRecipeIngredients } from './useIngredientData/helpers/fetchRecipeIngredients';

export interface IngredientData {
  id: string;
  ingredient_name: string;
  brand?: string;
  quantity?: number;
  unit?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

export interface RecipeSource {
  source_type: 'recipe';
  source_id: string;
  source_name: string;
  quantity?: number;
  unit?: string;
}

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
          const recipeIngredients = await fetchRecipeIngredients(menuItemId);
          setIngredients(recipeIngredients);
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
