# INGREDIENTS SKILL

## PURPOSE

Load when working on ingredient management: CRUD operations, allergen detection, unit conversion, bulk updates, cost tracking, stock levels, or CSV import/export of ingredients.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/ingredients/page.tsx` → components in `app/webapp/ingredients/components/`
2. API: `app/api/ingredients/route.ts` → `app/api/ingredients/helpers/`
3. Database: `ingredients` table in Supabase (canonical field: `ingredient_name`, NOT `name`)
4. Allergen detection: `lib/allergens/` + `lib/ingredients/`
5. Unit conversion: `lib/unit-conversion/`
6. Normalization (CSV import): `lib/ingredient-normalization/`

**Key patterns:**

- Ingredients are user-scoped (`user_id` on every query)
- Batch operations use `/api/ingredients/bulk-update` (PUT) for N items
- Allergen detection runs async after create/update
- Stock levels updated via `updateIngredientStockFlow` (E2E helper exists)
- QR codes generated at `/api/ingredients/[id]/qr-code`

## STEP-BY-STEP: Add a new ingredient field

1. Add column to `ingredients` table via new migration in `migrations/`
2. Update Supabase type (regenerate or manually add to `types/`)
3. Add field to the schema in `app/api/ingredients/helpers/schemas.ts`
4. Update PUT handler in `app/api/ingredients/route.ts`
5. Add field to the form in `app/webapp/ingredients/components/IngredientForm.tsx`
6. Update the list display if needed in `IngredientTableRow.tsx`
7. Add the field to bulk-update if applicable: `app/api/ingredients/bulk-update/route.ts`
8. Update `lib/populate-helpers/basic-data.ts` seed data if needed

## STEP-BY-STEP: Add allergen detection to a new endpoint

1. Import `lib/allergens/detection/` detector
2. Call `detectAllergens(ingredientName, category)` after save
3. Update the `allergen_codes` field in the ingredients table
4. Trigger `lib/allergens/cache-invalidation/` to bust dependent recipe/dish caches

## GOTCHAS

- **CANONICAL FIELD NAME:** `ingredient_name` not `name`. Historical aliases may exist. Always use `ingredient_name` in new code.
- **Allergen detection is async** — don't wait for it in the main response. Fire-and-forget or use background job.
- **Unit normalization** happens at save time via `lib/ingredient-normalization/` — don't normalize twice.
- **Bulk update limit** is 100 items per request (PostgreSQL IN clause limit = `MAX_BATCH_SIZE`).
- **CSV import** uses PapaParse + `lib/csv/` — validate units and ingredient names before inserting.

## REFERENCE FILES

- `app/webapp/ingredients/page.tsx` — main page, caching pattern
- `app/api/ingredients/route.ts` — thin handler delegating to helpers
- `app/api/ingredients/helpers/schemas.ts` — Zod validation schema
- `app/api/ingredients/bulk-update/route.ts` — bulk update pattern
- `lib/ingredients/bulk-action-handlers.ts` — bulk action business logic

## RETROFIT LOG

## LAST UPDATED

2025-02-26
