// Custom hooks for ingredients with React Query
// Provides caching, optimistic updates, and error handling

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  invalidateQueries,
  optimisticUpdates,
  handleQueryError,
} from '@/lib/react-query';

// Hook to fetch all ingredients
export function useIngredients() {
  return useQuery({
    queryKey: [...queryKeys.ingredients],
    queryFn: async () => {
      const response = await fetch('/api/ingredients');
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch a single ingredient
export function useIngredient(id: string) {
  return useQuery({
    queryKey: [...queryKeys.ingredient(id)],
    queryFn: async () => {
      const response = await fetch(`/api/ingredients/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ingredient');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to create a new ingredient
export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredientData: any) => {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ingredient');
      }

      return response.json();
    },
    onMutate: async newIngredient => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.ingredients] });

      // Snapshot the previous value
      const previousIngredients = queryClient.getQueryData([...queryKeys.ingredients]);

      // Optimistically update the cache
      optimisticUpdates.addIngredient({
        ...newIngredient,
        id: `temp-${Date.now()}`, // Temporary ID
      });

      // Return a context object with the snapshotted value
      return { previousIngredients };
    },
    onError: (err, newIngredient, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIngredients) {
        queryClient.setQueryData([...queryKeys.ingredients], context.previousIngredients);
      }

      // Handle error
      const errorMessage = handleQueryError(err, [...queryKeys.ingredients]);
      console.error('Failed to create ingredient:', errorMessage);
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries.ingredients();
    },
  });
}

// Hook to update an ingredient
export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update ingredient');
      }

      return response.json();
    },
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.ingredient(id)] });

      // Snapshot the previous value
      const previousIngredient = queryClient.getQueryData([...queryKeys.ingredient(id)]);

      // Optimistically update the cache
      optimisticUpdates.updateIngredient(id, updates);

      // Return a context object with the snapshotted value
      return { previousIngredient };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIngredient) {
        queryClient.setQueryData([...queryKeys.ingredient(id)], context.previousIngredient);
      }

      // Handle error
      const errorMessage = handleQueryError(err, [...queryKeys.ingredient(id)]);
      console.error('Failed to update ingredient:', errorMessage);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      invalidateQueries.ingredient(id);
      invalidateQueries.ingredients();
    },
  });
}

// Hook to delete an ingredient
export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ingredient');
      }

      return response.json();
    },
    onMutate: async id => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.ingredients] });

      // Snapshot the previous value
      const previousIngredients = queryClient.getQueryData([...queryKeys.ingredients]);

      // Optimistically remove the ingredient from the cache
      queryClient.setQueryData(
        [...queryKeys.ingredients],
        (old: any[]) => old?.filter(ingredient => ingredient.id !== id) || [],
      );

      // Return a context object with the snapshotted value
      return { previousIngredients };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousIngredients) {
        queryClient.setQueryData([...queryKeys.ingredients], context.previousIngredients);
      }

      // Handle error
      const errorMessage = handleQueryError(err, [...queryKeys.ingredient(id)]);
      console.error('Failed to delete ingredient:', errorMessage);
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries.ingredients();
    },
  });
}

// Hook to import ingredients from CSV
export function useImportIngredients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (csvData: string) => {
      const response = await fetch('/api/ingredients/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData }),
      });

      if (!response.ok) {
        throw new Error('Failed to import ingredients');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate ingredients cache to refetch updated data
      invalidateQueries.ingredients();
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.ingredients]);
      console.error('Failed to import ingredients:', errorMessage);
    },
  });
}
