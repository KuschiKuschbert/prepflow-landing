# Manual Fix Plan

**Date:** 2025-01-XX
**Priority:** High
**Estimated Total Effort:** 8-12 hours

---

## Overview

This document provides a prioritized, step-by-step plan for fixing all issues identified in the comprehensive continuity and formatting audit.

### Fix Categories

1. 🔴 **CRITICAL** - Database Schema Inconsistencies (2 issues)
2. 🟠 **HIGH** - Table Material Design 3 Compliance (8 issues)
3. 🟠 **MEDIUM** - ESLint Warnings (11 warnings)
4. 🟢 **LOW** - Breakpoint Migration (61 instances)
5. 🟢 **LOW** - Empty State Styling (2 issues)

---

## 🔴 CRITICAL: Database Schema Fixes

### Priority: **CRITICAL**

**Effort:** 2-3 hours
**Impact:** Prevents runtime errors, ensures data consistency

### Issue 1: Field Name Inconsistencies

**Problem:** Multiple schema files use `name` instead of `ingredient_name` for ingredients table.

**Files Affected:**

- `supabase-tables-only.sql` (line 7)
- `database-setup.sql` (line 7)
- `setup-database.sql` (line 7)
- `supabase-complete-setup.sql` (line 20) - Uses `ingredient_name` ✅

**Fix Steps:**

1. **Update supabase-tables-only.sql:**

   ```sql
   -- Change line 7 from:
   name VARCHAR(255) NOT NULL,
   -- To:
   ingredient_name VARCHAR(255) NOT NULL,
   ```

2. **Update database-setup.sql:**

   ```sql
   -- Change line 7 from:
   name VARCHAR(255) NOT NULL,
   -- To:
   ingredient_name VARCHAR(255) NOT NULL,
   ```

3. **Update setup-database.sql:**

   ```sql
   -- Change line 7 from:
   name VARCHAR(255) NOT NULL,
   -- To:
   ingredient_name VARCHAR(255) NOT NULL,
   ```

4. **Update index creation:**
   - Change `idx_ingredients_name` to use `ingredient_name` column
   - Update all references from `ingredients(name)` to `ingredients(ingredient_name)`

5. **Verify:**
   - Run schema validation
   - Check all API endpoints still work
   - Test ingredient creation/updates

### Issue 2: Recipe Table Field Name

**Problem:** Some schema files use `name` instead of `recipe_name` for recipes table.

**Files Affected:**

- `supabase-tables-only.sql` (line 24)
- `database-setup.sql` (line 25)
- `setup-database.sql` (line 24)
- `supabase-complete-setup.sql` (line 39) - Uses `name` ⚠️

**Fix Steps:**

1. **Decide on canonical name:**
   - Check current production database structure
   - Determine if `name` or `recipe_name` is correct
   - Update AGENTS.md with decision

2. **Update all schema files consistently:**
   - Use same field name across all files
   - Update indexes accordingly
   - Update foreign key references if needed

### Issue 3: ID Type Inconsistencies

**Problem:** Some schemas use `SERIAL` (INTEGER), others use `UUID`.

**Files Affected:**

- `supabase-tables-only.sql` - Uses SERIAL
- `COMPLETE_DATABASE_FIX.sql` - Uses UUID ✅
- `supabase-complete-setup.sql` - Uses UUID ✅

**Fix Steps:**

1. **Determine production standard:**
   - Check current production database
   - Verify which ID type is actually used

2. **Standardize all schema files:**
   - Update all to use UUID (recommended)
   - Or update all to use SERIAL (if that's production standard)
   - Update foreign key references accordingly

3. **Update all schema files:**
   - Change `id SERIAL PRIMARY KEY` to `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - Update all foreign key columns to match
   - Update index definitions if needed

**Verification:**

- Test schema creation on fresh database
- Verify foreign key relationships work
- Test API endpoints with new schema

---

## 🟠 HIGH: Table Material Design 3 Compliance Fixes

### Priority: **HIGH**

**Effort:** 2-3 hours
**Impact:** Visual consistency, user experience

### Fix 1: RecipeTable.tsx - Missing Wrapper Container

**File:** `app/webapp/recipes/components/RecipeTable.tsx`
**Line:** 61-62
**Effort:** 15 minutes

**Current Code:**

```tsx
<div className="desktop:block hidden overflow-x-auto">
  <table className="min-w-full divide-y divide-[#2a2a2a]">
```

**Fix:**

```tsx
<div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
  <div className="hidden overflow-x-auto desktop:block">
    <table className="min-w-full divide-y divide-[#2a2a2a]">{/* ... table content ... */}</table>
  </div>
</div>
```

**Steps:**

1. Wrap table in standard container div
2. Move `desktop:block hidden overflow-x-auto` to inner div
3. Test responsive behavior
4. Verify styling matches other tables

### Fix 2: IngredientTable.tsx - Missing Sticky Header

**File:** `app/webapp/ingredients/components/IngredientTable.tsx`
**Line:** 150
**Effort:** 5 minutes

**Current Code:**

```tsx
<thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
```

**Fix:**

```tsx
<thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
```

**Steps:**

1. Add `sticky top-0 z-10` classes to thead
2. Test scrolling behavior
3. Verify header sticks when scrolling

### Fix 3: IngredientTable.tsx - Missing tbody Background

**File:** `app/webapp/ingredients/components/IngredientTable.tsx`
**Line:** 202
**Effort:** 5 minutes

**Current Code:**

```tsx
<tbody className="divide-y divide-[#2a2a2a]">
```

**Fix:**

```tsx
<tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
```

**Steps:**

1. Add `bg-[#1f1f1f]` class to tbody
2. Verify background color matches standard

### Fix 4: EquipmentTable.tsx - Missing tbody Background

**File:** `app/webapp/temperature/components/EquipmentTable.tsx`
**Line:** 81
**Effort:** 5 minutes

**Current Code:**

```tsx
<tbody className="divide-y divide-[#2a2a2a]">
```

**Fix:**

```tsx
<tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
```

**Steps:**

1. Add `bg-[#1f1f1f]` class to tbody
2. Verify background color matches standard

### Fix 5-8: Header Cell Padding Consistency

**Files:**

- `EquipmentTable.tsx` (lines 61-78) - Uses `py-4` instead of `py-3`
- `EquipmentListTableDesktop.tsx` (lines 60-113) - Uses `py-4` instead of `py-3`

**Effort:** 10 minutes per file

**Fix:**
Change `py-4` to `py-3` in all header cells to match standard.

**Note:** `py-4` may be intentional for these tables. Review design intent before changing.

---

## 🟠 MEDIUM: ESLint Warnings Fixes

### Priority: **MEDIUM**

**Effort:** 3-4 hours
**Impact:** Code quality, potential bugs

### Fix 1-2: Replace img with Image Component

**Files:**

- `app/webapp/employees/components/EmployeeCard.tsx` (line 103)
- `app/webapp/employees/components/EmployeeForm.tsx` (line 235)

**Effort:** 30 minutes per file

**Steps:**

1. **Import Image component:**

   ```tsx
   import Image from 'next/image';
   ```

2. **Replace `<img>` with `<Image />`:**

   ```tsx
   // Before:
   <img src={photoUrl} alt={name} className="..." />

   // After:
   <Image
     src={photoUrl}
     alt={name}
     width={100}
     height={100}
     className="..."
   />
   ```

3. **Add proper width/height props:**
   - Determine appropriate dimensions
   - Add `width` and `height` props
   - Consider using `fill` with container if dimensions vary

4. **Test:**
   - Verify images load correctly
   - Check responsive behavior
   - Verify alt text accessibility

### Fix 3-10: React Hook Dependency Warnings

**Files:**

- `app/webapp/components/navigation/nav-items.tsx` (line 222)
- `app/webapp/menu-builder/components/MenuItemHoverStatistics.tsx` (line 81)
- `app/webapp/menu-builder/components/MenuItemStatisticsModal.tsx` (line 51)
- `app/webapp/par-levels/page.tsx` (line 54)
- `app/webapp/recipes/hooks/useDishCostCalculation.ts` (line 71)
- `app/webapp/recipes/hooks/useRecipeSubscriptions.ts` (lines 78, 81)
- `hooks/useDrawerSwipe.ts` (line 170)

**Effort:** 20-30 minutes per file

**General Fix Pattern:**

1. **Review hook logic:**
   - Understand what the hook is trying to do
   - Determine if missing dependencies are intentional or bugs

2. **Add missing dependencies:**

   ```tsx
   // Before:
   useEffect(() => {
     doSomething(value);
   }, []); // Missing 'value'

   // After:
   useEffect(() => {
     doSomething(value);
   }, [value]); // Include all dependencies
   ```

3. **Handle complex expressions:**

   ```tsx
   // Before:
   useEffect(() => {
     // ...
   }, [someObject.property]); // Complex expression

   // After:
   const property = someObject.property;
   useEffect(() => {
     // ...
   }, [property]); // Extract to variable
   ```

4. **Handle ref cleanup:**

   ```tsx
   // Before:
   useEffect(() => {
     const timer = debounceTimerRef.current;
     return () => {
       clearTimeout(debounceTimerRef.current); // May have changed
     };
   }, []);

   // After:
   useEffect(() => {
     const timer = debounceTimerRef.current;
     return () => {
       clearTimeout(timer); // Use captured value
     };
   }, []);
   ```

5. **If dependencies intentionally omitted:**
   - Add ESLint disable comment with explanation
   - Document why dependencies are omitted

**Specific Fixes:**

**nav-items.tsx (line 222):**

- Add `baseItems` to useMemo dependency array
- Or extract baseItems calculation outside useMemo if it doesn't need memoization

**MenuItemHoverStatistics.tsx (line 81):**

- Add `loadStatistics` to useEffect dependency array
- Or wrap `loadStatistics` in useCallback if it's a function

**MenuItemStatisticsModal.tsx (line 51):**

- Same as above

**par-levels/page.tsx (line 54):**

- Add `fetchIngredients` and `fetchParLevels` to useEffect dependency array
- Or wrap functions in useCallback

**useDishCostCalculation.ts (line 71):**

- Extract complex expression to variable
- Add `selectedRecipes` to dependency array
- Review if complex expression is necessary

**useRecipeSubscriptions.ts (lines 78, 81):**

- Fix ref cleanup to use captured value
- Add `recipes` to dependency array
- Review debounce logic

**useDrawerSwipe.ts (line 170):**

- Add `setDragY` to useCallback dependency array
- Or remove from dependencies if intentionally stable

---

## 🟢 LOW: Breakpoint Migration

### Priority: **LOW**

**Effort:** 1-2 hours
**Impact:** Consistency, future maintenance

### Issue: Standard Breakpoints Still in Use

**Found:** 61 instances of `sm:`, `md:`, `lg:` across 13 files

**Files Affected:**

- `app/webapp/components/navigation/NavItem.tsx`
- `docs/SCRIPTS.md`
- `components/ui/animated/AnimatedButton.tsx`
- `AGENTS.md`
- `components/ui/SummaryCardGrid.tsx`
- `components/ui/EditDrawer.tsx`
- `scripts/detect-breakpoints.js`
- `scripts/codemods/breakpoint-migration.js`
- `components/LanguageSwitcher.tsx`
- `components/ui/Button.tsx`
- `components/ui/Icon.tsx`
- `scripts/refactor-responsive-breakpoints.js`
- `lib/tailwind-utils.ts`

**Fix Steps:**

1. **Run breakpoint migration codemod:**

   ```bash
   npm run codemod:breakpoints:write
   ```

2. **Review changes:**
   - Check diff for each file
   - Verify transformations are correct
   - Test responsive behavior

3. **Manual fixes for edge cases:**
   - Some files may need manual review (documentation, scripts)
   - Update comments/docs that reference old breakpoints

4. **Verify:**
   - Run `npm run detect-breakpoints` to confirm migration
   - Test responsive layouts
   - Verify no visual regressions

**Note:** Some files (like `scripts/codemods/breakpoint-migration.js`) may intentionally reference old breakpoints for migration purposes. Review before changing.

---

## 🟢 LOW: Empty State Styling Consistency

### Priority: **LOW**

**Effort:** 30 minutes
**Impact:** Visual consistency

### Issue: Border Radius Inconsistencies

**Files:**

- `app/webapp/cogs/components/COGSTableEmptyState.tsx` (line 8) - Uses `rounded-2xl`
- `app/webapp/dish-builder/components/DishIngredientTable.tsx` (line 36) - Uses `rounded-2xl`

**Decision Needed:**

- Should empty states use `rounded-2xl` (cards) or `rounded-3xl` (containers)?
- Per Material Design 3: `rounded-3xl` for containers, `rounded-2xl` for cards
- Empty states are card-like, so `rounded-2xl` may be correct

**Fix Steps:**

1. **Make decision:**
   - Review Material Design 3 guidelines
   - Check other empty states for consistency
   - Decide on standard

2. **Update if needed:**
   - Change `rounded-2xl` to `rounded-3xl` if containers
   - Or update other empty states to `rounded-2xl` if cards
   - Document decision in AGENTS.md

3. **Verify:**
   - Check all empty states match decision
   - Verify visual consistency

---

## Implementation Order

### Phase 1: Critical Fixes (2-3 hours)

1. ✅ Fix database schema field name inconsistencies
2. ✅ Fix database schema ID type inconsistencies
3. ✅ Test schema changes

### Phase 2: High Priority Fixes (2-3 hours)

1. ✅ Fix RecipeTable.tsx wrapper container
2. ✅ Fix IngredientTable.tsx sticky header
3. ✅ Fix tbody background colors
4. ✅ Test table styling

### Phase 3: Medium Priority Fixes (3-4 hours)

1. ✅ Replace img with Image components
2. ✅ Fix React Hook dependency warnings
3. ✅ Test functionality

### Phase 4: Low Priority Fixes (1-2 hours)

1. ✅ Run breakpoint migration codemod
2. ✅ Review and fix empty state styling
3. ✅ Final verification

---

## Testing Checklist

After each phase, verify:

- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings acceptable if documented)
- [ ] Tables render correctly
- [ ] Responsive behavior works
- [ ] Database operations work
- [ ] No visual regressions
- [ ] All tests pass

---

## Estimated Total Effort

- **Critical Fixes:** 2-3 hours
- **High Priority Fixes:** 2-3 hours
- **Medium Priority Fixes:** 3-4 hours
- **Low Priority Fixes:** 1-2 hours

**Total:** 8-12 hours

---

## Notes

- All fixes should be done in feature branches
- Test thoroughly before merging
- Update documentation as needed
- Consider creating tests for critical fixes
