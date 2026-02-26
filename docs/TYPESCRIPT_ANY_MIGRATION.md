# TypeScript `any` Migration Guide

Replace `any` with proper types across the codebase. Project standard: "Strict typing, no `any` types without justification" (development.mdc).

## Fix Patterns

| Pattern                                                | Fix                                                |
| ------------------------------------------------------ | -------------------------------------------------- |
| `supabase: any` in API helpers                         | `SupabaseClient` from `@supabase/supabase-js`      |
| Dynamic payloads (`formattedUpdates`, `changeDetails`) | Define interfaces or use `Record<string, unknown>` |
| `row as Record<string, any>`                           | `Record<string, unknown>` (safer, same runtime)    |
| External API JSON                                      | `unknown` + type guard / Zod parse                 |
| Generic handlers/callbacks                             | Proper generics or `(...args: unknown[]) => void`  |

## Exclusions

- `app/curbos/` (protected)
- `lib/rsi/` (dynamic logic)
- `scripts/`
- `**/*.test.*`, `**/*.spec.*`
- `types/*.d.ts`
- `e2e/`

## Phase Status

### Phase 1: API routes ✅ Done

| File                                                                       | Status    | Notes                               |
| -------------------------------------------------------------------------- | --------- | ----------------------------------- |
| app/api/leads/route.ts                                                     | Done      | supabase: SupabaseClient            |
| app/api/populate-recipes/route.ts                                          | Done      | supabaseAdmin: SupabaseClient       |
| app/api/par-levels/helpers/fetchParLevelWithIngredient.ts                  | Done      | SupabaseClient                      |
| app/api/par-levels/helpers/fetch/fetchFallback.ts                          | Done      | typed                               |
| app/api/special-days/route.ts                                              | Done      | req as NextRequest                  |
| app/api/special-days/[id]/route.ts                                         | Done      | req as NextRequest                  |
| app/api/menus/helpers/helpers.ts                                           | Done      | menus: { id: string }[]             |
| app/api/dishes/[id]/helpers/put/performDishUpdate.ts                       | Done      | updateData: Record<string, unknown> |
| app/api/menus/[id]/menu-display/export/route.ts                            | Done      | theme: ExportTheme                  |
| app/api/menus/[id]/export-combined/route.ts                                | Done      | theme: ExportTheme                  |
| app/api/menus/[id]/allergen-matrix/export/route.ts                         | Done      | theme: ExportTheme                  |
| app/api/compliance/allergens/export/route.ts                               | Done      | theme: ExportTheme                  |
| app/api/fix/auth0-callback-urls/route.ts                                   | Justified | SDK update payload cast             |
| app/api/backup/restore/helpers/processRestore.ts                           | Done      | data: unknown                       |
| app/api/admin/features/[flag]/controller.ts                                | Done      | FilterableQuery                     |
| app/api/recipes/[id]/ingredients/helpers/fetchIngredients.ts               | Done      | Record<string, unknown>             |
| app/api/menus/[id]/lock/helpers/generateRecipeCards/checkers/\*            | Done      | NormalizedIngredient[]              |
| app/api/ingredients/populate-all-allergens/helpers/batchRunner.ts          | Done      | IngredientForBatch[]                |
| app/api/backup/create/helpers/prepareContent.ts                            | Done      | backupData: BackupData              |
| app/api/dishes/[id]/generate-image/helpers/batchFetchRecipeIngredients.ts  | Done      | ri: Record<string, unknown>         |
| app/api/cleaning-tasks/helpers/fetchPaginatedTasks.ts                      | Done      | RangableQuery                       |
| app/api/dishes/[id]/allergen-sources/helpers/processIngredientAllergens.ts | Done      | di: Record<string, unknown>         |
| app/api/ingredients/helpers/update/invalidateCostCaches.ts                 | Done      | changeDetails                       |
| app/api/ingredients/helpers/update/detectCurrentAllergens.ts               | Done      | typed interfaces                    |
| app/api/dishes/[id]/helpers/put/\*                                         | Done      | changeDetails                       |
| app/api/dedupe/execute/helpers/buildUsageMap.ts                            | Done      | Record<string, unknown>             |
| app/api/dishes/cost/batch/helpers/calculateDishCost.ts                     | Done      | Record<string, unknown>             |
| app/api/allergens/[code]/dishes/route.ts                                   | Done      | DishRow[]                           |
| app/api/temperature-equipment/helpers/applyQueenslandStandards.ts          | Done      | Record<string, unknown>             |
| app/api/suppliers/helpers/buildSupplierData.ts                             | Done      | Record<string, unknown>             |
| app/api/recipe-share/helpers/normalizeRecipeForShare.ts                    | Done      | Record<string, unknown>             |
| app/api/square/sync/helpers/sync-operation-handler.ts                      | Done      | Record<string, unknown>             |
| app/api/dishes/[id]/helpers/fetchDishRecipes.ts                            | Done      | Map<string, RecipeMapValue>         |

### Phase 2: lib helpers ✅ Done

| File                                               | Status                     |
| -------------------------------------------------- | -------------------------- | --------------------------------------------- |
| lib/auth0-management/helpers/verifyCallbackUrls.ts | Justified                  |
| lib/auth0-google-connection/helpers/\*.ts          | Justified                  |
| lib/square/client/factory.ts                       | Done                       | ConstructorParameters<typeof SquareClient>[0] |
| lib/square/sync/orders/helpers/fetchOrders.ts      | Justified                  |
| lib/square/sync/staff/syncFromSquare.ts            | Done                       | TeamSearchable interface                      |
| lib/square/sync/catalog/syncFromSquare.ts          | Justified                  |
| lib/curbos/tier-access.ts                          | Justified                  |
| lib/backup/export/helpers/getUserTablesWithData.ts | Done                       |
| lib/exports/generate-pdf.ts                        | Done                       | ChromiumLaunchOptions interface               |
| lib/ingredients/bulk-action-handlers.ts            | Done                       |
| lib/demo-mode.ts                                   | Done                       |
| lib/personality/helpers/scheduler-events.ts        | Done (PersonalitySettings) |
| lib/recipes/utils/logger.ts                        | Done                       |
| lib/recipes/utils/recipe-processor.ts              | Done                       | Promise<{ totalProcessed: number }>           |
| lib/square/sync/costs.ts                           | Done                       |
| lib/analytics/types.ts                             | Done                       |
| lib/ai/groq-client-helpers/response-parser.ts      | Done                       |

### Phase 3: Hooks and components ✅ Done

| File                                                                 | Status                         |
| -------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------- |
| hooks/useUserProfile.ts                                              | Justified (Auth session shape) |
| hooks/useUserProfile/helpers/buildProfileData.ts                     | Justified                      |
| hooks/useSquareAutoSync.ts                                           | Justified                      |
| hooks/useConfirm/helpers/handlers.ts                                 | Justified                      |
| app/webapp/staff/page.tsx                                            | Done                           |
| app/webapp/ingredients/components/hooks/useIngredientDataSync.ts     | Done                           |
| app/webapp/settings/billing/page.tsx                                 | Done                           |
| app/webapp/staff/components/OnboardingWizard/utils/buildDocuments.ts | Done                           |
| app/webapp/par-levels/hooks/useParLevelsExport.ts                    | Done                           |
| components/ui/ScrollReveal.tsx                                       | Done                           |
| app/providers.tsx                                                    | Done                           | (cb: () => void) => void for requestIdleCallback fallback |

## Before/After Examples

### supabase: any → SupabaseClient

```typescript
// Before
async function checkLeadsTable(supabase: any) { ... }

// After
import { SupabaseClient } from '@supabase/supabase-js';
async function checkLeadsTable(supabase: SupabaseClient) { ... }
```

### changeDetails: any → Record<string, unknown>

```typescript
// Before
changeDetails: any, // justified

// After
changeDetails: Record<string, unknown>,
```

### Record<string, any> → Record<string, unknown>

```typescript
// Before
const row = r as Record<string, any>;

// After
const row = r as Record<string, unknown>;
```
