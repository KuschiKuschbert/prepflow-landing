/**
 * Statistics cache for menu items.
 */
interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  cogs_error?: string;
}

const statisticsCache = new Map<
  string,
  { data: ItemStatistics; timestamp: number; expiry: number }
>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function getCachedStatistics(cacheKey: string): ItemStatistics | null {
  const cached = statisticsCache.get(cacheKey);
  const now = Date.now();
  if (cached && now < cached.expiry) {
    return cached.data;
  }
  return null;
}

export function setCachedStatistics(cacheKey: string, statistics: ItemStatistics): void {
  const now = Date.now();
  statisticsCache.set(cacheKey, {
    data: statistics,
    timestamp: now,
    expiry: now + CACHE_EXPIRY_MS,
  });
}

export function invalidateCacheIfPriceChanged(
  cacheKey: string,
  newPrice: number | null,
): boolean {
  const cached = statisticsCache.get(cacheKey);
  if (!cached) return false;
  const priceChanged =
    cached.data.actual_selling_price !== newPrice &&
    (cached.data.actual_selling_price != null || newPrice != null);
  if (priceChanged) {
    statisticsCache.delete(cacheKey);
    return true;
  }
  return false;
}
