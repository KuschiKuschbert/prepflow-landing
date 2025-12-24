import { logger } from '@/lib/logger';
import type { MenuDish } from '../../../types';

interface HandleAssignDishParams {
  menuDishes: MenuDish[];
  setMenuDishes: React.Dispatch<React.SetStateAction<MenuDish[]>>;
  setError: (error: string | null) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function handleAssignDish(
  dishId: string,
  sectionId: string | null,
  { menuDishes, setMenuDishes, setError, showSuccess, showError }: HandleAssignDishParams,
) {
  // Store original state for rollback
  const originalMenuDishes = [...menuDishes];

  // Optimistically update dish assignment immediately
  setMenuDishes(prev =>
    prev.map(dish =>
      dish.id === dishId ? ({ ...dish, kitchen_section_id: sectionId } as MenuDish) : dish,
    ),
  );

  try {
    const response = await fetch('/api/assign-dish-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, sectionId }),
    });
    const result = await response.json();
    if (result.success) {
      showSuccess('Dish assigned successfully!');
    } else {
      // Rollback on error
      setMenuDishes(originalMenuDishes);
      const errorMessage = result.message || 'Failed to assign dish to section';
      setError(errorMessage);
      showError(errorMessage);
    }
  } catch (err) {
    // Rollback on error
    setMenuDishes(originalMenuDishes);
    logger.error('[handleAssignDish.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    const errorMessage = 'Failed to assign dish to section';
    setError(errorMessage);
    showError(errorMessage);
  }
}
