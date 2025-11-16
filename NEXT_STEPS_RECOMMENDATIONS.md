# 🎯 Next Steps Recommendations

**Date:** January 2025
**Status:** Post-Enterprise Cleanup
**Priority:** High → Low

---

## 🚨 **IMMEDIATE PRIORITY (Blocking Commits)**

### **1. Fix File Size Violations** ⚠️ **CRITICAL**

**Problem:** Pre-commit hooks are blocking commits due to 19 API routes exceeding 200-line limit.

**Impact:** Cannot commit changes until resolved.

**Files Exceeding Limits:**

- `app/api/dishes/[id]/route.ts` - 309 lines (limit 200)
- `app/api/recipes/[id]/route.ts` - 317 lines (limit 200)
- `app/api/supplier-price-lists/route.ts` - 304 lines (limit 200)
- Plus 16 other API routes (203-287 lines)

**Recommended Approach:**

1. **Create refactoring branch:** `refactor/api-routes-split`
2. **Split strategy:**
   - Extract helper functions to separate files (`helpers/` directory)
   - Extract validation logic to `validators/` directory
   - Extract business logic to `services/` directory
   - Keep route handlers thin (just request/response handling)

**Example Pattern:**

```typescript
// Before: app/api/recipes/[id]/route.ts (317 lines)
// After:
//   app/api/recipes/[id]/route.ts (150 lines - handler only)
//   app/api/recipes/[id]/helpers/validateRecipe.ts (50 lines)
//   app/api/recipes/[id]/helpers/checkRecipeUsage.ts (50 lines)
//   app/api/recipes/[id]/helpers/deleteRecipeAndCleanup.ts (67 lines)
```

**Estimated Time:** 2-3 days
**Priority:** 🔴 **CRITICAL** (blocks all commits)

---

## ✅ **QUICK WINS (High Value, Low Effort)**

### **2. Remove Rogue Breakpoints** ✅ **EASY**

**Problem:** 3 standard Tailwind breakpoints (`sm:`, `md:`, `lg:`) found in 1 file - these are disabled and won't work.

**File:** `app/webapp/components/navigation/NavItem.tsx`

**Action:**

1. Replace `sm:`, `md:`, `lg:` with custom breakpoints
2. Test navigation on mobile/tablet/desktop
3. Commit with `refactor: replace rogue breakpoints`

**Estimated Time:** 15 minutes
**Priority:** 🟡 **HIGH** (prevents broken responsive behavior)

---

### **3. Fix Remaining ESLint False Positives** ✅ **EASY**

**Problem:** 2 ESLint errors about recursive function calls (false positives).

**File:** `app/webapp/recipes/hooks/useRecipeIngredients.ts`

**Action:**

1. Add ESLint disable comments for specific lines (with explanation)
2. Or refactor recursive calls to use iterative approach (if feasible)

**Estimated Time:** 30 minutes
**Priority:** 🟡 **MEDIUM** (cleaner lint output)

---

## 📚 **ONGOING IMPROVEMENTS (Medium Priority)**

### **4. Continue JSDoc Standardization** 📝

**Status:** Key utilities complete, remaining functions need documentation.

**Priority Files:**

- `lib/api/batch-utils.ts` - Batch fetching utilities
- `lib/ingredients/normalizeIngredientData.ts` - Ingredient normalization
- `lib/autosave-id.ts` - Autosave ID derivation
- Key React hooks (useAutosave, useParallelFetch, etc.)

**Approach:**

- Add JSDoc to 5-10 functions per PR
- Focus on public APIs first
- Use templates from AGENTS.md

**Estimated Time:** 1-2 hours per batch
**Priority:** 🟢 **MEDIUM** (improves developer experience)

---

### **5. Create Codemod Scripts** 🔄

**Status:** Rules defined, scripts need to be created.

**Priority Scripts:**

1. **Breakpoint Migration:** `sm:` → `tablet:`, `md:` → `tablet:`, `lg:` → `desktop:`
2. **Console Migration:** `console.log` → `logger.dev()`, `console.error` → `logger.error()`
3. **Component Updates:** Deprecated component replacements

**Tools:**

- Use `jscodeshift` for AST transformations
- Create scripts in `scripts/codemods/`
- Add tests for each codemod

**Estimated Time:** 1-2 days
**Priority:** 🟢 **LOW** (nice-to-have automation)

---

## 🏗️ **TECHNICAL DEBT (Lower Priority)**

### **6. Refactor Large Hooks** 🔧

**Problem:** Several hooks exceed 100-line limit.

**Files:**

- `app/webapp/recipes/hooks/useRecipeIngredients.ts` - 348 lines (limit 100)
- `app/webapp/recipes/hooks/useRecipeManagement.ts` - 206 lines (limit 100)
- `app/webapp/recipes/hooks/useRecipePricing.ts` - 437 lines (limit 100)

**Approach:**

- Extract sub-hooks for specific concerns
- Extract utility functions
- Split complex logic into smaller functions

**Estimated Time:** 2-3 days
**Priority:** 🟢 **LOW** (code quality improvement)

---

### **7. Refactor Large Components** 🎨

**Problem:** Several components exceed 300-line limit.

**Files:**

- `app/webapp/recipes/components/RecipesClient.tsx` - 454 lines (limit 300)

**Approach:**

- Extract sub-components
- Extract custom hooks
- Split into smaller, focused components

**Estimated Time:** 1-2 days
**Priority:** 🟢 **LOW** (code quality improvement)

---

## 📋 **RECOMMENDED EXECUTION ORDER**

### **Phase 1: Unblock Commits (Week 1)**

1. ✅ Fix file size violations (API routes)
2. ✅ Remove rogue breakpoints
3. ✅ Fix ESLint false positives

### **Phase 2: Standardization (Week 2-3)**

4. ✅ Continue JSDoc standardization
5. ✅ Create codemod scripts (optional)

### **Phase 3: Technical Debt (Ongoing)**

6. ✅ Refactor large hooks
7. ✅ Refactor large components

---

## 🎯 **IMMEDIATE ACTION ITEMS**

**For Today:**

1. Create branch: `refactor/api-routes-split`
2. Start with highest-impact file: `app/api/recipes/[id]/route.ts` (317 lines)
3. Extract helpers and test thoroughly

**For This Week:**

1. Complete API route refactoring (all 19 files)
2. Remove rogue breakpoints
3. Fix ESLint false positives
4. Commit and merge to main

**For Next Week:**

1. Continue JSDoc standardization
2. Create first codemod script (breakpoint migration)

---

## 💡 **STRATEGIC RECOMMENDATIONS**

### **1. Batch Refactoring Approach**

- Refactor similar files together (e.g., all recipe-related routes)
- Create shared helper utilities where possible
- Test each batch before moving to next

### **2. Incremental JSDoc**

- Don't try to document everything at once
- Focus on public APIs and utilities first
- Add JSDoc as you touch files

### **3. Codemod Strategy**

- Start with simplest transformation (breakpoint migration)
- Test thoroughly on branch before applying to main
- Document usage in AGENTS.md

### **4. File Size Prevention**

- Add pre-commit hook reminder (already exists)
- Review file sizes during code review
- Refactor proactively when approaching limits

---

## ✅ **SUCCESS CRITERIA**

**Phase 1 Complete When:**

- ✅ All file size violations resolved
- ✅ All commits pass pre-commit hooks
- ✅ No rogue breakpoints remain
- ✅ ESLint errors resolved

**Phase 2 Complete When:**

- ✅ All public APIs have JSDoc
- ✅ Codemod scripts created (optional)
- ✅ Documentation updated

**Phase 3 Complete When:**

- ✅ All hooks under 100 lines
- ✅ All components under 300 lines
- ✅ Code quality metrics improved

---

**Next Immediate Step:** Start with `refactor/api-routes-split` branch and tackle `app/api/recipes/[id]/route.ts` first.
