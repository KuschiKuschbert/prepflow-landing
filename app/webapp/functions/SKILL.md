# FUNCTIONS & EVENTS SKILL

## PURPOSE

Load when working on the functions (events/catering) feature: event creation, runsheet management, runsheet reordering, function export, customer assignment, or weather alerts for functions.

## HOW IT WORKS IN THIS CODEBASE

**"Functions" = catering events / private functions**

**Data flow:**

1. UI: `app/webapp/functions/page.tsx` + `app/webapp/functions/[id]/`
2. API: `app/api/functions/`
3. DB: `functions` + `function_runsheet_items` tables
4. Customers linked via `function_id` → `customers.function_id`
5. Export: `GET /api/functions/[id]/export` — PDF runsheet

**Runsheet:**

- Ordered list of items (arrival, cocktail hour, dinner service, etc.)
- `POST /api/functions/[id]/runsheet` — add item
- `POST /api/functions/[id]/runsheet/reorder` — reorder all items (DnD)
- `GET/PUT/DELETE /api/functions/[id]/runsheet/[itemId]` — single item

**Weather integration:**
`GET /api/weather/function-alerts` — checks weather forecasts for upcoming function dates and returns alerts for adverse conditions.

**Customer management:**
Customers for functions are managed separately at `/webapp/customers` but linked to functions via `function_id`.

## STEP-BY-STEP: Create a function with runsheet

1. `POST /api/functions` — creates function (name, date, location, guest_count)
2. `POST /api/functions/[id]/runsheet` — add runsheet items in order
3. Reorder as needed: `POST /api/functions/[id]/runsheet/reorder`
4. Export: `GET /api/functions/[id]/export` — generates PDF

## GOTCHAS

- **Runsheet reorder** sends full ordered array of IDs, not just the moved item
- **Weather alerts** only show for functions within the forecast window (~7 days)
- **Customer linking** — customers must be created first at `/api/customers`, then linked

## REFERENCE FILES

- `app/api/functions/route.ts` — function CRUD
- `app/api/functions/[id]/runsheet/reorder/route.ts` — reorder logic
- `app/api/functions/[id]/export/route.ts` — PDF export
- `app/api/weather/function-alerts/route.ts` — weather alerts
- `app/webapp/functions/layout.tsx` — functions layout

## RETROFIT LOG

## LAST UPDATED

2025-02-26
