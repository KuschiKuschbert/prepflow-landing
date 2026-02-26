# WEBAPP PAGES SKILL

## PURPOSE

Load when creating or modifying any webapp page under `app/webapp/`. Covers page structure, data fetching with caching, optimistic updates, navigation, and layout patterns.

## HOW IT WORKS IN THIS CODEBASE

**Every webapp page follows this structure:**

```
app/webapp/my-feature/
├── page.tsx               ← main page (≤500 lines, "use client")
├── layout.tsx             ← optional layout
├── components/
│   ├── MyFeatureList.tsx
│   ├── MyFeatureForm.tsx
│   └── hooks/
│       └── useMyFeatureData.ts
└── hooks/
    └── useMyFeatureActions.ts
```

**Caching pattern (instant display):**

```typescript
'use client';
import { getCachedData, cacheData } from '@/lib/cache/data-cache';

export default function MyPage() {
  // Initialize with cached data for instant display
  const [data, setData] = useState(() => getCachedData('my_data') || []);

  useEffect(() => {
    fetch('/api/my-data')
      .then(res => res.json())
      .then(fresh => {
        setData(fresh.data);
        cacheData('my_data', fresh.data); // cache for next visit
      });
  }, []);
}
```

**Optimistic CRUD pattern:**

```typescript
const handleDelete = async (id: string) => {
  const original = [...items]; // 1. Store original

  setItems(prev => prev.filter(i => i.id !== id)); // 2. Update UI immediately

  try {
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setItems(original); // 3. Revert on error
      showError('Delete failed');
    } else {
      showSuccess('Deleted');
    }
  } catch {
    setItems(original); // 3. Revert on error
    showError('Delete failed');
  }
};
```

## STEP-BY-STEP: Create a new webapp page

1. Create `app/webapp/my-feature/page.tsx` (with `"use client"`)
2. Create `app/webapp/my-feature/components/` for UI components
3. Add the route to `app/webapp/layout.tsx` navigation
4. Add the route to `lib/cache/prefetch-config.ts` with its API endpoints
5. Add a sidebar link in `app/webapp/components/navigation/SidebarLink.tsx`
6. Use `PageSkeleton` from `components/ui/LoadingSkeleton.tsx` while loading

## STEP-BY-STEP: Add a new table with CRUD

1. Create `MyFeatureTable.tsx` — follow `IngredientTableWithFilters` pattern
2. Create `MyFeatureCard.tsx` — mobile card layout (shown below `desktop:`)
3. Create `MyFeatureForm.tsx` — creation/edit form with autosave
4. Use `useConfirm` for delete confirmations (never native `confirm()`)
5. All mutations use optimistic updates

## GOTCHAS

- **All webapp pages need `"use client"`** — they use hooks and state
- **Never call `fetchData()` after mutations** — use optimistic updates
- **Prefetch map required** — add route to `lib/cache/prefetch-config.ts`
- **Loading states:** Use `PageSkeleton` for full-page, `LoadingSkeleton` for sections
- **Mobile layout:** Below `desktop:` (1025px), use card layout. Above, use table.
- **Toast notifications:** Use `useNotification` from `contexts/NotificationContext`

## REFERENCE FILES

- `app/webapp/ingredients/page.tsx` — gold standard for list page with caching
- `app/webapp/recipes/page.tsx` — progressive loading pattern
- `app/webapp/settings/billing/page.tsx` — settings page pattern
- `app/webapp/components/navigation/SidebarLink.tsx` — navigation link
- `lib/cache/prefetch-config.ts` — prefetch configuration

## RETROFIT LOG

## LAST UPDATED

2025-02-26
