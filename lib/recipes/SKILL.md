# RECIPES SKILL

## PURPOSE

Load when working on recipe management: CRUD, recipe ingredients, cost calculation, image generation, dietary suitability, allergen sources, sharing, or recipe cards.

## HOW IT WORKS IN THIS CODEBASE

**Data flow:**

1. UI: `app/webapp/recipes/page.tsx` → components in `app/webapp/recipes/components/`
2. API: `app/api/recipes/route.ts` + `app/api/recipes/[id]/` routes
3. Database: `recipes` + `recipe_ingredients` tables
4. Batch ingredients: `POST /api/recipes/ingredients/batch` (accepts array of recipe IDs)
5. Cost: `GET /api/dishes/[id]/cost` (dishes share cost logic with recipes)
6. AI: `POST /api/ai/recipe-instructions`, `POST /api/recipes/[id]/suggest-plating-methods`

**Performance pattern (critical):**

- Recipe list loads immediately from cache → prices calculate async in background
- Batch endpoint replaces N sequential calls: `POST /api/recipes/ingredients/batch`
- Recipe prices NOT loaded on initial render — fetched progressively

**Recipe lifecycle:**

1. Create recipe (name, category, serving size)
2. Add ingredients via recipe_ingredients junction table
3. Cost auto-calculated from ingredient prices
4. Dietary suitability and allergens detected async
5. Optional: generate image via Hugging Face
6. Optional: lock recipe via menu lock

## STEP-BY-STEP: Create a recipe with ingredients

1. `POST /api/recipes` — creates recipe record, returns `{ recipe: { id, ... } }`
2. `POST /api/recipes/[id]/ingredients` — adds ingredients to the recipe
3. Allergen and dietary detection triggered automatically in background
4. Cost calculated on demand via `GET /api/dishes/[id]/cost`

## STEP-BY-STEP: Add a new recipe API helper

1. Create `app/api/recipes/[id]/my-feature/route.ts`
2. Create `app/api/recipes/[id]/my-feature/helpers/` for business logic
3. Always `await context.params` (Next.js 16)
4. Add to `routing.md` and `lib/cache/prefetch-config.ts`

## GOTCHAS

- **Batch endpoint critical:** Never make N sequential calls for recipe ingredients. Use `/api/recipes/ingredients/batch`.
- **Cost is calculated, not stored** — recipe cost is computed from current ingredient prices at query time.
- **Dietary suitability is async** — don't block the UI waiting for it.
- **Recipe sharing** has its own endpoint: `POST /api/recipe-share` and `GET /api/recipe-share`
- **Recipe normalization** (for AI import) lives in `lib/recipe-normalization/`
- **Recipe processor** (for AI generation) lives in `lib/recipes/utils/recipe-processor.ts`

## REFERENCE FILES

- `app/webapp/recipes/page.tsx` — caching + progressive loading pattern
- `app/api/recipes/route.ts` — standard CRUD handler
- `app/api/recipes/ingredients/batch/route.ts` — batch fetch pattern
- `lib/recipes/utils/recipe-processor.ts` — recipe processing utilities
- `app/webapp/recipes/hooks/useDishFormData.ts` — form state management

## RETROFIT LOG

### 2025-02-26 — Batch 2 (primary business domains)

- `lib/recipes/cli.ts`: replaced `main().catch(console.error)` with `logger.error` call

## LAST UPDATED

2025-02-26
