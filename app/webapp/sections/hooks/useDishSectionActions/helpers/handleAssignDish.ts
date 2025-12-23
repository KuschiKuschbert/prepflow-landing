import { logger } from '@/lib/logger';
interface HandleAssignDishParams {
  fetchMenuDishes: () => Promise<void>;
  fetchKitchenSections: () => Promise<void>;
  setError: (error: string | null) => void;
}

export async function handleAssignDish(
  dishId: string,
  sectionId: string | null,
  { fetchMenuDishes, fetchKitchenSections, setError }: HandleAssignDishParams,
) {
  try {
    const response = await fetch('/api/assign-dish-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, sectionId }),
    });
    const result = await response.json();
    if (result.success) {
      await fetchMenuDishes();
      await fetchKitchenSections();
    } else {
      setError(result.message || 'Failed to assign dish to section');
    }
  } catch (err) {
    logger.error('[handleAssignDish.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    setError('Failed to assign dish to section');
  }
}




