# Troubleshooting Log

Format: **Symptom** | **Root Cause** | **Fix** | **Derived Rule**

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
