# RECIPE SHARING SKILL

## PURPOSE

Load when working on recipe sharing: sharing recipes between users, generating share links, the recipe sharing page, or the `normalizeRecipeForShare` helper.

## HOW IT WORKS IN THIS CODEBASE

**Recipe sharing flow:**

1. User selects recipe(s) to share
2. `POST /api/recipe-share` — creates a share record, returns share token
3. Recipient accesses share link (public URL with token)
4. `GET /api/recipe-share?token=...` — fetches shared recipe
5. Recipient can import the recipe into their own account

**Share normalization:**
`lib/api-helpers/normalizeRecipeForShare.ts` — strips user-specific data (prices, supplier IDs) before sharing. Shared recipes contain: ingredients list, instructions, serving sizes, allergens, but NOT costs.

**Bulk sharing:**
`POST /api/recipes/bulk-share` — share multiple recipes at once

**UI:**
`app/webapp/recipe-sharing/page.tsx` — manage shared recipes (sent and received)

## GOTCHAS

- **Share tokens expire** — check expiry logic in the share route
- **Costs are stripped** — never include ingredient costs in shared recipe data (competitive sensitivity)
- **Allergens are included** — food safety data is always shared

## REFERENCE FILES

- `app/api/recipe-share/route.ts` — share CRUD
- `lib/api-helpers/normalizeRecipeForShare.ts` — data stripping
- `app/webapp/recipe-sharing/page.tsx` — sharing UI

## RETROFIT LOG

## LAST UPDATED

2025-02-26
