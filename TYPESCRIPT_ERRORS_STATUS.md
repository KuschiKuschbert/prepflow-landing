# TypeScript Errors Status

**Date:** December 23, 2025
**Initial Errors:** 207
**Current Errors:** ~230 (some fixes introduced new errors)
**Fixed So Far:** ~20 errors

## Fixed Errors

1. ✅ **Duplicate imports in `app/api/ai-specials/route.ts`** - Removed duplicate ApiErrorHandler and logger imports (4 errors)
2. ✅ **Duplicate logger imports in optimistic-updates files** - Fixed 4 files (8 errors):
   - `lib/optimistic-updates/create.ts`
   - `lib/optimistic-updates/delete.ts`
   - `lib/optimistic-updates/update.ts`
   - `lib/optimistic-updates/reorder.ts`
3. ✅ **Duplicate `data` variable in `createQualification.ts`** - Renamed parameter to `qualificationData` (2 errors)
4. ✅ **Duplicate `isApi` variable in `middleware.ts`** - Removed duplicate declaration (2 errors)
5. ✅ **Variable scope issues in route handlers** - Fixed `id`/`menuId` scope in:
   - `app/api/employees/[id]/route.ts` (3 handlers)
   - `app/api/menus/[id]/route.ts` (3 handlers)
6. ✅ **supabaseAdmin null checks** - Fixed 2 files:
   - `app/api/admin/errors/client/helpers/getUserId.ts`
   - `app/api/admin/errors/client/helpers/handleAutoReport.ts`

## Remaining Errors by Category

### Critical (Blocking Build)

#### supabaseAdmin Null Checks (53 errors)

**Files needing null checks:**

- `app/api/compliance/validate/helpers/validateCompliance.ts` (3 errors)
- `app/api/employees/[id]/qualifications/[qual_id]/helpers/deleteQualification.ts` (2 errors)
- `app/api/employees/[id]/qualifications/[qual_id]/helpers/updateQualification.ts` (2 errors)
- `app/api/employees/[id]/qualifications/helpers/createQualification.ts` (2 errors)
- Many more in lib/ directory (allergen-aggregation, auth-user-sync, dietary, etc.)

**Fix Pattern:**

```typescript
if (!supabaseAdmin) {
  throw new Error('Database connection not available');
  // OR return error response
}
```

#### Missing Module Exports/Imports (~50 errors)

These appear to be circular dependency or missing export issues:

- `lib/ai/ai-service/image-generation` - Missing exports
- `lib/allergens/allergen-aggregation` - Missing `australian-allergens` module
- `lib/auth0-management/helpers` - Circular dependencies
- `lib/backup/export` - Missing helper modules
- `lib/dietary/dietary-aggregation` - Missing modules
- Many more...

**Action:** These need investigation - may be actual missing files or circular dependency issues.

#### Type Mismatches (~40 errors)

- `app/api/dashboard/stats/route.ts` - QueryResult type mismatch (7 errors)
- `app/api/employees/route.ts` - Status enum type mismatches (2 errors)
- `app/api/employees/[id]/route.ts` - Update data type mismatch (1 error)
- `app/api/dishes/route.ts` - Number vs string type (1 error)
- Many body/unknown type issues in temperature-equipment routes

#### Missing Properties/Undefined (~30 errors)

- `app/admin/tiers/page.tsx` - Property 'id' missing on FeatureMapping
- `app/api/ingredients/detect-missing-allergens/route.ts` - Missing properties on body
- `app/api/ingredients/populate-all-allergens/route.ts` - Missing properties
- `app/api/recipes/[id]/generate-image/helpers/validateRequest.ts` - Missing platingMethods

#### Schema/Validation Errors (~20 errors)

- `app/api/cleaning-tasks/helpers/schemas.ts` - Zod enum errorMap issue
- `app/api/backup/create/route.ts` - EncryptionMode type mismatch
- `app/api/backup/restore/route.ts` - String array undefined issue

#### Other Errors (~30 errors)

- `middleware.ts` - Redeclared variables (already fixed one, may have more)
- `hooks/useSquareAutoSync.ts` - Missing next-auth/react module
- `hooks/useUserProfile.ts` - Undefined cachedProfile
- Various "Property 'message' does not exist on type 'never'" errors

## Priority Order

1. **supabaseAdmin null checks** (53 errors) - High priority, easy to fix
2. **Missing module exports** (50 errors) - Critical, need investigation
3. **Type mismatches** (40 errors) - High priority, may indicate real bugs
4. **Missing properties** (30 errors) - Medium priority
5. **Schema/validation** (20 errors) - Medium priority
6. **Other** (30 errors) - Lower priority, various issues

## Next Steps

1. Fix all supabaseAdmin null checks (systematic, quick wins)
2. Investigate missing module exports (may need file restructuring)
3. Fix type mismatches (may require schema updates)
4. Address remaining issues systematically

## Estimated Time

- supabaseAdmin null checks: ~1-2 hours (53 files)
- Missing modules: Unknown (may require architectural changes)
- Type mismatches: ~2-4 hours (40 files)
- Other: ~2-3 hours (remaining issues)

**Total Estimated Time:** 5-10 hours for complete fix


