# HOOKS SKILL

## PURPOSE

Load when creating, modifying, or reviewing any custom React hook in `hooks/`. Covers hook structure, testing requirements, naming conventions, and the standard hooks available to all components.

## HOW IT WORKS IN THIS CODEBASE

**Hook file structure:**

```
hooks/
├── useMyHook.ts           ← hook implementation (≤120 lines)
├── useMyHook.test.ts      ← co-located test (MANDATORY)
└── useMyHook/             ← complex hooks get a subdirectory
    ├── helpers/
    │   ├── myHelper.ts
    │   └── myHelper.test.ts
    └── types.ts
```

**All hooks must:**

- Be ≤120 lines
- Have a co-located `.test.ts` file
- Export a single named function prefixed with `use`
- Have a JSDoc comment describing purpose and return value
- Be in `hooks/` (shared hooks) or `app/webapp/[feature]/hooks/` (feature-scoped)

## Standard Hooks Catalog

### Dialog Hooks (MANDATORY — never use native dialogs)

- `useConfirm` — `const { showConfirm, ConfirmDialog } = useConfirm()`
- `usePrompt` — `const { showPrompt, InputDialog } = usePrompt()`
- `useAlert` — `const { showAlert, AlertDialog } = useAlert()`

### Data Hooks

- `useOptimisticMutation` — generic optimistic update with automatic rollback
- `useParallelFetch` — parallel fetch with individual loading/error states
- `useDebouncedValue` — debounces a value with configurable delay

### Auth Hooks

- `useAuth` — current user, loading state, logout function
- `useEntitlements` — feature access by subscription tier

### UI Hooks

- `useNotification` — show toast (from `contexts/NotificationContext`)
- `useConfirm`, `usePrompt`, `useAlert` — dialog hooks
- `useSessionTimeout` — idle timeout warning + auto-logout

### Form Hooks

- `useAutosave` — debounced autosave with draft recovery
- `useFormValidation` — Zod-based form validation

### Cache / Performance

- `useParallelFetch` — parallel data fetching
- `useDebouncedValue` — input debounce

## STEP-BY-STEP: Create a new hook

1. Create `hooks/useMyHook.ts`
2. Add JSDoc
3. Implement with ≤120 lines (extract helpers if needed)
4. Export as named export: `export function useMyHook() { ... }`
5. Create `hooks/useMyHook.test.ts`
6. Test with `renderHook` from React Testing Library

```typescript
/**
 * Manages the selected items in a list with multi-select support.
 *
 * @param items - the full list of items (for deselect-all)
 * @returns selected IDs, toggle function, select-all, clear functions
 */
export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(i => i.id)));
  }, [items]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return { selectedIds, toggle, selectAll, clear };
}
```

## GOTCHAS

- **`useCallback` deps:** Always include all variables used inside the callback in deps array
- **`useMemo` is not free** — only use for arrays/objects with expensive computation or for stable references passed to memoized children
- **Cleanup in `useEffect`** — always return cleanup function if setting up event listeners or timers
- **`useRef` type:** Use `useRef<HTMLElement>(null)` and declare as `RefObject<HTMLElement | null>` in interfaces
- **Hooks must be at top level** — never call hooks inside conditions or loops
- **Autosave:** Use `deriveAutosaveId()` for stable entity IDs, never pass `"new"` as entityId

## REFERENCE FILES

- `hooks/useOptimisticMutation.ts` — reusable optimistic update hook
- `hooks/useConfirm.ts` — promise-based confirm dialog
- `hooks/useAutosave.ts` — autosave with draft recovery
- `hooks/useParallelFetch.ts` — parallel data fetching
- `hooks/useSessionTimeout.ts` — session timeout management

## RETROFIT LOG

### 2025-02-26 — Batch 1 (core infrastructure)

- `hooks/useAIPerformanceTips.ts`: added missing `'use client'` directive (file uses `useState`/`useCallback`)

## LAST UPDATED

2025-02-26
