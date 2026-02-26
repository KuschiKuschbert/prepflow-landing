# PAR LEVELS & ORDER LISTS SKILL

## PURPOSE

Load when working on par levels, order lists, prep lists, or inventory management features.

## HOW IT WORKS IN THIS CODEBASE

**Par level = minimum stock threshold for an ingredient**

**Data flow:**

- Par levels: `app/api/par-levels/` → `par_levels` table
- Order lists: `app/api/order-lists/` → `order_lists` + `order_list_items`
- Prep lists: `app/api/prep-lists/` → `prep_lists` + `prep_list_items`

**Par level fetching strategy (two methods):**

1. `fetchWithJoin.ts` — JOIN with ingredients table (fast, one query)
2. `fetchFallback.ts` — fallback if JOIN fails (separate queries)

**Order list from par levels:**
System compares current stock against par levels and generates a suggested order list.

**Prep list from menu:**
`POST /api/prep-lists/generate-from-menu` — reads menu items and generates a prep list based on expected covers. Also: `POST /api/prep-lists/batch-create` and `POST /api/prep-lists/analyze-prep-details`.

**Export:**
`app/webapp/par-levels/hooks/useParLevelsExport.ts` — CSV/PDF export of par levels.

## STEP-BY-STEP: Set par levels for ingredients

1. `GET /api/par-levels` — fetch current par levels
2. `POST /api/par-levels` — create par level (ingredient_id + min_quantity + unit)
3. UI shows visual indicator when stock drops below par

## GOTCHAS

- **Two fetch methods** — `fetchWithJoin` is primary, `fetchFallback` is the safety net
- **Par levels are per-unit** — quantity must match ingredient's stock unit
- **Order list generation** is advisory — user confirms before placing
- **`fetchIngredient.ts`** at `lib/api-helpers/` is a shared helper for par level queries

## REFERENCE FILES

- `app/api/par-levels/helpers/fetch/fetchWithJoin.ts` — primary fetch
- `app/api/par-levels/helpers/fetch/fetchFallback.ts` — fallback fetch
- `app/api/par-levels/helpers/fetchParLevelWithIngredient.ts` — single item fetch
- `app/api/prep-lists/generate-from-menu/route.ts` — prep list generation
- `app/webapp/par-levels/hooks/useParLevelsExport.ts` — export hook

## RETROFIT LOG

### 2025-02-26 — Batch 3 (operations domains)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
