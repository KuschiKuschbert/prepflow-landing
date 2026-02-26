# Forbidden — Anti-Patterns Never to Generate

These patterns were found in the codebase or are explicitly prohibited by project standards. Never generate them.

---

## ❌ Never Use Native Browser Dialogs

```typescript
// ❌ FORBIDDEN
confirm('Are you sure?');
alert('Success!');
prompt('Enter name:');
```

**Use instead:**

```typescript
// ✅ useConfirm hook
const { showConfirm, ConfirmDialog } = useConfirm();
const ok = await showConfirm({ title: '...', message: '...', variant: 'danger' });

// ✅ useAlert hook
const { showAlert, AlertDialog } = useAlert();
await showAlert({ title: '...', message: '...' });

// ✅ usePrompt hook
const { showPrompt, InputDialog } = usePrompt();
const value = await showPrompt({ title: '...', placeholder: '...' });
```

---

## ❌ Never Use console.\* in Production Code

```typescript
// ❌ FORBIDDEN
console.log('data:', data);
console.error('Failed:', err);
console.warn('Missing field');
```

**Use instead:**

```typescript
// ✅
import { logger } from '@/lib/logger';
logger.dev('data:', data); // dev-only (stripped in prod)
logger.error('Failed:', err);
logger.warn('Missing field');
```

---

## ❌ Never Chain .catch() on Supabase Query Builders

```typescript
// ❌ FORBIDDEN — breaks TypeScript types on Vercel build
const data = await supabase
  .from('table')
  .select()
  .catch(err => null);
```

**Use instead:**

```typescript
// ✅
const { data, error } = await supabase.from('table').select();
if (error) {
  logger.error('Query failed', { error });
  return ApiErrorHandler.createError('FETCH_ERROR', 'Failed to fetch', 500);
}
```

---

## ❌ Never Use Standard Tailwind Breakpoints

```tsx
// ❌ FORBIDDEN — sm:, md:, lg: are DISABLED in tailwind.config.ts
<div className="sm:text-lg md:grid-cols-2 lg:flex-row">
```

**Use instead:**

```tsx
// ✅ Custom breakpoints only
<div className="tablet:text-lg tablet:grid-cols-2 desktop:flex-row">
```

| Disabled | Use instead | Breakpoint |
| -------- | ----------- | ---------- |
| `sm:`    | `tablet:`   | 481px+     |
| `md:`    | `tablet:`   | 481px+     |
| `lg:`    | `desktop:`  | 1025px+    |

---

## ❌ Never Access params Directly in Next.js 16 Route Handlers

```typescript
// ❌ FORBIDDEN — params is a Promise in Next.js 16
export async function GET(req, { params }: { params: { id: string } }) {
  const { id } = params; // undefined at runtime
}
```

**Use instead:**

```typescript
// ✅
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
}
```

---

## ❌ Never Use RefObject<HTMLElement> Without null in Interfaces

```typescript
// ❌ FORBIDDEN — causes Vercel build errors
interface MyHookReturn {
  ref: React.RefObject<HTMLDivElement>;
}
```

**Use instead:**

```typescript
// ✅ useRef<T>(null) returns RefObject<T | null>
interface MyHookReturn {
  ref: React.RefObject<HTMLDivElement | null>;
}
```

---

## ❌ Never Call fetchData() After Successful Mutations

```typescript
// ❌ FORBIDDEN — defeats optimistic updates, causes unnecessary refetch
const handleDelete = async (id: string) => {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  await fetchData(); // NEVER
};
```

**Use instead:** Optimistic updates — update state immediately, revert on error.

---

## ❌ Never Import from app/ Inside lib/

```typescript
// ❌ FORBIDDEN — circular dependency risk
// In lib/some-util.ts:
import { MyComponent } from '@/app/webapp/components/MyComponent';
```

`lib/` must never import from `app/`. Dependency direction: `app/` → `lib/`, never the reverse.

---

## ❌ Never Modify app/curbos/ or app/nachotaco/

```bash
# ❌ FORBIDDEN — pre-commit hook blocks this
# Editing app/curbos/components/LatestVersionBadge.tsx
```

`app/curbos/` requires `ALLOW_CURBOS_MODIFY=1` bypass. `app/nachotaco/` is excluded from all tooling and must never be modified.

---

## ❌ Never Hardcode Environment Values in Application Code

```typescript
// ❌ FORBIDDEN
const supabaseUrl = 'https://dulkrqgjfohsuxhsmofo.supabase.co';
const stripeKey = 'sk_test_...';
```

**Use instead:**

```typescript
// ✅
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const stripeKey = process.env.STRIPE_SECRET_KEY!;
```

---

## ❌ Never Use Emoji Icons in UI Components

```tsx
// ❌ FORBIDDEN
<button>⚡ Bulk Actions</button>
<span>🗑️ Delete</span>
```

**Use instead:**

```tsx
// ✅ Lucide React via Icon component
import { Icon } from '@/components/ui/Icon';
import { Zap, Trash2 } from 'lucide-react';

<button>
  <Icon icon={Zap} size="sm" /> Bulk Actions
</button>;
```

---

## ❌ Never Use direct dangerouslySetInnerHTML Without Sanitization

```tsx
// ❌ FORBIDDEN
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

**Use instead:**

```tsx
// ✅ Sanitize with DOMPurify first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />;
```

---

## ❌ Never Skip Error Handling in Async API Routes

```typescript
// ❌ FORBIDDEN — unhandled errors crash the route
export async function GET(req: NextRequest) {
  const data = await fetchSomething();
  return NextResponse.json(data);
}
```

**Use instead:**

```typescript
// ✅ Always wrap in try/catch
export async function GET(req: NextRequest) {
  try {
    const data = await fetchSomething();
    return NextResponse.json(data);
  } catch (err) {
    logger.error('Failed to fetch', { err });
    return ApiErrorHandler.createError('FETCH_ERROR', 'Failed to fetch', 500);
  }
}
```

---

## ❌ Never Use Raw SQL Strings with User Input

```typescript
// ❌ FORBIDDEN — SQL injection risk
await supabase.rpc('execute_sql', { sql: `WHERE name = '${userInput}'` });
```

**Use instead:** Always use Supabase query builder methods (`.eq()`, `.ilike()`, `.in()`) which parameterize automatically.

---

## ❌ Never Commit Directly to main

Always create a feature branch: `improvement/feature-name` or `fix/bug-name`. Use `scripts/safe-merge.sh` to merge.

---

## ❌ Never Manually Edit package-lock.json, Migration Files, or Generated Files

- `package-lock.json` — only modified by npm
- `migrations/` — add new files only, never edit existing migrations
- `.next/` — build output, never edit
- `coverage/` — test output, never edit
