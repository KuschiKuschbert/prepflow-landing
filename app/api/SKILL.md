# API ROUTES SKILL

## PURPOSE

Load when creating, modifying, or debugging any API route in `app/api/`. Covers the standard route handler pattern, error handling, authentication, input validation, and response format.

## HOW IT WORKS IN THIS CODEBASE

**Standard route structure:**

```
app/api/[domain]/route.ts          ← thin handler (≤200 lines)
app/api/[domain]/helpers/
├── fetchData.ts                    ← business logic
├── validateRequest.ts              ← Zod schema + validation
└── buildResponse.ts                ← response formatting
```

**Route handler template:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/auth0-api-helpers';
import { mySchema } from './helpers/schemas';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('my_table')
      .select('*')
      .eq('user_id', user.sub);

    if (error) {
      logger.error('Failed to fetch', { error });
      return ApiErrorHandler.createError('FETCH_ERROR', 'Failed to fetch data', 500);
    }

    return NextResponse.json({ data });
  } catch (err) {
    logger.error('Unexpected error', { err });
    return ApiErrorHandler.createError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = mySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // ... business logic
  } catch (err) {
    logger.error('Unexpected error', { err });
    return ApiErrorHandler.createError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
```

**Dynamic route handler (Next.js 16):**

```typescript
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // MUST await
  // ...
}
```

## STEP-BY-STEP: Create a new API route

1. Create `app/api/my-domain/route.ts`
2. Create `app/api/my-domain/helpers/schemas.ts` (Zod schema for request body)
3. Create `app/api/my-domain/helpers/fetchMyData.ts` (business logic)
4. Implement handler: auth check → validate → business logic → respond
5. Add route to `routing.md`
6. Add to `lib/cache/prefetch-config.ts` if it's a frequently accessed GET route
7. Write a unit test for the helper function

## STEP-BY-STEP: Debug a 500 error in an API route

1. Check `logs/` directory or Vercel function logs
2. Search for `logger.error` calls that match the error pattern
3. Check Supabase query: add `console.log` temporarily (remove after debug)
4. Check `docs/TROUBLESHOOTING_LOG.md` for known fixes

## GOTCHAS

- **Never chain `.catch()` on Supabase queries** — use `{ data, error }` destructuring
- **Always `await context.params`** in dynamic routes (Next.js 16)
- **All POST/PUT/PATCH routes MUST validate with Zod** — reject malformed input with 400
- **Admin routes** require both `getAuthenticatedUser` AND admin role check
- **Dev-only routes** (db/reset, populate) MUST check `NODE_ENV !== 'production'`
- **Webhook routes** skip auth but MUST verify signatures

## Standard Response Shapes

```typescript
// Success
{ success: true, message: 'Created', data: { ... } }

// Error
{ error: 'ERROR_CODE', message: 'Human-readable message' }

// List with pagination
{ data: [...], total: 100, page: 1, pageSize: 20 }
```

## REFERENCE FILES

- `app/api/ingredients/route.ts` — standard CRUD example
- `app/api/recipes/[id]/route.ts` — dynamic route with auth
- `app/api/webhook/stripe/route.ts` — webhook without auth (signature verified)
- `app/api/db/reset/route.ts` — dev-only route with environment check
- `lib/api-error-handler/` — ApiErrorHandler implementation

## RETROFIT LOG

## LAST UPDATED

2025-02-26
