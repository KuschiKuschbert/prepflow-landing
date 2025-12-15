/**
 * Handle retry logic for batch fetch.
 */
import { logger } from '@/lib/logger';
import type { RecipeIngredientWithDetails } from '../../../../types';

export async function handleRetryHelper(
  recipeIds: string[],
  retryCount: number,
  maxRetries: number,
  performBatchFetchRef: React.MutableRefObject<((recipeIds: string[], retryCount?: number) => Promise<Record<string, RecipeIngredientWithDetails[]>>) | null>,
  getRetryDelay: (attempt: number) => number,
): Promise<Record<string, RecipeIngredientWithDetails[]>> {
  if (retryCount >= maxRetries || !performBatchFetchRef.current) return {};
  const delay = getRetryDelay(retryCount);
  logger.dev(`[RecipeIngredients] Retrying batch fetch after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`);
  await new Promise(resolve => setTimeout(resolve, delay));
  return performBatchFetchRef.current(recipeIds, retryCount + 1);
}
