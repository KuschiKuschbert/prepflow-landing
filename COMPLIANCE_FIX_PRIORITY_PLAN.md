# Compliance Fix Priority Plan

**Date:** December 23, 2025
**Status:** Action Plan Created
**Total Violations:** 1,513
**Completion Goal:** Systematic, prioritized fixes

## Executive Summary

This plan organizes the remaining 1,513 violations into a prioritized action plan. Fixes are organized by:

1. **Impact** - How critical is the issue?
2. **Effort** - How long will it take?
3. **Dependencies** - What blocks other work?

**Strategy:** Fix blocking issues first, then tackle high-impact improvements in logical batches.

---

## Phase 1: Blocking Issues (Build Must Pass)

**Goal:** Fix TypeScript compilation errors to unblock builds
**Estimated Time:** 5-10 hours
**Priority:** 🔴 CRITICAL

### 1.1 supabaseAdmin Null Checks (37 errors remaining)

**Status:** 15 fixed, 37 remaining
**Effort:** Low (15-30 minutes per file)
**Pattern:** Add null check at start of function

**Files to Fix:**

```bash
# Get list of files needing fixes
npm run type-check 2>&1 | grep "supabaseAdmin.*is possibly 'null'" | cut -d: -f1 | sort -u
```

**Fix Pattern:**

```typescript
export async function myFunction(...) {
  if (!supabaseAdmin) {
    return {
      error: ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      status: 500,
    };
    // OR throw error if function signature requires it
  }
  // ... rest of function
}
```

**Action Items:**

- [ ] Fix remaining API route helpers (15-20 files)
- [ ] Fix lib/ directory helpers (15-20 files)
- [ ] Run type-check to verify fixes

### 1.2 Missing Module Exports (~50 errors)

**Status:** Needs investigation
**Effort:** Medium-High (may require refactoring)
**Issue:** Circular dependencies or missing index exports

**Problematic Modules:**

- `lib/ai/ai-service/image-generation` - Missing exports
- `lib/allergens/allergen-aggregation` - Missing `australian-allergens` module
- `lib/auth0-management/helpers` - Circular dependencies
- `lib/backup/export` - Missing helper modules
- `lib/dietary/dietary-aggregation` - Missing modules
- Many more in `lib/` directory

**Action Items:**

- [ ] Investigate each missing module (check if file exists)
- [ ] Fix circular dependencies (restructure imports)
- [ ] Add missing index.ts exports where needed
- [ ] Consider refactoring large modules into smaller, focused modules

**Estimated Time:** 4-6 hours

### 1.3 Type Mismatches (~40 errors)

**Status:** Various type issues
**Effort:** Medium (requires understanding type system)

**Key Issues:**

1. **QueryResult Type Mismatch (7 errors in `app/api/dashboard/stats/route.ts`)**
   - Issue: `PostgrestSingleResponse` doesn't match `QueryResult` type
   - Fix: Update type definitions or use correct return types

2. **Enum Type Mismatches**
   - `app/api/employees/route.ts` - Status enum (2 errors)
   - `app/api/backup/create/route.ts` - EncryptionMode enum (2 errors)

3. **Body/Unknown Type Issues**
   - Many routes use `unknown` for body, need proper typing
   - `app/api/temperature-equipment/**` - Multiple body type issues

**Action Items:**

- [ ] Fix QueryResult type mismatch (may need type definition update)
- [ ] Fix enum type mismatches (use proper Zod schemas)
- [ ] Add proper typing for request bodies (use Zod schemas)
- [ ] Fix body type assertions in temperature routes

**Estimated Time:** 3-4 hours

### 1.4 Missing Properties/Undefined (~30 errors)

**Status:** Properties not defined on types
**Effort:** Low-Medium

**Key Issues:**

- `app/admin/tiers/page.tsx` - Property 'id' missing on FeatureMapping
- `app/api/ingredients/detect-missing-allergens/route.ts` - Missing body properties
- `app/api/ingredients/populate-all-allergens/route.ts` - Missing body properties
- `app/api/recipes/[id]/generate-image/helpers/validateRequest.ts` - Missing platingMethods

**Action Items:**

- [ ] Add missing properties to type definitions
- [ ] Add proper Zod schemas for request bodies
- [ ] Fix type definitions to match actual data structures

**Estimated Time:** 2-3 hours

### 1.5 Schema/Validation Errors (~20 errors)

**Status:** Zod schema configuration issues
**Effort:** Low

**Key Issues:**

- `app/api/cleaning-tasks/helpers/schemas.ts` - Zod enum errorMap issue
- `app/api/backup/restore/route.ts` - String array undefined issue

**Action Items:**

- [ ] Fix Zod enum configuration
- [ ] Add proper default values for optional arrays
- [ ] Update schema validation patterns

**Estimated Time:** 1-2 hours

### 1.6 Other TypeScript Errors (~30 errors)

**Status:** Various issues
**Effort:** Low-Medium

**Issues:**

- Middleware redeclared variables (may have more)
- Missing module: `next-auth/react` in `hooks/useSquareAutoSync.ts`
- Undefined `cachedProfile` in `hooks/useUserProfile.ts`
- "Property 'message' does not exist on type 'never'" errors (type narrowing issues)

**Action Items:**

- [ ] Fix remaining middleware variable declarations
- [ ] Fix missing module imports
- [ ] Fix undefined variable references
- [ ] Fix type narrowing issues (proper error type handling)

**Estimated Time:** 2-3 hours

**Phase 1 Total Estimated Time:** 17-28 hours

---

## Phase 2: Critical Security & Quality (High Priority)

**Goal:** Fix critical security violations and code quality issues
**Estimated Time:** 25-40 hours
**Priority:** 🟠 HIGH

### 2.1 File Size Violations (26 files)

**Status:** Files exceed size limits
**Effort:** High (requires refactoring)
**Impact:** Maintainability, performance

**Top 5 Priority Files:**

1. `e2e/system-audit.spec.ts` - 820 lines (limit 300) - **520 lines over**
2. `lib/square/config.ts` - 566 lines (limit 150) - **416 lines over**
3. `lib/square/mappings.ts` - 491 lines (limit 150) - **341 lines over**
4. `lib/services/compliance/validator.ts` - 445 lines (limit 150) - **295 lines over**
5. `e2e/workflows/chef-flow.spec.ts` - 342 lines (limit 300) - **42 lines over**

**Refactoring Strategy:**

- Extract helper functions to separate files
- Split large components into smaller sub-components
- Extract type definitions to `.types.ts` files
- Move utility functions to dedicated utility files
- Use composition patterns for large classes

**Action Items:**

- [ ] Refactor `e2e/system-audit.spec.ts` (split into multiple test files)
- [ ] Refactor `lib/square/config.ts` (extract helpers, split concerns)
- [ ] Refactor `lib/square/mappings.ts` (split by domain)
- [ ] Refactor `lib/services/compliance/validator.ts` (extract validation functions)
- [ ] Continue with remaining 21 files systematically

**Estimated Time:** 15-25 hours

### 2.2 Security Violations (287 remaining)

**Status:** 6 fixed (native dialogs), 287 remaining
**Effort:** Medium-High

**Key Categories:**

#### A. Missing Rate Limiting (~250 warnings)

**Effort:** Low (can be automated)
**Pattern:** Add rate limiting middleware/checks to API routes

**Action Items:**

- [ ] Add rate limiting to all API routes (use existing middleware pattern)
- [ ] Configure route-specific limits (auth routes: stricter)
- [ ] Add rate limit headers to responses

**Estimated Time:** 4-6 hours (can batch fix)

#### B. Missing Input Validation (~20-30 errors)

**Effort:** Medium
**Pattern:** Add Zod schemas for all POST/PUT/PATCH routes

**Action Items:**

- [ ] Identify routes missing validation
- [ ] Create Zod schemas for request bodies
- [ ] Add validation middleware or inline validation
- [ ] Test validation error responses

**Estimated Time:** 6-8 hours

#### C. SQL Injection Prevention (Verification needed)

**Effort:** Low (mostly verification)
**Status:** Most queries use Supabase builder (safe), need verification

**Action Items:**

- [ ] Audit all database queries
- [ ] Verify no string concatenation in queries
- [ ] Ensure all queries use parameterized methods
- [ ] Document safe query patterns

**Estimated Time:** 2-3 hours

**Security Total Estimated Time:** 12-17 hours

### 2.3 Database Pattern Violations (490 violations)

**Status:** Needs systematic review
**Effort:** High (many violations)

**Key Issues:**

- Missing parameterized query verification
- Missing query timeouts
- Missing error handling patterns
- Possible N+1 query issues

**Action Items:**

- [ ] Audit database queries for parameterization
- [ ] Add query timeouts to long-running queries
- [ ] Standardize error handling patterns
- [ ] Optimize N+1 queries (use batch endpoints)
- [ ] Add query result validation

**Estimated Time:** 20-30 hours (can be done incrementally)

**Phase 2 Total Estimated Time:** 47-72 hours

---

## Phase 3: Performance & UX Improvements (Medium Priority)

**Goal:** Improve performance and user experience
**Estimated Time:** 15-25 hours
**Priority:** 🟡 MEDIUM

### 3.1 Optimistic Update Violations (284 violations)

**Status:** Pattern exists, needs application
**Effort:** Medium
**Impact:** High (perceived performance improvement)

**Standard:** All CRUD operations must use optimistic updates for <50ms perceived response time

**Resources:**

- `lib/optimistic-updates.ts` - Utility functions available
- `hooks/useOptimisticMutation.ts` - Reusable hook available
- Documentation in `development.mdc` and `operations.mdc`

**Action Items:**

- [ ] Identify all CRUD operations missing optimistic updates
- [ ] Apply optimistic update pattern:
  1. Store original state
  2. Update UI immediately
  3. Make API call in background
  4. Revert on error
- [ ] Use utility functions from `lib/optimistic-updates.ts`
- [ ] Test error rollback scenarios
- [ ] Remove `fetchData()` calls after successful mutations

**Estimated Time:** 10-15 hours (can batch by feature area)

### 3.2 API Pattern Violations (36 violations)

**Status:** Needs standardization
**Effort:** Low-Medium

**Key Issues:**

- Non-standard API response formats
- Missing ApiErrorHandler usage
- Missing proper status codes

**Standard Pattern:**

```typescript
// Success
return NextResponse.json({
  success: true,
  message: 'Operation completed',
  data: result,
});

// Error
return NextResponse.json(ApiErrorHandler.createError('Error message', 'ERROR_CODE', 400), {
  status: 400,
});
```

**Action Items:**

- [ ] Audit all API routes for response format
- [ ] Standardize success responses (success: true, message, data)
- [ ] Use ApiErrorHandler for all errors
- [ ] Ensure proper HTTP status codes
- [ ] Add response validation (TypeScript types)

**Estimated Time:** 3-5 hours

**Phase 3 Total Estimated Time:** 13-20 hours

---

## Phase 4: Code Quality Improvements (Lower Priority)

**Goal:** Improve code quality and maintainability
**Estimated Time:** 6-12 hours
**Priority:** 🟢 LOW-MEDIUM

### 4.1 React Pattern Violations (347 warnings)

**Status:** Best practices not followed
**Effort:** Medium
**Impact:** Code quality, maintainability

**Key Issues:**

- Missing "use client" directives
- Incorrect hook dependencies
- Missing cleanup functions
- Missing memoization opportunities

**Action Items:**

- [ ] Add "use client" to all client components
- [ ] Fix hook dependency arrays
- [ ] Add cleanup functions to useEffect hooks
- [ ] Add React.memo where appropriate
- [ ] Use useMemo/useCallback for expensive computations

**Estimated Time:** 5-8 hours

### 4.2 Voice Consistency Violations (37 info violations)

**Status:** Dialog/UI text doesn't match PrepFlow voice
**Effort:** Low
**Impact:** UX consistency

**Standard:** Professional but friendly, kitchen-themed metaphors, use contractions

**Action Items:**

- [ ] Review all dialog messages
- [ ] Update to match PrepFlow voice guidelines
- [ ] Use kitchen/chef metaphors naturally
- [ ] Ensure clear, direct language
- [ ] Add personality without being unprofessional

**Estimated Time:** 1-2 hours

**Phase 4 Total Estimated Time:** 6-10 hours

---

## Implementation Strategy

### Recommended Approach

**Week 1: Blocking Issues (Phase 1)**

- Days 1-2: Fix supabaseAdmin null checks (quick wins)
- Days 2-3: Investigate and fix missing module exports
- Days 3-4: Fix type mismatches and schema errors
- Day 5: Fix remaining TypeScript errors

**Week 2: Critical Quality (Phase 2)**

- Days 1-2: Refactor top 5 largest files
- Days 2-3: Fix security violations (rate limiting, validation)
- Days 3-5: Database pattern improvements

**Week 3: Performance & Polish (Phases 3-4)**

- Days 1-3: Apply optimistic updates
- Day 4: Standardize API patterns
- Day 5: React pattern improvements and voice consistency

### Batch Processing Strategy

1. **Quick Wins First:** Fix easy issues (null checks, simple type fixes) to build momentum
2. **Batch Similar Fixes:** Group similar violations together (all null checks, all rate limiting, etc.)
3. **Test Incrementally:** Verify fixes don't break functionality after each batch
4. **Document Patterns:** Document fix patterns as you go for consistency

### Tools & Automation

**Available Scripts:**

- `npm run cleanup:check` - Check all violations
- `npm run cleanup:fix` - Auto-fix available issues
- `npm run cleanup:report` - Generate detailed report
- `npm run type-check` - Check TypeScript errors
- `npm run lint` - Check ESLint violations
- `npm run format` - Auto-format code

**Recommended Workflow:**

1. Run `npm run cleanup:check` to get current violation list
2. Fix batch of similar violations
3. Run `npm run type-check` and `npm run lint` to verify
4. Test functionality
5. Commit with descriptive message
6. Repeat

---

## Success Metrics

### Phase 1 Success Criteria

- ✅ TypeScript compilation passes (`npm run type-check` succeeds)
- ✅ Build succeeds (`npm run build` passes)
- ✅ Zero blocking errors

### Phase 2 Success Criteria

- ✅ All files under size limits
- ✅ Security violations reduced by 80%+
- ✅ Database patterns standardized
- ✅ No SQL injection risks

### Phase 3 Success Criteria

- ✅ All CRUD operations use optimistic updates
- ✅ API responses standardized
- ✅ Perceived response time <50ms for mutations

### Phase 4 Success Criteria

- ✅ React patterns compliant
- ✅ Voice consistency achieved
- ✅ Code quality improved

---

## Estimated Total Time

| Phase                     | Estimated Time   | Priority    |
| ------------------------- | ---------------- | ----------- |
| Phase 1: Blocking Issues  | 17-28 hours      | 🔴 CRITICAL |
| Phase 2: Critical Quality | 47-72 hours      | 🟠 HIGH     |
| Phase 3: Performance & UX | 13-20 hours      | 🟡 MEDIUM   |
| Phase 4: Code Quality     | 6-10 hours       | 🟢 LOW      |
| **Total**                 | **83-130 hours** |             |

**Realistic Timeline:** 2-3 weeks of focused work (assuming 4-6 hours per day)

---

## Quick Reference: Common Fix Patterns

### supabaseAdmin Null Check

```typescript
if (!supabaseAdmin) {
  return {
    error: ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
    status: 500,
  };
}
```

### Rate Limiting (Already in middleware, verify all routes protected)

### Input Validation (Zod Schema)

```typescript
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const result = schema.safeParse(await request.json());
if (!result.success) {
  return NextResponse.json(
    ApiErrorHandler.createError(result.error.issues[0].message, 'VALIDATION_ERROR', 400),
    { status: 400 },
  );
}
```

### Optimistic Update

```typescript
const originalState = [...items];
setItems(newState); // Update immediately
try {
  await api.updateItem(id, data);
  showSuccess('Updated');
} catch (err) {
  setItems(originalState); // Revert on error
  showError('Update failed');
}
```

### API Response Format

```typescript
// Success
return NextResponse.json({
  success: true,
  message: 'Operation completed',
  data: result,
});

// Error
return NextResponse.json(ApiErrorHandler.createError('Error message', 'ERROR_CODE', 400), {
  status: 400,
});
```

---

## Notes

- This plan is a living document - update as progress is made
- Prioritize based on current project needs
- Some fixes may reveal additional issues - adjust plan accordingly
- Consider creating codemods for repetitive fixes (e.g., null checks, rate limiting)



