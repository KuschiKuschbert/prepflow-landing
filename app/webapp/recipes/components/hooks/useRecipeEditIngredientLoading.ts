import { useState, useEffect, useRef } from 'react';
import { Recipe } from '../../types';
import { COGSCalculation, Ingredient } from '../../../cogs/types';
import { logger } from '@/lib/logger';
import { processRecipeIngredients } from './useRecipeEditIngredientLoading/helpers/processRecipeIngredients';

interface UseRecipeEditIngredientLoadingProps {
  recipe: Recipe | null;
  ingredients: Ingredient[];
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote?: string };
  showError: (message: string) => void;
}

export function useRecipeEditIngredientLoading({
  recipe,
  ingredients,
  convertIngredientQuantity,
  showError,
}: UseRecipeEditIngredientLoadingProps) {
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const convertIngredientQuantityRef = useRef(convertIngredientQuantity);
  const showErrorRef = useRef(showError);

  useEffect(() => {
    convertIngredientQuantityRef.current = convertIngredientQuantity;
    showErrorRef.current = showError;
  }, [convertIngredientQuantity, showError]);

  useEffect(() => {
    const loadIngredients = async () => {
      if (!recipe || !recipe.id || ingredients.length === 0) {
        setCalculations([]);
        setLoadingIngredients(false);
        return;
      }

      setLoadingIngredients(true);
      try {
        const response = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recipe ingredients: ${response.statusText}`);
        }

        const data = await response.json();
        const recipeIngredients = data.items || [];
        if (recipeIngredients.length > 0) {
          setCalculations(processRecipeIngredients(recipeIngredients, recipe, ingredients, convertIngredientQuantityRef.current));
        } else {
          setCalculations([]);
        }
      } catch (err) {
        logger.error('Failed to load recipe ingredients:', err);
        showErrorRef.current('Failed to load recipe ingredients');
        setCalculations([]);
      } finally {
        setLoadingIngredients(false);
      }
    };

    if (recipe && ingredients.length > 0) {
      loadIngredients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.id, ingredients.length]);

  return { calculations, setCalculations, loadingIngredients };
}
