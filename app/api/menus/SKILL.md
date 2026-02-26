# MENUS & DISHES SKILL

## PURPOSE

Load when working on menu builder, menu items, dish builder, menu locking, allergen matrix, menu exports, or menu statistics.

## HOW IT WORKS IN THIS CODEBASE

**Two separate concepts:**

- **Dishes** (`app/api/dishes/`) — the product catalog (items with recipes, prices, images)
- **Menus** (`app/api/menus/`) — curated collections of dishes with ordering

**Data flow:**

1. Menu builder UI: `app/webapp/menu-builder/page.tsx`
2. Dish builder UI: `app/webapp/dish-builder/page.tsx`
3. Menu items join: `menu_dishes` table (dish_id → menu_id with ordering)
4. Menu locking: `POST /api/menus/[id]/lock` — freezes prices and generates recipe cards

**Menu lock lifecycle:**

1. User locks menu → `POST /api/menus/[id]/lock`
2. Helper `checkBySignature.ts` / `checkByOldMethod.ts` verifies recipe card integrity
3. Locked menus use light API (`?locked=1`) to skip expensive price enrichment
4. MenuCard prefetches on hover for locked menus

**Key exports:**

- Combined export: `GET /api/menus/[id]/export-combined` (PDF)
- Menu display: `GET /api/menus/[id]/menu-display/export`
- Recipe cards: `GET /api/menus/[id]/recipe-cards/export`
- Allergen matrix: `GET /api/menus/[id]/allergen-matrix/export`

## STEP-BY-STEP: Add a new dish

1. `POST /api/dishes` — creates dish (name, recipe_id, selling_price, category)
2. Assign to section: `POST /api/assign-dish-section`
3. Add to menu: `POST /api/menus/[id]/items`
4. Cost auto-calculated: `GET /api/dishes/[id]/cost`
5. Image optional: `POST /api/dishes/[id]/generate-image`

## STEP-BY-STEP: Handle dish cost calculation

Cost = sum of (ingredient.cost_per_unit × recipe_ingredient.quantity × waste_factor)

- Cost endpoint: `GET /api/dishes/[id]/cost`
- Batch cost: `POST /api/dishes/cost/batch` (for list views — prevents N+1)
- GST: Australian standard 10% is excluded from gross profit calculations

## GOTCHAS

- **Locked menus skip enrichment** — use `?locked=1` query param for display/print
- **Reorder uses dedicated endpoint** — `POST /api/menus/[id]/reorder` (not PUT on items)
- **Dish bulk delete** — `POST /api/dishes/bulk-delete` accepts array of IDs
- **allergen-sources endpoint** is separate from the dish CRUD — `GET /api/dishes/[id]/allergen-sources`
- **Dietary suitability** is async — `POST /api/dishes/[id]/revalidate-dietary`

## REFERENCE FILES

- `app/webapp/menu-builder/page.tsx` — menu builder UI
- `app/api/menus/[id]/lock/helpers/generateRecipeCards/` — menu lock logic
- `app/api/menus/helpers/helpers.ts` — shared menu helpers
- `app/api/dishes/cost/batch/helpers/calculateDishCost.ts` — cost calculation
- `app/webapp/cogs/components/COGSTableGrouped/` — COGS display

## RETROFIT LOG

## LAST UPDATED

2025-02-26
