import { useConfirm } from '@/hooks/useConfirm';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { KitchenSection, MenuDish } from '../../../types';

interface HandleDeleteParams {
  kitchenSections: KitchenSection[];
  menuDishes: MenuDish[];
  setKitchenSections: React.Dispatch<React.SetStateAction<KitchenSection[]>>;
  setMenuDishes: React.Dispatch<React.SetStateAction<MenuDish[]>>;
  setError: (error: string | null) => void;
}

export function useHandleDelete({
  kitchenSections,
  menuDishes,
  setKitchenSections,
  setMenuDishes,
  setError,
}: HandleDeleteParams) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { showSuccess, showError } = useNotification();

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

    // Store original state for rollback
    const originalKitchenSections = [...kitchenSections];
    const originalMenuDishes = [...menuDishes];

    // Optimistically remove section and unassign dishes immediately
    setKitchenSections(prev => prev.filter(section => section.id !== id));
    setMenuDishes(prev =>
      prev.map(dish =>
        dish.kitchen_section_id === id
          ? ({ ...dish, kitchen_section_id: undefined } as MenuDish)
          : dish,
      ),
    );

    try {
      const response = await fetch(`/api/kitchen-sections?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        showSuccess('Kitchen section deleted successfully!');
      } else {
        // Rollback on error
        setKitchenSections(originalKitchenSections);
        setMenuDishes(originalMenuDishes);
        const errorMessage = result.message || 'Failed to delete kitchen section';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      // Rollback on error
      setKitchenSections(originalKitchenSections);
      setMenuDishes(originalMenuDishes);
      logger.error('[handleDelete.ts] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      const errorMessage = 'Failed to delete kitchen section';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return { handleDelete, ConfirmDialog };
}
