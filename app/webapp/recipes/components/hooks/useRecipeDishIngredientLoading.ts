import { useState, useEffect, useRef } from 'react';
import { RecipeDishItem } from './useRecipeDishEditorData';
import { Recipe } from '../../types';
import { COGSCalculation, Ingredient } from '../../../cogs/types';
import { createCalculation } from '../../../cogs/hooks/utils/createCalculation';
import { logger } from '@/lib/logger';

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
      const createCalc = (
        ingId: string,
        ingData: Ingredient,
        qty: number,
        unit: string,
        note: string,
      ) => createCalculation(ingId, ingData, qty, unit, note, selectedItem.id);
      const processIngredient = (
        ingId: string,
        qty: number,
        unit: string,
        allCalculations: COGSCalculation[],
      ) => {
        const ingredientData = ingredients.find(ing => ing.id === ingId);
        if (!ingredientData) return;
        const { convertedQuantity, convertedUnit, conversionNote } =
          convertIngredientQuantityRef.current(qty, unit, ingredientData.unit || 'kg');
        allCalculations.push(
          createCalc(ingId, ingredientData, convertedQuantity, convertedUnit, conversionNote || ''),
        );
      };
      try {
        if (selectedItem.type === 'recipe') {
          const response = await fetch(`/api/recipes/${selectedItem.id}/ingredients`, {
            cache: 'no-store',
          });
          if (!response.ok)
            throw new Error(`Failed to fetch recipe ingredients: ${response.statusText}`);
          const data = await response.json();
          const recipeIngredients = data.items || [];
          const recipe = allRecipes.find(r => r.id === selectedItem.id);
          const recipeYield = recipe?.yield || 1;
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
              return createCalc(
                ri.ingredient_id,
                ingredientData,
                convertedQuantity,
                convertedUnit,
                conversionNote || '',
              );
            })
            .filter(Boolean) as COGSCalculation[];
          setCalculations(loadedCalculations);
        } else {
          const response = await fetch(`/api/dishes/${selectedItem.id}`, { cache: 'no-store' });
          if (!response.ok) throw new Error(`Failed to fetch dish: ${response.statusText}`);
          const data = await response.json();
          if (data.success && data.dish) {
            const dishRecipes = data.dish.recipes || [];
            const dishIngredients = data.dish.ingredients || [];
            const allCalculations: COGSCalculation[] = [];
            dishIngredients.forEach(di =>
              processIngredient(di.ingredient_id, di.quantity, di.unit, allCalculations),
            );
            for (const dr of dishRecipes) {
              const recipe = recipes.find(r => r.id === dr.recipe_id);
              if (!recipe) continue;
              const recipeResponse = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
                cache: 'no-store',
              });
              const recipeData = await recipeResponse.json();
              const recipeIngredients = recipeData.items || [];
              const recipeYield = recipe.yield || 1;
              const quantity = dr.quantity || 1;
              recipeIngredients.forEach(ri =>
                processIngredient(
                  ri.ingredient_id,
                  (ri.quantity / recipeYield) * quantity,
                  ri.unit,
                  allCalculations,
                ),
              );
            }
            setCalculations(allCalculations);
          } else setCalculations([]);
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
