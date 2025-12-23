import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

interface HandleDeleteParams {
  fetchKitchenSections: () => Promise<void>;
  fetchMenuDishes: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useHandleDelete({
  fetchKitchenSections,
  fetchMenuDishes,
  setError,
}: HandleDeleteParams) {
  const { showConfirm, ConfirmDialog } = useConfirm();

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Kitchen Section?',
      message:
        'Delete this kitchen section? All dishes will be unassigned. Still want to delete it?',
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/kitchen-sections?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        await fetchKitchenSections();
        await fetchMenuDishes();
      } else {
        setError(result.message || 'Failed to delete kitchen section');
      }
    } catch (err) {
      logger.error('[handleDelete.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setError('Failed to delete kitchen section');
    }
  };

  return { handleDelete, ConfirmDialog };
}




