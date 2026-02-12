# 🚀 Performance & Data Fetching

> **Goal**: Zero client-side waterfalls. Instant initial paint.

1.  **Server-Side First**: ALL initial data for a page MUST be fetched on the server (in `page.tsx`) and passed to client components.
    - **Do Not**: Fetch data in `useEffect` on mount for initial render.
2.  **React Query Hydration**: Use `@tanstack/react-query` with `initialData` from the server.
3.  **No "Force Dynamic" Abuse**: Only use `export const dynamic = 'force-dynamic'` if strictly necessary. Prefer `suspense` boundaries.
4.  **Parallelize**: Use `Promise.all` for multiple server-side fetches.
5.  **Skeleton Loading**: If dynamic imports are needed, ALWAYS provide a `loading` component (Skeleton) that matches the dimensions.
