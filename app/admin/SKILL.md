# ADMIN PANEL SKILL

## PURPOSE

Load when working on the admin panel: user management, feature flag administration, billing overview, system health, error tracking, impersonation, or analytics.

## HOW IT WORKS IN THIS CODEBASE

**Admin routes require admin role** — enforced in `proxy.ts` + API routes.

**Admin sections:**
| Path | Purpose |
|------|---------|
| `/admin/users` | User list, search, detail, data export |
| `/admin/features` | Feature flag management (enable/disable) |
| `/admin/billing` | Subscription overview, sync |
| `/admin/system` | Health check, error logs |
| `/admin/support` | Support tickets, impersonation, password reset |
| `/admin/analytics` | Usage analytics |

**User management components:**

- `app/admin/users/components/UserBasicInfo.tsx` — user profile
- `app/admin/users/components/UserHeader.tsx` — user header with actions
- `app/admin/users/components/UserSearch.tsx` — search component
- `app/admin/users/components/UserSubscriptionInfo.tsx` — subscription details

**Feature flags:**

- Stored in `feature_flags` table (DB-backed)
- Admin UI at `/admin/features`
- API: `GET/PUT /api/admin/features/[flag]`
- Auto-discover: `GET /api/admin/features/discover` — finds new feature gates in code

**Impersonation:**
`POST /api/admin/support/impersonate` — creates a temp session as another user for debugging.

## STEP-BY-STEP: Add a new admin section

1. Create `app/admin/my-section/page.tsx`
2. Create `app/admin/my-section/components/`
3. Add API routes at `app/api/admin/my-section/`
4. Check admin role in the API route:

```typescript
const user = await getAuthenticatedUser(req);
if (user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
```

## GOTCHAS

- **Admin routes are NOT in `/webapp/`** — they're in `/admin/` (separate layout)
- **All admin API routes** must verify admin role (not just authentication)
- **Feature flag operations** should use `ApiErrorHandler` for consistent errors
- **Billing sync** at `POST /api/admin/billing/sync-subscriptions` re-syncs all active subscriptions from Stripe — use carefully

## REFERENCE FILES

- `app/admin/users/components/UserSearch.tsx` — search pattern
- `app/api/admin/features/[flag]/controller.ts` — feature flag controller
- `app/api/admin/features/[flag]/route.ts` — feature flag route
- `app/api/admin/users/route.ts` — user management API

## RETROFIT LOG

### 2025-02-26 — Batch 6 (secondary systems)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
