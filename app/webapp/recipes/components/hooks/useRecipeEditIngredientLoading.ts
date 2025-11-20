import { useState, useEffect, useRef } from 'react';
import { Recipe } from '../../types';
import { COGSCalculation, Ingredient } from '../../../cogs/types';
import { createCalculation } from '../../../cogs/hooks/utils/createCalculation';
import { logger } from '@/lib/logger';

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
          const recipeYield = recipe.yield || 1;
          const loadedCalculations = recipeIngredients
            .map((ri: any) => {
              const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
              if (!ingredientData) return null;

              const { convertedQuantity, convertedUnit, conversionNote } =
                convertIngredientQuantityRef.current(
                  ri.quantity / recipeYield,
                  ri.unit,
                  ingredientData.unit || 'kg',
                );

              return createCalculation(
                ri.ingredient_id,
                ingredientData,
                convertedQuantity,
                convertedUnit,
                conversionNote || '',
                recipe.id,
              );
            })
            .filter(Boolean) as COGSCalculation[];

          setCalculations(loadedCalculations);
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
