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

  useEffect(() => {
    convertIngredientQuantityRef.current = convertIngredientQuantity;
    showErrorRef.current = showError;
    const loadIngredients = async () => {
      if (!selectedItem || !selectedItem.id || selectedItem.id === '' || ingredients.length === 0) {
        setCalculations([]);
        setLoadingIngredients(false);
        return;
      }
      setLoadingIngredients(true);
      try {
        if (selectedItem.type === 'recipe') {
          const loadedCalculations = await loadRecipeIngredients({
            recipeId: selectedItem.id,
            allRecipes,
            ingredients,
            convertIngredientQuantity: convertIngredientQuantityRef.current,
          });
          setCalculations(loadedCalculations);
        } else {
          const loadedCalculations = await loadDishIngredients({
            dishId: selectedItem.id,
            recipes,
            ingredients,
            convertIngredientQuantity: convertIngredientQuantityRef.current,
          });
          setCalculations(loadedCalculations);
        }
      } catch (err) {
        logger.error('Failed to load ingredients:', err);
        showErrorRef.current('Failed to load ingredients');
        setCalculations([]);
      } finally {
        setLoadingIngredients(false);
      }
    };
    if (selectedItem && ingredients.length > 0) loadIngredients();
  }, [convertIngredientQuantity, showError, selectedItem, ingredients, recipes, allRecipes]);
  return { calculations, setCalculations, loadingIngredients };
}
