# Troubleshooting Log

Format: **Symptom** | **Root Cause** | **Fix** | **Derived Rule**

---

## Hydration mismatch: server text doesn't match client (HowItWorksSection, useTranslation)

**Symptom:** `Hydration failed because the server rendered text didn't match the client` for HowItWorksSection title ("How PrepFlow Works" vs "Get Results in 3 Simple Steps"), TechnicalSpecs items, CloserLook feature titles.

**Root Cause:** `useTranslation` loads translations async in `useEffect`. On server, no translations exist (empty cache), so `t()` returns fallback. On client, after load or from cached prior visit, translations return different values. Server and first client paint produce different HTML.

**Fix:**

1. In `useTranslation`, return fallback when `isLoading` is true (both server and initial client have `isLoading === true`).
2. Align component fallbacks with `lib/translations/en-AU.ts` so fallback matches the default translation (no visible flash when translations load).

**Derived Rule:** Translation hooks used in SSR components must return fallback until translations are ready; fallbacks should match the default locale for consistent hydration.

---

## HMR: Icon module factory not available (Turbopack)

**Symptom:** `Error: Module [project]/components/ui/Icon.tsx was instantiated because it was required from module [project]/app/webapp/ingredients/components/SupplierCombobox.tsx, but the module factory is not available. It might have been deleted in an HMR update.`

**Root Cause:** The `components/ui/Icon.tsx` file was a thin re-export of `lib/ui/Icon.tsx`. During HMR (Fast Refresh), Turbopack can invalidate the re-export chain such that one module holds a stale reference to a "deleted" factory.

**Fix:**

1. **Immediate:** Restart the dev server (`npm run dev`).
2. **Structural:** Consolidated Icon: moved full implementation into `components/ui/Icon.tsx` and made `lib/ui/Icon.tsx` re-export from components. Single source of truth in components avoids the fragile re-export chain for the hot path.

**Derived Rule:** Prefer inlining shared UI component implementations in their canonical import location rather than re-export chains, to reduce HMR fragility.

---

## Message channel closed before response (Vercel Analytics / extensions)

**Symptom:** `A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received` and `runtime.lastError` in console.

**Root Cause:** Vercel Analytics and Speed Insights run in debug mode in development and use async message-passing. When HMR reloads or the page navigates, the message channel closes before handlers respond. Browser extensions (React DevTools, etc.) can also cause similar errors.

**Fix:** Do not render Vercel Analytics and Speed Insights in development. In `app/layout.tsx`, wrap them with `process.env.NODE_ENV === 'production'`. Both packages do not track data in dev anyway, so skipping them eliminates the noise and avoids loading debug scripts.

**Derived Rule:** Only mount Vercel Analytics and Speed Insights when `NODE_ENV === 'production'` to avoid dev-time message channel errors.

---

## Partytown TypeError: Cannot read properties of undefined (reading 'apply')

**Symptom:** `TypeError: Cannot read properties of undefined (reading 'apply')` in `partytown-ww-sw.js`.

**Root Cause:** Partytown runs third-party scripts in web workers. During HMR or navigation, worker scripts can receive messages for handlers that have been torn down.

**Fix:** Usually transient. Restart dev server if it persists. Consider disabling Partytown in development if it causes repeated noise.

**Derived Rule:** Partytown-related errors during development are often timing/HMR-related; verify production build behavior separately.

---

## QR codes not working (unscannable, 404s, params ignored)

**Symptom:** QR codes appear in Temperature Equipment, Cleaning Areas, Settings QR Library, Menu Builder, and Recipe Sharing, but: (1) codes may be unscannable or render incorrectly, (2) recipe QR scans result in 404, (3) scanning cleaning/ingredients QR codes navigates but destination pages ignore query params.

**Root Cause:**

1. **Rendering:** `react-qr-code` expects hex color strings (`#000000`, `#FFFFFF`) for `fgColor`/`bgColor`. Passing CSS variables (`var(--qr-foreground)`) produces invalid SVG colors. `--qr-background` was undefined.
2. **Recipe 404:** Recipe QR encoded `/webapp/recipes/{id}` but no `/webapp/recipes/[id]` route exists; recipes page is list-only.
3. **Params ignored:** Cleaning, ingredients, staff, and suppliers pages did not read `?area`, `?storage`, `?id` from `useSearchParams()`.
4. **Storage semantics:** API used `storage_area` but DB column is `storage_location`. Storage-area QR used equipment ID, but ingredients filter by storage location name (string).

**Fix:**

1. Use hex colors in all `react-qr-code` usages: `fgColor="#000000"` and `bgColor="#FFFFFF"`. Add `--qr-background: #FFFFFF` to globals.css.
2. Change recipe destination to `/webapp/recipes?recipe={id}` and add logic to open `UnifiedRecipeModal` when `recipe` param is present.
3. Wire URL params: Cleaning page reads `?area={id}` and opens area tasks; ingredients page reads `?storage={value}` and sets storage filter. Staff/suppliers lower priority.
4. Fix API: use `storage_location` (not `storage_area`) in getIngredientsHandler. Change storage-area QR URL to use equipment `name` (not `id`) so it matches `storage_location` values.

**Derived Rule:** Use hex colors for `react-qr-code`; wire `useSearchParams()` on destination pages for QR deep links; ensure URL param values align with filter semantics (e.g. storage name vs ID).

---

## auth0.handler is not a function (Auth0 route 500s)

**Symptom:** `/api/auth/login` returns 500; server error `auth0.handler is not a function`.

**Root Cause:** Auth0 SDK v4 exposes `middleware()` on Auth0Client; the internal `handler` is on AuthClient, not Auth0Client. Route handlers were incorrectly calling `auth0.handler()` which does not exist.

**Fix:** Use `auth0.middleware(req)` in route handlers instead of `auth0.handler(req)`. `middleware()` delegates to the internal handler.

**Derived Rule:** Auth0 SDK v4: use `auth0.middleware()` for route handlers; do not use `auth0.handler`.

---

## column recipes.name does not exist / recipes_1.name

**Symptom:** 500 on `/api/recipe-share`, dishes APIs; Postgres error `column recipes.name does not exist`.

**Root Cause:** Migration `rename-recipe-name-to-recipe-name.sql` renamed `recipes.name` → `recipes.recipe_name`. API code still selected or filtered by `name`.

**Fix:** Update all recipe selects and filters to use `recipe_name`: recipe-share GET, recipes/exists, dishes fetchDishRecipes. Use `recipeRecord.recipe_name` for the `name` field in mapped responses.

**Derived Rule:** After recipe name migration: use `recipe_name` in Supabase queries; map to `name` in API responses for backwards-compatible consumers.

---

## PGRST200: Could not find relationship compliance_records ↔ compliance_types

**Symptom:** 500 on `/api/compliance-records`; PostgREST error PGRST200.

**Root Cause:** PostgREST embedded resource syntax `compliance_records(*, compliance_types(...))` requires a visible FK relationship. Schema cache or RLS may not expose it.

**Fix:** Fetch `compliance_records` and `compliance_types` in separate queries; merge in code by `compliance_type_id`. Avoids join dependency.

**Derived Rule:** When PostgREST join fails (PGRST200), fall back to separate queries and merge client-side.

---

## column kitchen_sections.name does not exist

**Symptom:** 500 on prep-lists generate-from-menu; `column kitchen_sections.name does not exist`.

**Root Cause:** Some migrations use `kitchen_sections.section_name`; code selected `kitchen_sections(id, name)`.

**Fix:** Select `kitchen_sections(id, section_name)`; use `section?.section_name || section?.name` for backwards compatibility with both schemas.

**Derived Rule:** kitchen_sections may use `name` or `section_name`; support both when consuming.

---

## minimatch is not a function (Jest test:coverage fails)

**Symptom:** `TypeError: minimatch is not a function` when running `npm run test:coverage`; 20+ test suites fail at `test-exclude` / `babel-plugin-istanbul`.

**Root Cause:** The override `"minimatch": ">=10.2.1"` forced minimatch v10+ everywhere. `test-exclude` (used by babel-plugin-istanbul for coverage) expects the old minimatch API where `minimatch` is a callable function; v10 exports differently.

**Fix:** Replace the top-level minimatch override with a targeted override so `test-exclude` gets minimatch v5.1.6:

```json
"overrides": {
  "test-exclude": {
    "minimatch": "5.1.6"
  }
}
```

Remove `"minimatch": ">=10.2.1"` from overrides. Run `npm install` and `npm run test:coverage`.

**Derived Rule:** test-exclude requires minimatch 5.x (function API); use nested override to avoid breaking ESLint and other deps that need minimatch 10+.

---

## column shifts.user_id does not exist

**Symptom:** 500 on `/api/roster/shifts`; Postgres error `column shifts.user_id does not exist`.

**Root Cause:** The shifts table schema may differ from code expectations (e.g. multi-tenancy migration renamed to `created_by`, `owner_id`, or uses a different segregation pattern). API code filters by `user_id`.

**Fix:** Check Supabase schema for `shifts` table. If column was renamed, update roster shift handlers to use the correct column. If using RLS/tenant isolation, ensure the filter column matches the schema. Add migration if the table was created without `user_id`.

**Derived Rule:** When roster/shifts APIs fail with column errors, verify `shifts` table schema matches API expectations (user_id vs created_by etc.).

---

## Could not find table 'public.recipe_shares'

**Symptom:** 500 on `/api/recipe-share`; PostgREST error PGRST205 `Could not find the table 'public.recipe_shares' in the schema cache`.

**Root Cause:** The `recipe_shares` table may not exist in the current database (migration not applied, or table was never created in this environment).

**Fix:** Create the `recipe_shares` table via Supabase migration if it does not exist. Schema should include: id, recipe_id, shared_with_user_id, shared_by_user_id, created_at. Run `supabase db push` or apply the migration. Reload schema cache if needed (`NOTIFY pgrst, 'reload schema'`).

**Derived Rule:** recipe-share feature requires `recipe_shares` table; ensure migration is applied in all environments.
