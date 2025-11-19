/**
 * Reusable hook for optimistic mutations with automatic rollback on error.
 * Provides a consistent pattern for optimistic updates across the application.
 */

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

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
    async (
      optimisticUpdate: () => void,
      mutationFn: () => Promise<Response>,
      rollbackFn: () => void,
      successMessage?: string,
    ) => {
      setIsMutating(true);

      // Apply optimistic update immediately
      optimisticUpdate();

      try {
        const response = await mutationFn();
        const result = await response.json();

        if (response.ok) {
          if (successMessage && showSuccessNotification) {
            showSuccessNotification(successMessage);
          }
          onSuccess?.(result.data || result);
        } else {
          // Revert optimistic update on error
          rollbackFn();
          const errorMsg = result.error || result.message || 'Operation failed';
          if (showErrorNotification) {
            showErrorNotification(errorMsg);
          }
          onError?.(errorMsg);
        }
      } catch (err) {
        // Revert optimistic update on error
        rollbackFn();
        const errorMsg = err instanceof Error ? err.message : 'Operation failed';
        logger.error('Optimistic mutation failed:', err);
        if (showErrorNotification) {
          showErrorNotification(errorMsg);
        }
        onError?.(errorMsg);
      } finally {
        setIsMutating(false);
      }
    },
    [onSuccess, onError, showSuccessNotification, showErrorNotification],
  );

  return { mutate, isMutating };
}

