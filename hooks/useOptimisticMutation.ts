/**
 * Reusable hook for optimistic mutations with automatic rollback on error.
 * Provides a consistent pattern for optimistic updates across the application.
 */

import { useCallback, useState } from 'react';
import { createMutateHandler } from './useOptimisticMutation/helpers/mutate';

interface UseOptimisticMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  showSuccessNotification?: (message: string) => void;
  showErrorNotification?: (message: string) => void;
}

interface UseOptimisticMutationReturn<T> {
  mutate: (
    optimisticUpdate: () => void,
    mutationFn: () => Promise<Response>,
    rollbackFn: () => void,
    successMessage?: string,
  ) => Promise<void>;
  isMutating: boolean;
}

/**
 * Hook for optimistic mutations with automatic rollback on error.
 *
 * @template T - Type of data returned from mutation
 * @param {UseOptimisticMutationOptions<T>} options - Configuration options
 * @returns {UseOptimisticMutationReturn<T>} Mutation function and loading state
 *
 * @example
 * ```typescript
 * const { mutate, isMutating } = useOptimisticMutation({
 *   showSuccessNotification: showSuccess,
 *   showErrorNotification: showError,
 * });
 *
 * await mutate(
 *   () => setItems(prev => prev.filter(item => item.id !== id)),
 *   () => fetch(`/api/items/${id}`, { method: 'DELETE' }),
 *   () => setItems(originalItems),
 *   'Item deleted successfully'
 * );
 * ```
 */
export function useOptimisticMutation<T = unknown>(
  options: UseOptimisticMutationOptions<T> = {},
): UseOptimisticMutationReturn<T> {
  const { onSuccess, onError, showSuccessNotification, showErrorNotification } = options;
  const [isMutating, setIsMutating] = useState(false);

  const mutate = useCallback(
    (
      optimisticUpdate: () => void,
      mutationFn: () => Promise<Response>,
      rollbackFn: () => void,
      successMessage?: string,
    ) => {
      const handler = createMutateHandler(
        setIsMutating,
        onSuccess,
        onError,
        showSuccessNotification,
        showErrorNotification,
      );
      return handler(optimisticUpdate, mutationFn, rollbackFn, successMessage);
    },
    [onSuccess, onError, showSuccessNotification, showErrorNotification],
  );

  return { mutate, isMutating };
}
