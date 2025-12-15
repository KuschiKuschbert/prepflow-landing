/**
 * Handle loading state for menu data loading.
 */
import { getCachedData } from '@/lib/cache/data-cache';

interface HandleLoadingStateParams {
  menuCacheKey: string;
  dishesCacheKey: string;
  recipesCacheKey: string;
  showLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export function shouldShowLoading({
  menuCacheKey,
  dishesCacheKey,
  recipesCacheKey,
  showLoading,
}: HandleLoadingStateParams): boolean {
  const hasCachedData =
    getCachedData(menuCacheKey) || getCachedData(dishesCacheKey) || getCachedData(recipesCacheKey);
  return showLoading && !hasCachedData;
}

export function setLoadingIfNeeded(params: HandleLoadingStateParams): void {
  if (shouldShowLoading(params)) {
    params.setLoading(true);
  }
}

export function clearLoadingIfNeeded(params: HandleLoadingStateParams): void {
  if (shouldShowLoading(params)) {
    params.setLoading(false);
  }
}
