import { useState, useEffect, useRef } from 'react';
import { RecipeDishItem } from './useRecipeDishEditorData';
import { Recipe } from '../../types';
import { COGSCalculation, Ingredient } from '../../../cogs/types';
import { logger } from '@/lib/logger';
import {
  loadRecipeIngredients,
  loadDishIngredients,
} from './useRecipeDishIngredientLoading.helpers';

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

  // Load ingredients when selectedItem or data changes
  useEffect(() => {
    const selectedItemId = selectedItem?.id || null;

    // Handle deselection
    if (!selectedItemId) {
      if (previousSelectedItemIdRef.current !== null) {
        setCalculations([]);
        setLoadingIngredients(false);
        previousSelectedItemIdRef.current = null;
        loadedItemIdRef.current = null;
      }
      return;
    }

    // Skip if same item selected AND we've already loaded it successfully
    // This prevents reloading when clicking the same dish multiple times
    if (selectedItemId === loadedItemIdRef.current && ingredients.length > 0) {
      return;
    }

    // Don't try to load if ingredients not ready yet (but item is selected)
    if (ingredients.length === 0) {
      // Keep waiting for ingredients to load
      return;
    }

    const loadIngredients = async () => {
      setLoadingIngredients(true);
      try {
        let loadedCalculations: COGSCalculation[] = [];

        if (!selectedItem) {
          return;
        }

        if (selectedItem.type === 'recipe') {
          loadedCalculations = await loadRecipeIngredients({
            recipeId: selectedItem.id,
            allRecipes,
            ingredients,
            convertIngredientQuantity: convertIngredientQuantityRef.current,
          });
        } else {
          loadedCalculations = await loadDishIngredients({
            dishId: selectedItem.id,
            recipes,
            ingredients,
            convertIngredientQuantity: convertIngredientQuantityRef.current,
          });
        }

        // Only update refs after successful load to prevent unnecessary reloads
        previousSelectedItemIdRef.current = selectedItemId;
        loadedItemIdRef.current = selectedItemId;
        setCalculations(loadedCalculations);
      } catch (err) {
        logger.error('Failed to load ingredients:', err);
        showErrorRef.current('Failed to load ingredients');
        setCalculations([]);
        // Don't update ref on error, so it will retry next time
      } finally {
        setLoadingIngredients(false);
      }
    };

    loadIngredients();
    // Depend on selectedItem ID and arrays - arrays are stable from useCOGSDataFetching
  }, [selectedItem, selectedItem?.id, selectedItem?.type, ingredients, recipes, allRecipes]);
  return { calculations, setCalculations, loadingIngredients };
}
