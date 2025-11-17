/**
 * Prefetch configuration for all navigation links
 * Maps routes to their API endpoints for smart prefetching
 */

export const PREFETCH_MAP: Record<string, string[]> = {
  '/webapp': ['/api/dashboard/stats'],
  '/webapp/ingredients': ['/api/ingredients'],
  '/webapp/recipes': ['/api/recipes'],
  '/webapp/cogs': [],
  '/webapp/performance': ['/api/performance'],
  '/webapp/temperature': ['/api/temperature-logs'],
  '/webapp/cleaning': [],
  '/webapp/compliance': [],
  '/webapp/suppliers': [],
  '/webapp/par-levels': [],
  '/webapp/order-lists': [],
  '/webapp/sections': [],
  '/webapp/prep-lists': [
    '/api/prep-lists?userId=user-123&page=1&pageSize=10',
    '/api/kitchen-sections',
    '/api/ingredients?page=1&pageSize=50',
  ],
  '/webapp/ai-specials': [],
  '/webapp/setup': [],
};

/**
 * Get prefetch endpoints for a route
 */
export function getPrefetchEndpoints(route: string): string[] {
  return PREFETCH_MAP[route] || [];
}

/**
 * Prefetch all endpoints for a route
 */
export function prefetchRoute(route: string): void {
  const endpoints = getPrefetchEndpoints(route);
  if (endpoints.length > 0) {
    import('./data-cache').then(({ prefetchApis }) => {
      prefetchApis(endpoints);
    });
  }
}
