# 🔍 PrepFlow Full Codebase Audit Report

**Generated:** 2025-11-18
**Status:** ⚠️ **129 violations found** (71 critical, 58 warnings)

---

## 📊 Executive Summary

### Overall Health: ⚠️ **Needs Attention**

- ✅ **TypeScript:** No type errors
- ✅ **ESLint:** No violations
- ✅ **Prettier:** All files formatted correctly
- ✅ **Breakpoints:** No rogue breakpoints
- ✅ **Icons:** No emoji icons found
- ✅ **Unused Imports:** None found
- ✅ **Dead Code:** No unused exports
- ✅ **Security Patterns:** Passed basic checks
- ❌ **File Sizes:** 71 files exceed limits
- ❌ **Console.log Migration:** 21 instances need migration to logger
- ⚠️ **JSDoc Documentation:** 34 functions missing JSDoc
- ⚠️ **Performance:** Bundle size exceeds budgets (3.4MB total)
- ⚠️ **Security:** 9 high severity npm vulnerabilities (Jest/glob)

---

## 🚨 Critical Issues (71 violations)

### 1. File Size Violations (71 files)

**MANDATORY:** All files exceeding size limits must be refactored.

#### API Routes (6 files exceeding 200-line limit)

1. **`app/api/compliance/health-inspector-report/route.ts`** - **708 lines** (254% over limit)
   - **Action:** Split into multiple endpoints or extract helper functions
   - **Priority:** 🔴 **HIGHEST** - Largest violation

2. **`app/api/menus/[id]/ingredients/route.ts`** - **321 lines** (61% over limit)
   - **Action:** Extract ingredient logic to separate utility file

3. **`app/api/menus/[id]/items/[itemId]/route.ts`** - **204 lines** (2% over limit)
   - **Action:** Minor refactoring needed

4. **`app/api/par-levels/helpers/createParLevel.ts`** - **303 lines** (51% over limit)
   - **Action:** Split into smaller helper functions

5. **`app/api/par-levels/route.ts`** - **335 lines** (68% over limit)
   - **Action:** Extract handlers to separate files

6. **`app/api/prep-lists/generate-from-menu/route.ts`** - **316 lines** (58% over limit)
   - **Action:** Extract generation logic to utility file

#### Hooks (30 files exceeding 100-line limit)

**Most Critical:**

- `app/webapp/menu-builder/hooks/useMenuDragDrop.ts` - **221 lines** (121% over limit)
- `app/webapp/dish-builder/hooks/useDishBuilder.ts` - **144 lines** (44% over limit)
- `app/webapp/ingredients/hooks/useIngredientAdd.ts` - **135 lines** (35% over limit)
- `app/webapp/ingredients/hooks/useIngredientCSV.ts` - **128 lines** (28% over limit)
- `app/webapp/dish-builder/hooks/utils/dishSave.ts` - **121 lines** (21% over limit)

**All Hook Violations:**

- `app/components/landing/hooks/useAppleStyleAnimations.ts` - 115 lines
- `app/webapp/cogs/hooks/useCOGSCalculations.ts` - 116 lines
- `app/webapp/cogs/hooks/useIngredientAddition.ts` - 111 lines
- `app/webapp/cogs/hooks/useRecipeIngredientsAutosave.ts` - 102 lines
- `app/webapp/components/hooks/useTemperatureStatus.ts` - 107 lines
- `app/webapp/dish-builder/hooks/useDishBuilder.ts` - 144 lines
- `app/webapp/dish-builder/hooks/utils/dishSave.ts` - 121 lines
- `app/webapp/dish-builder/hooks/utils/ingredientManagement.ts` - 110 lines
- `app/webapp/ingredients/hooks/useIngredientAdd.ts` - 135 lines
- `app/webapp/ingredients/hooks/useIngredientCSV.ts` - 128 lines
- `app/webapp/menu-builder/hooks/useMenuDragDrop.ts` - 221 lines
- `app/webapp/performance/hooks/usePerformanceInsights.ts` - 105 lines
- `app/webapp/prep-lists/components/hooks/usePrepListPreview.ts` - 175 lines
- `app/webapp/prep-lists/hooks/usePrepListExport.ts` - **463 lines** (363% over limit) 🔴
- `app/webapp/recipes/components/hooks/useDishesClientHandlers.ts` - 111 lines
- `app/webapp/recipes/components/hooks/useRecipeDishIngredientLoading.ts` - 159 lines
- `app/webapp/recipes/components/hooks/useRecipeDishSave.ts` - 126 lines
- `app/webapp/recipes/components/hooks/useRecipeHandlers.ts` - 117 lines
- `app/webapp/recipes/hooks/useDishCOGSCalculations.ts` - 102 lines
- `app/webapp/recipes/hooks/useDishCostCalculation.ts` - 101 lines
- `app/webapp/recipes/hooks/useRecipeActions.ts` - 142 lines
- `app/webapp/recipes/hooks/useRecipeIngredients.ts` - 113 lines
- `app/webapp/recipes/hooks/utils/batchFetchWithRetry.ts` - 110 lines
- `app/webapp/recipes/hooks/utils/buildPricingCallbacks.ts` - 110 lines
- `app/webapp/recipes/hooks/utils/generateInstructionTemplates.ts` - 150 lines
- `app/webapp/recipes/hooks/utils/recipeSubscriptionSetup.ts` - 128 lines
- `app/webapp/sections/hooks/useDishSectionActions.ts` - 147 lines
- `app/webapp/temperature/hooks/useEquipmentLogs.ts` - 107 lines
- `app/webapp/temperature/hooks/useTemperatureEquipmentHandlers.ts` - 207 lines
- `app/webapp/temperature/hooks/useTemperatureEquipmentTabHandlers.ts` - 145 lines
- `app/webapp/temperature/hooks/useTemperaturePageData.ts` - 112 lines
- `hooks/useAutosave.ts` - 112 lines
- `hooks/useDrawerSwipe.ts` - **205 lines** (105% over limit)
- `hooks/useLogoInteractions.ts` - 121 lines
- `hooks/useNavigationTracking.ts` - **267 lines** (167% over limit) 🔴
- `hooks/useOptimisticMutation.ts` - 102 lines
- `hooks/useParallelFetch.ts` - 106 lines
- `hooks/useSessionTimeout.ts` - 110 lines
- `hooks/utils/drawerTouchMoveHandler.ts` - 127 lines

#### Components (5 files exceeding 300-line limit)

1. **`app/webapp/menu-builder/components/MenuEditor.tsx`** - **1,010 lines** (237% over limit) 🔴
   - **Action:** Split into multiple sub-components
   - **Priority:** 🔴 **HIGHEST** - Largest component violation

2. **`app/webapp/menu-builder/components/MenuCategory.tsx`** - **702 lines** (134% over limit)
   - **Action:** Extract category logic to hooks and sub-components

3. **`app/webapp/employees/components/EmployeeForm.tsx`** - **451 lines** (50% over limit)
   - **Action:** Split form sections into separate components

4. **`app/webapp/menu-builder/components/MenuList.tsx`** - **459 lines** (53% over limit)
   - **Action:** Extract list item component

5. **`app/webapp/prep-lists/components/PrepListPreview.tsx`** - **307 lines** (2% over limit)
   - **Action:** Minor refactoring needed

#### Pages (2 files exceeding 500-line limit)

1. **`app/webapp/prep-lists/page.tsx`** - **535 lines** (7% over limit)
   - **Action:** Extract components and hooks

2. **`app/webapp/par-levels/page.tsx`** - **569 lines** (14% over limit)
   - **Action:** Extract components and hooks

#### Utilities (12 files exceeding 150-line limit)

**Most Critical:**

- `lib/compliance/report-generator.ts` - **1,625 lines** (983% over limit) 🔴🔴🔴
  - **Action:** Split into multiple generator modules
  - **Priority:** 🔴 **CRITICAL** - Largest utility violation

**All Utility Violations:**

- `app/webapp/performance/utils/generatePerformanceTips.ts` - 171 lines
- `app/webapp/prep-lists/utils/prepTechniques.ts` - 200 lines
- `app/webapp/temperature/components/utils.ts` - **306 lines** (104% over limit)
- `lib/ai/ai-service.ts` - 166 lines
- `lib/analytics.ts` - 161 lines
- `lib/compliance/report-generator.ts` - **1,625 lines** 🔴
- `lib/country-config.ts` - 198 lines
- `lib/ingredients/migrate-to-standard-units.ts` - 175 lines
- `lib/logger.ts` - 166 lines
- `lib/navigation-optimization/optimizer.ts` - 210 lines
- `lib/navigation-optimization/patternAnalyzer.ts` - 220 lines
- `lib/optimistic-updates.ts` - **281 lines** (87% over limit)
- `lib/performance-monitor.ts` - 185 lines
- `lib/temperature-log-generator.ts` - 167 lines

#### Scripts (4 files exceeding 300-line limit)

- `scripts/check-performance-budget.js` - 341 lines
- `scripts/generate-performance-report.js` - 402 lines
- `scripts/optimize-performance.js` - 361 lines
- `scripts/send-performance-report.js` - 334 lines

**Note:** Scripts may be exempt from strict limits, but should still be refactored for maintainability.

---

## ⚠️ Warning Issues (58 violations)

### 2. Console.log Migration (21 instances)

**MANDATORY:** All `console.log()` calls must be migrated to `logger.dev()`.

**Files with console usage:**

- `app/webapp/menu-builder/components/MenuEditor.tsx` - 2 instances (`console.error`)
- `app/webapp/par-levels/page.tsx` - 3 instances (`console.log`)
- `app/page.tsx` - console usage

**Action:** Run `npm run codemod:console:write` to auto-migrate.

**Reference:** See `development.mdc` (Console Migration Codemod)

### 3. Missing JSDoc Documentation (34 functions)

**MANDATORY:** All public functions, components, and hooks must have JSDoc.

**Action:** Add JSDoc following templates in `development.mdc` (JSDoc Documentation Standards)

**Reference:** See `cleanup.mdc` (JSDoc Requirements)

---

## 📦 Performance Issues

### 4. Bundle Size Violations

**Current Bundle Sizes:**

- **Total:** 3,403 KB (580% over 500KB budget)
- **JavaScript:** 3,250.5 KB (1,525% over 200KB budget)
- **CSS:** 152.5 KB (205% over 50KB budget)

**Performance Budgets:**

- Total bundle: 500KB (500,000 bytes)
- JavaScript bundle: 200KB (200,000 bytes)
- CSS bundle: 50KB (50,000 bytes)

**Action Required:**

1. Analyze bundle composition: `npm run analyze`
2. Implement code splitting for large components
3. Lazy load non-critical components
4. Optimize third-party dependencies
5. Consider removing unused dependencies

**Reference:** See `operations.mdc` (Performance Standards)

---

## 🔒 Security Issues

### 5. npm Vulnerabilities (9 high severity)

**Vulnerable Package:** `glob` (10.3.7 - 11.0.3)

- **Severity:** High
- **Issue:** Command injection via -c/--cmd executes matches with shell:true
- **Affected:** Jest dependencies (`@jest/core`, `@jest/reporters`, `jest-runtime`)

**Action Required:**

```bash
# Review and update Jest dependencies
npm audit fix --force  # May install breaking changes (Jest 29.7.0)
```

**Note:** This may require updating Jest configuration and test files.

**Reference:** See `security.mdc` (Dependency Security)

---

## 📋 Recommended Action Plan

### Phase 1: Critical File Refactoring (Week 1-2)

**Priority Order:**

1. 🔴 **`lib/compliance/report-generator.ts`** (1,625 lines) - Split into modules
2. 🔴 **`app/webapp/menu-builder/components/MenuEditor.tsx`** (1,010 lines) - Split into sub-components
3. 🔴 **`app/api/compliance/health-inspector-report/route.ts`** (708 lines) - Extract helpers
4. 🔴 **`app/webapp/menu-builder/components/MenuCategory.tsx`** (702 lines) - Extract logic
5. 🔴 **`app/webapp/prep-lists/hooks/usePrepListExport.ts`** (463 lines) - Split hook

### Phase 2: Console Migration & JSDoc (Week 2)

1. Run console migration: `npm run codemod:console:write`
2. Add JSDoc to 34 missing functions
3. Verify all migrations completed

### Phase 3: Performance Optimization (Week 3-4)

1. Analyze bundle: `npm run analyze`
2. Implement code splitting
3. Lazy load components
4. Optimize dependencies

### Phase 4: Security Updates (Week 4)

1. Review Jest vulnerabilities
2. Update dependencies carefully
3. Test all test suites after updates

### Phase 5: Remaining Refactoring (Ongoing)

1. Refactor remaining file size violations
2. Continue JSDoc documentation
3. Monitor bundle sizes

---

## 🛠️ Quick Fixes Available

### Auto-Fixable Issues

```bash
# 1. Migrate console.log to logger
npm run codemod:console:write

# 2. Format code
npm run format

# 3. Check for auto-fixable issues
npm run cleanup:fix
```

### Manual Fixes Required

- File size violations (refactoring)
- JSDoc documentation (add documentation)
- Performance optimization (code splitting)
- Security updates (dependency updates)

---

## 📊 Progress Tracking

### Current Status

- ✅ **TypeScript:** 0 errors
- ✅ **ESLint:** 0 violations
- ✅ **Prettier:** All formatted
- ❌ **File Sizes:** 71 violations
- ❌ **Console.log:** 21 instances
- ⚠️ **JSDoc:** 34 missing
- ⚠️ **Performance:** Bundle size violations
- ⚠️ **Security:** 9 vulnerabilities

### Target Status

- ✅ **File Sizes:** 0 violations
- ✅ **Console.log:** 0 instances (all migrated)
- ✅ **JSDoc:** 100% coverage
- ✅ **Performance:** Within budgets
- ✅ **Security:** 0 vulnerabilities

---

## 📚 References

- **File Size Limits:** `development.mdc` (File Refactoring Standards)
- **Console Migration:** `development.mdc` (Console Migration Codemod)
- **JSDoc Standards:** `development.mdc` (JSDoc Documentation Standards)
- **Performance Standards:** `operations.mdc` (Performance Standards)
- **Security Standards:** `security.mdc` (Dependency Security)
- **Cleanup System:** `cleanup.mdc` (Complete cleanup standards)

---

## 🎯 Next Steps

1. **Review this audit report** with the team
2. **Prioritize critical violations** (largest files first)
3. **Create refactoring branches** for each major violation
4. **Run auto-fixes** for console migration
5. **Track progress** using this report

**Generated by:** PrepFlow Cleanup System
**Report Location:** `cleanup-reports/cleanup-report-*.html` (detailed HTML report available)
