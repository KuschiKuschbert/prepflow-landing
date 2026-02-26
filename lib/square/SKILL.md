# SQUARE POS SKILL

## PURPOSE

Load when working on Square POS integration: OAuth setup, catalog sync, staff sync, order sync, cost sync, webhooks, or Square mapping management.

## HOW IT WORKS IN THIS CODEBASE

**226 files in `lib/square/`** — largest integration in the codebase.

**Architecture:**

```
lib/square/
├── client/           → Square API client factory (loads OAuth token from DB)
├── oauth-client.ts   → OAuth flow helpers
├── config.ts         → User-specific Square config from DB
├── sync/
│   ├── catalog/      → Dishes ↔ Square catalog items
│   ├── staff/        → Employees ↔ Square team members
│   ├── orders/       → Order history sync
│   └── costs/        → Ingredient cost sync
└── mappings/         → PrepFlow ID ↔ Square ID mapping tables
```

**OAuth flow:**

1. User visits `/webapp/square`
2. Clicks "Connect" → hits `GET /api/square/oauth` → redirects to Square OAuth
3. Square redirects to `GET /api/square/callback` with auth code
4. Token exchanged and stored encrypted (key: `SQUARE_TOKEN_ENCRYPTION_KEY`)
5. Sync can now run

**Sync operations:**

- Manual sync: `POST /api/square/sync`
- Auto-sync: `hooks/useSquareAutoSync.ts` (debounced, on data change)
- Webhooks: `POST /api/webhook/square` (real-time updates from Square)

**Mapping system:**

- `lib/square/mappings/` stores PrepFlow ID → Square ID pairs
- Used to avoid creating duplicate items on re-sync
- Managed via `GET/PUT /api/square/mappings`

## STEP-BY-STEP: Add a new sync operation

1. Create `lib/square/sync/my-entity/syncFromSquare.ts`
2. Create `lib/square/sync/my-entity/syncToSquare.ts`
3. Add mapping functions in `lib/square/mappings/`
4. Wire into `POST /api/square/sync` handler
5. Add to sync status display in `app/webapp/square/page.tsx`

## STEP-BY-STEP: Handle a Square webhook event

1. `POST /api/webhook/square` receives the event
2. Verify Square signature
3. Route by `event.type` to the appropriate handler in `lib/square/sync/`
4. Use `sync-operation-handler.ts` for the update

## GOTCHAS

- **Square SDK version:** ^44.0.0 — check breaking changes on upgrade
- **Token encryption:** All Square OAuth tokens are encrypted at rest. Never store plaintext.
- **Sandbox vs Production:** Square sandbox and production have different Application IDs. Check `SQUARE_APPLICATION_ID`.
- **Auto-sync debounce:** `useSquareAutoSync` debounces sync to prevent hammering the API after rapid changes.
- **Catalog sync is one-way by default** — Square → PrepFlow for prices, PrepFlow → Square for new items.
- **Staff sync mapping:** Square "team member" ID ≠ PrepFlow employee ID. Always look up via mappings table.

## REFERENCE FILES

- `lib/square/client/factory.ts` — Square client creation with token loading
- `app/api/square/sync/helpers/sync-operation-handler.ts` — sync orchestration
- `app/api/square/callback/route.ts` — OAuth callback handler
- `hooks/useSquareAutoSync.ts` — auto-sync hook
- `app/webapp/square/page.tsx` — Square management UI

## RETROFIT LOG

### 2025-02-26 — Batch 5 (integrations)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
