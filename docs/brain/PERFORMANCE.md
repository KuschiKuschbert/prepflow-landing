# 🚀 Performance & Data Fetching

> **Goal**: Zero client-side waterfalls. Instant initial paint.

1.  **Server-Side First**: ALL initial data for a page MUST be fetched on the server (in `page.tsx`) and passed to client components.
    - **Do Not**: Fetch data in `useEffect` on mount for initial render.
2.  **React Query Hydration**: Use `@tanstack/react-query` with `initialData` from the server.
3.  **No "Force Dynamic" Abuse**: Only use `export const dynamic = 'force-dynamic'` if strictly necessary. Prefer `suspense` boundaries.
4.  **Parallelize**: Use `Promise.all` for multiple server-side fetches.
5.  **Skeleton Loading**: If dynamic imports are needed, ALWAYS provide a `loading` component (Skeleton) that matches the dimensions.

## Client-Side Optimizations (when client fetch is used)

6.  **Parallelize Client Fetches**: Use `Promise.all()` for independent client-side fetches (COGS, Performance, etc.). Never chain awaits for independent requests.
7.  **Cache-First for List Pages**: List pages (recipe-sharing, functions, order-lists) should use `getCachedData` + `cacheData` for instant display on repeat visits.
8.  **Light API for Read-Only Views**: When an API supports a "light" mode (e.g. `?locked=1` for menus), use it for read-only views (locked menu display, print) to skip expensive enrichment.
