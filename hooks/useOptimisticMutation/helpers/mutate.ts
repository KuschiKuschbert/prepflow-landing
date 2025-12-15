/**
 * Optimistic mutation logic.
 */
import { logger } from '@/lib/logger';

export function createMutateHandler<T>(
  setIsMutating: (mutating: boolean) => void,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void,
  showSuccessNotification?: (message: string) => void,
  showErrorNotification?: (message: string) => void,
) {
  return async (
    optimisticUpdate: () => void,
    mutationFn: () => Promise<Response>,
    rollbackFn: () => void,
    successMessage?: string,
  ) => {
    setIsMutating(true);
    optimisticUpdate();
    try {
      const response = await mutationFn();
      const result = await response.json();
      if (response.ok) {
        if (successMessage && showSuccessNotification) showSuccessNotification(successMessage);
        onSuccess?.(result.data || result);
      } else {
        rollbackFn();
        const errorMsg = result.error || result.message || 'Operation failed';
        if (showErrorNotification) showErrorNotification(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      rollbackFn();
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      logger.error('Optimistic mutation failed:', err);
      if (showErrorNotification) showErrorNotification(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsMutating(false);
    }
  };
}
