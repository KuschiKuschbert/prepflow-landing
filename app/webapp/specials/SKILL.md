# SPECIALS & SPECIAL DAYS SKILL

## PURPOSE

Load when working on the daily specials feature, special days calendar, AI-powered special suggestions, or the SpecialsGrid/SpecialsFilters components.

## HOW IT WORKS IN THIS CODEBASE

**Two related features:**

1. **Special Days** — calendar events (holidays, public holidays, special occasions) that affect prep
2. **Daily Specials** — AI-suggested menu items based on available stock and the date

**Special Days data flow:**

1. UI: embedded in calendar (`/webapp/calendar`) + referenced in roster/functions
2. API: `app/api/special-days/`
3. DB: `special_days` table

**Daily Specials data flow:**

1. UI: `app/webapp/specials/page.tsx`
2. API: `POST /api/ai-specials` — AI generates specials
3. Stock check: `POST /api/ai-specials/search` — checks available ingredients

**SpecialsGrid:**
`app/webapp/specials/components/SpecialsGrid.tsx` — displays specials with filtering

**SpecialsFilters:**
`app/webapp/specials/components/SpecialsFilters.tsx` — filter controls

**Utils:**
`app/webapp/specials/utils.ts` — utility functions for specials (formatting, sorting)

## STEP-BY-STEP: Generate AI specials for a date

1. `POST /api/ai-specials/search` — pass date and optionally a category
2. System checks `ingredients` stock levels for available items
3. `POST /api/ai-specials` — AI generates dish suggestions from available stock
4. Suggestions returned as `SpecialSuggestion[]`

## STEP-BY-STEP: Add a special day

1. `POST /api/special-days` — name, date, type (holiday/event/custom)
2. Special day appears in calendar and is considered in AI specials generation

## GOTCHAS

- **AI specials depend on stock data** — outdated stock = irrelevant suggestions
- **Special days schema** in `app/api/special-days/helpers/schemas.ts`
- **SpecialsHeader** (`app/webapp/specials/components/SpecialsHeader.tsx`) controls date selection

## REFERENCE FILES

- `app/webapp/specials/page.tsx` — specials page
- `app/webapp/specials/utils.ts` — utility functions
- `app/api/special-days/route.ts` — special days CRUD
- `app/api/special-days/helpers/schemas.ts` — Zod schema
- `app/api/ai-specials/search/helpers/fetchStockIngredients.ts` — stock checking

## RETROFIT LOG

### 2025-02-26 — Batch 6 (secondary systems)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
