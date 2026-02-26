import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { useEffect } from 'react';
import { useIngredientData } from '../../hooks/useIngredientData';
import { useIngredientMigration } from '../../hooks/useIngredientMigration';
import { type IngredientsQueryParams, useIngredientsQuery } from '../../hooks/useIngredientsQuery';
import { useRegionalUnits } from '../../hooks/useRegionalUnits';
import type { ExistingIngredient } from '../types';

export function useIngredientDataSync(
  setIngredients: (ingredients: ExistingIngredient[]) => void,
  queryParams: IngredientsQueryParams,
) {
  const { availableUnits } = useRegionalUnits();
  const { suppliers, loading, error, setError } = useIngredientData();

  const {
    data: ingredientsData,
    isLoading,
    refetch: refetchIngredients,
  } = useIngredientsQuery(queryParams);

  useIngredientMigration(loading, isLoading, ingredientsData);

  useEffect(() => {
    const active = loading || isLoading;
    if (active) startLoadingGate('ingredients');
    else stopLoadingGate('ingredients');
    return () => stopLoadingGate('ingredients');
  }, [loading, isLoading]);

  useEffect(() => {
    if (ingredientsData?.items) setIngredients(ingredientsData.items as ExistingIngredient[]);
  }, [ingredientsData]);

  return {
    availableUnits,
    suppliers,
    loading,
    isLoading,
    error,
    setError,
    refetchIngredients,
    total: ingredientsData?.total || 0,
    totalPages: ingredientsData?.totalPages || 1,
  };
}
