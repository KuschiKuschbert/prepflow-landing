import { useState, useEffect, useRef } from 'react';
import { RecipeDishItem } from './useRecipeDishEditorData';
import { Recipe } from '@/lib/types/recipes';
import { COGSCalculation, Ingredient } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';
import { loadIngredientsForItem } from './useRecipeDishIngredientLoading/helpers/loadIngredientsForItem';

interface UseRecipeDishIngredientLoadingProps {
  selectedItem: RecipeDishItem | null;
  ingredients: Ingredient[];
  recipes: Recipe[];
  allRecipes: Recipe[];
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote?: string };
  showError: (message: string) => void;
}

export function useRecipeDishIngredientLoading({
  selectedItem,
  ingredients,
  recipes,
  allRecipes,
  convertIngredientQuantity,
  showError,
}: UseRecipeDishIngredientLoadingProps) {
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const convertIngredientQuantityRef = useRef(convertIngredientQuantity);
  const showErrorRef = useRef(showError);
  const previousSelectedItemIdRef = useRef<string | null>(null);
  const loadedItemIdRef = useRef<string | null>(null);

  // Update refs when functions change (but don't trigger effect)
  useEffect(() => {
    convertIngredientQuantityRef.current = convertIngredientQuantity;
    showErrorRef.current = showError;
  }, [convertIngredientQuantity, showError]);

  useEffect(() => {
    const selectedItemId = selectedItem?.id || null;
    if (!selectedItemId) {
      if (previousSelectedItemIdRef.current !== null) {
        setCalculations([]);
        setLoadingIngredients(false);
        previousSelectedItemIdRef.current = null;
        loadedItemIdRef.current = null;
      }
      return;
    }
    if (selectedItemId === loadedItemIdRef.current && ingredients.length > 0) return;
    if (ingredients.length === 0) return;

    const loadIngredients = async () => {
      if (!selectedItem) return;
      setLoadingIngredients(true);
      try {
        const loadedCalculations = await loadIngredientsForItem({
          selectedItem,
          allRecipes,
          recipes,
          ingredients,
          convertIngredientQuantity: convertIngredientQuantityRef.current,
        });
        previousSelectedItemIdRef.current = selectedItemId;
        loadedItemIdRef.current = selectedItemId;
        setCalculations(loadedCalculations);
      } catch (err) {
        logger.error('Failed to load ingredients:', err);
        showErrorRef.current('Failed to load ingredients');
        setCalculations([]);
      } finally {
        setLoadingIngredients(false);
      }
    };
    loadIngredients();
  }, [selectedItem, selectedItem?.id, selectedItem?.type, ingredients, recipes, allRecipes]);
  return { calculations, setCalculations, loadingIngredients };
}
