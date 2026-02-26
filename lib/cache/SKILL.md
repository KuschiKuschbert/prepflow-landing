# CACHING & PREFETCHING SKILL

## PURPOSE

Load when working on the caching infrastructure, sessionStorage caching, API prefetching, or when a new webapp route needs to be added to the prefetch map.

## HOW IT WORKS IN THIS CODEBASE

**Two key files:**

1. `lib/cache/data-cache.ts` — generic sessionStorage cache with expiry
2. `lib/cache/prefetch-config.ts` — maps webapp routes to their API endpoints

**Cache API:**

```typescript
import { cacheData, getCachedData, clearCache } from '@/lib/cache/data-cache';

// Cache data (5 min default expiry)
cacheData('my_key', data);
cacheData('my_key', data, 10 * 60 * 1000); // 10 min expiry

// Get cached data (returns null if expired or missing)
const cached = getCachedData('my_key');

// Clear specific cache
clearCache('my_key');

// Clear ALL caches (e.g., on logout)
clearAllCaches();
```

**Prefetch API:**

```typescript
import { prefetchRoute, prefetchApis } from '@/lib/cache/prefetch-config';

// Prefetch on hover (used in sidebar links)
<Link onMouseEnter={() => prefetchRoute('/webapp/ingredients')}>

// Prefetch multiple endpoints
prefetchApis(['/api/ingredients', '/api/suppliers']);
```

**Prefetch map (MAINTAIN THIS):**

```typescript
// lib/cache/prefetch-config.ts
export const PREFETCH_MAP: Record<string, string[]> = {
  '/webapp/ingredients': ['/api/ingredients', '/api/suppliers'],
  '/webapp/recipes': ['/api/recipes'],
  // ADD new routes here when creating new pages
};
```

**Instant display pattern (required for all list pages):**

```typescript
// Initialize with cached data for instant display
const [data, setData] = useState(() => getCachedData('my_key') || []);

useEffect(() => {
  fetch('/api/my-data')
    .then(res => res.json())
    .then(fresh => {
      setData(fresh.data);
      cacheData('my_key', fresh.data); // cache for next visit
    });
}, []);
```

## STEP-BY-STEP: Add caching to a new page

1. Choose a cache key (unique, descriptive): e.g., `'ingredients_list'`
2. Initialize state with `getCachedData('ingredients_list') || []`
3. Fetch fresh data in `useEffect`
4. Call `cacheData('ingredients_list', fresh)` after successful fetch
5. Add route to `PREFETCH_MAP` in `lib/cache/prefetch-config.ts`

## GOTCHAS

- **SessionStorage** — cache clears on tab close. This is intentional (prevents stale data across logins).
- **5-minute default expiry** — stale data is displayed for up to 5 min. For frequently-changing data, reduce expiry.
- **Prefetch map is mandatory** — forgetting to add a new route means no prefetching on hover.
- **`clearAllCaches()` on logout** — ensure this is called in the logout flow to prevent data leaking between users.
- **Cache key collisions** — use specific keys (e.g., `'ingredients_page_1'` not just `'data'`).

## REFERENCE FILES

- `lib/cache/data-cache.ts` — cache implementation
- `lib/cache/prefetch-config.ts` — prefetch map (update this for new routes)
- `app/webapp/ingredients/page.tsx` — gold standard caching implementation
- `app/webapp/components/navigation/SidebarLink.tsx` — prefetch on hover

## RETROFIT LOG

### 2025-02-26 — Batch 1 (core infrastructure)

- `lib/cache/data-cache.ts`: added JSDoc blocks for all 6 exported functions (`cacheData`, `getCachedData`, `clearCache`, `clearAllCaches`, `prefetchApi`, `prefetchApis`)

## LAST UPDATED

2025-02-26
