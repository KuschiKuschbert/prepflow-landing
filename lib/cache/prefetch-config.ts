/**
 * Prefetch configuration for all navigation links
 * Maps routes to their API endpoints for smart prefetching
 */

export const PREFETCH_MAP: Record<string, string[]> = {
  '/webapp': [
    '/api/dashboard/stats',
    '/api/dashboard/performance-summary',
    '/api/dashboard/menu-summary',
    '/api/dashboard/recipe-readiness',
  ],
  '/webapp/recipes': ['/api/recipes', '/api/ingredients'],
  '/webapp/performance': ['/api/performance'],
  '/webapp/temperature': ['/api/temperature-logs'],
  '/webapp/cleaning': ['/api/cleaning-areas', '/api/cleaning-tasks'],
  '/webapp/compliance': ['/api/compliance-records', '/api/compliance-types'],
  '/webapp/suppliers': ['/api/suppliers', '/api/supplier-price-lists'],
  '/webapp/par-levels': ['/api/par-levels', '/api/ingredients'],
  '/webapp/order-lists': ['/api/menus'],
  '/webapp/sections': ['/api/kitchen-sections', '/api/menu-dishes'],
  '/webapp/prep-lists': [
    '/api/prep-lists?userId=user-123&page=1&pageSize=10',
    '/api/kitchen-sections',
    '/api/ingredients?page=1&pageSize=50',
  ],
  '/webapp/ai-specials': ['/api/ai-specials'],
  '/webapp/menu-builder': ['/api/menus', '/api/dishes?pageSize=1000', '/api/recipes?pageSize=1000'],
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
