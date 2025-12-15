/**
 * Handle save error for recipe/dish ingredients.
 */
import { logger } from '@/lib/logger';

export async function handleSaveError(
  response: Response,
  itemType: string,
  itemId: string,
  count: number,
  showError: (message: string) => void,
): Promise<void> {
  const result = await response.json().catch(() => ({ error: 'Unknown error' }));
  logger.error(`Failed to save ${itemType} ingredients:`, {
    status: response.status,
    error: result.error || result.message,
    [`${itemType}Id`]: itemId,
    ingredientsCount: count,
  });
  showError(
    result.error || result.message || `Failed to save ${itemType} ingredients (${response.status})`,
  );
}
