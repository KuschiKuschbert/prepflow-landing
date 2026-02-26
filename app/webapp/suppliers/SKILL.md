# SUPPLIERS SKILL

## PURPOSE

Load when working on supplier management: supplier CRUD, supplier price lists, price list versioning, or linking ingredients to suppliers.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/suppliers/page.tsx`
2. API: `app/api/suppliers/` + `app/api/supplier-price-lists/`
3. DB: `suppliers` + `supplier_price_lists` + `supplier_price_list_items`

**Price list system:**

- Each supplier has multiple price lists (one can be "current")
- `setCurrentPriceList.ts` — marks a price list as the active/current one
- Ingredients reference `supplier_id` for cost tracking

**Price list operations:**

- `GET/POST /api/supplier-price-lists` — CRUD on price lists
- `createPriceList.ts`, `updatePriceList.ts` — business logic helpers
- `buildPriceListQuery.ts` — Supabase query builder for price lists

## STEP-BY-STEP: Create a supplier with price list

1. `POST /api/suppliers` — name, contact, email
2. `POST /api/supplier-price-lists` — create price list for supplier
3. Mark as current: uses `setCurrentPriceList.ts` internally on POST

## GOTCHAS

- **Multiple price lists per supplier** — ingredients reference the CURRENT price list
- **Price list items** store ingredient-specific prices — different from ingredient base cost
- **Supplier data** is referenced in `lib/populate-helpers/basic-data.ts` for seed data

## REFERENCE FILES

- `app/api/suppliers/route.ts` — supplier CRUD
- `app/api/supplier-price-lists/route.ts` — price list CRUD
- `app/api/supplier-price-lists/helpers/setCurrentPriceList.ts` — set current list
- `lib/populate-helpers/basic-data.ts` — seed data with suppliers

## RETROFIT LOG

### 2025-02-26 — Batch 3 (operations domains)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
