import { useCOGSCalculationLogic } from '@/app/webapp/cogs/hooks/useCOGSCalculationLogic';
import { useCOGSDataFetching } from '@/app/webapp/cogs/hooks/useCOGSDataFetching';
import { useIngredientAddition } from '@/app/webapp/cogs/hooks/useIngredientAddition';
import { useIngredientConversion } from '@/app/webapp/cogs/hooks/useIngredientConversion';
import { useIngredientSearch } from '@/app/webapp/cogs/hooks/useIngredientSearch';
import { COGSCalculation } from '@/app/webapp/cogs/types';
import { useNotification } from '@/contexts/NotificationContext';
import { useCallback, useMemo, useState } from 'react';
import type { Recipe } from '../../../types';
import { useRecipeEditIngredientLoading } from '../../hooks/useRecipeEditIngredientLoading';
import { useRecipeEditHandlers } from './useRecipeEditHandlers';

export function useRecipeIngredientsState(recipe: Recipe | null) {
  const { showError } = useNotification();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'consumables'>('ingredients');
  const [showAddIngredient, setShowAddIngredient] = useState(false);

  const {
    ingredients,
    loading: dataLoading,
    error: dataError,
    setError: setDataError,
    fetchData,
  } = useCOGSDataFetching();

  const { convertIngredientQuantity } = useIngredientConversion();

  const { calculations, setCalculations, loadingIngredients } = useRecipeEditIngredientLoading({
    recipe,
    ingredients,
    convertIngredientQuantity,
    showError,
  });

  const ingredientCalculations = useMemo(
    () => calculations.filter((calc: COGSCalculation) => !calc.isConsumable),
    [calculations],
  );

  const consumableCalculations = useMemo(
    () => calculations.filter((calc: COGSCalculation) => calc.isConsumable),
    [calculations],
  );

  const consumables = useMemo(
    () => ingredients.filter(ing => ing.category === 'Consumables'),
    [ingredients],
  );

  const ingredientSearch = useIngredientSearch(ingredients);
  const consumableSearch = useIngredientSearch(consumables);

  const { updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });

  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) =>
      updateCalculation(ingredientId, quantity, ingredients, setCalculations),
    [ingredients, updateCalculation, setCalculations],
  );

  const addCalculationWithRollback = useCallback(
    (calc: COGSCalculation) => {
      setCalculations(prev => [...prev, calc]);
    },
    [setCalculations],
  );

  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe: recipe?.id || null,
    addCalculation: addCalculationWithRollback,
    updateCalculation: updateCalculationWrapper,
    resetForm: ingredientSearch.resetForm,
    setSaveError: setDataError,
  });

  const { handleAddIngredientWrapper, handleAddConsumableWrapper } = useRecipeEditHandlers({
    handleAddIngredient,
    newIngredient: ingredientSearch.newIngredient,
    newConsumable: consumableSearch.newIngredient,
  });

  return {
    activeTab,
    setActiveTab,
    showAddIngredient,
    setShowAddIngredient,
    ingredients,
    consumables,
    dataLoading,
    loadingIngredients,
    dataError,
    fetchData,
    calculations,
    setCalculations,
    ingredientCalculations,
    consumableCalculations,
    ingredientSearch,
    consumableSearch,
    handleAddIngredientWrapper,
    handleAddConsumableWrapper,
    updateCalculation,
    updateCalculationWrapper,
  };
}
