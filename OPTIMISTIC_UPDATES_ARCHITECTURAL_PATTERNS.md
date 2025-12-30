# Optimistic Updates - Architectural Patterns & Future Work

## Purpose

This document tracks complex components and architectural patterns that need refactoring to fully implement optimistic updates. These require more than simple code changes - they need architectural improvements.

## Status

**Date Created:** Current Session
**Priority:** Medium-Low (after critical patterns are complete)
**Estimated Effort:** Varies by component (see individual sections)

---

## 🏗️ Architectural Patterns Requiring Refactoring

### 1. RecipeEditDrawer - Autosave + Manual Save Integration

**File:** `app/webapp/recipes/components/RecipeEditDrawer.tsx`

**Current Architecture:**

- Uses `useAutosave` hook for recipe metadata (name, yield, instructions)
- Has separate `handleSave` that manually saves metadata + ingredients
- Calls `onRefresh()` after manual save to refetch all recipes
- Uses `setSaving(true/false)` loading state

**Issues:**

- ❌ Calls `onRefresh()` after save (anti-pattern - should use optimistic updates)
- ❌ Uses loading state (`setSaving`) in mutation
- ❌ Doesn't have access to `setRecipes` or `optimisticallyUpdateRecipes` functions
- ⚠️ Complex interaction between autosave and manual save

**Recommended Approach:**

1. Pass `optimisticallyUpdateRecipes` and `rollbackRecipes` functions as props
2. Remove `onRefresh()` call - update recipe optimistically instead
3. Remove `setSaving` loading state
4. Coordinate autosave status with optimistic updates

**Estimated Effort:** 2-3 hours
**Priority:** Medium (affects recipe editing UX)

---

### 2. buildOptimisticUpdates - Rollback Pattern

**File:** `app/webapp/recipes/hooks/utils/buildOptimisticUpdates.ts`

**Current Implementation:**

```typescript
const rollbackRecipes = () => {
  fetchRecipes().catch(err => {
    logger.error('Failed to rollback recipes:', err);
    setError('Failed to refresh recipes after error');
  });
};
```

**Issue:**

- ⚠️ Rollback uses `fetchRecipes()` instead of restoring from stored original state
- This is less efficient and can cause race conditions

**Recommended Approach:**

1. Store original state before optimistic updates
2. Restore directly from stored state instead of refetching
3. Only refetch if we don't have original state (fallback)

**Estimated Effort:** 1-2 hours
**Priority:** Low (works but not optimal)

---

### 3. Dish Builder - Complex Save Flow

**Files:**

- `app/webapp/dish-builder/hooks/utils/dishSave.ts`
- `app/webapp/dish-builder/hooks/helpers/saveDishItem.ts`
- `app/webapp/dish-builder/hooks/helpers/saveRecipe/createRecipe.ts`

**Current Architecture:**

- Can save as dish OR recipe
- Multiple API calls (create recipe → create ingredients → create dish)
- Complex error handling across multiple operations

**Issues:**

- ⚠️ Multi-step save process (recipe → ingredients → dish)
- ⚠️ No optimistic updates (would be complex with multiple API calls)
- ⚠️ Need to handle partial failures (recipe created but ingredients failed)

**Recommended Approach:**

1. Create optimistic update strategy for multi-step operations
2. Use transaction-like pattern (all succeed or all rollback)
3. Store intermediate states for rollback
4. Consider using server-side transaction if possible

**Estimated Effort:** 4-6 hours
**Priority:** Low (complex but not high-impact)

---

### 4. Menu Builder - Item Addition with Optimistic Items

**File:** `app/webapp/menu-builder/components/hooks/helpers/useMenuItemAddition/handleMenuItemAPI.ts`

**Current Implementation:**

- ✅ Already uses optimistic items
- ✅ Replaces optimistic item with server response
- ✅ Rolls back on error

**Status:** ✅ Already correctly implemented!

**No action needed** - this is a good pattern to reference for other components.

---

### 5. Settings/Admin Pages - Lower Priority Mutations

**Files:**

- `app/webapp/settings/components/*`
- `app/webapp/admin/**`
- `app/webapp/staff/**`

**Current Architecture:**

- Various mutations (profile updates, settings changes, staff management)
- Many use loading states
- Some call refresh after mutations

**Issues:**

- ⚠️ Not critical user-facing features (settings/admin)
- ⚠️ Lower frequency of use
- ⚠️ Less impact on perceived performance

**Recommended Approach:**

1. Review each component individually
2. Prioritize high-frequency operations (profile updates)
3. Skip low-frequency admin operations

**Estimated Effort:** 8-12 hours (if all done)
**Priority:** Low (can be done incrementally as needed)

---

### 6. Prep Lists & Par Levels - Form Submissions

**Files:**

- `app/webapp/prep-lists/hooks/usePrepListsForm/formSubmission.ts`
- `app/webapp/par-levels/hooks/useParLevelsForm/formSubmission.ts`

**Current Architecture:**

- Form-based submissions
- Some already use optimistic updates
- May call refetch after successful save

**Recommended Review:**

1. Check if already using optimistic updates
2. Remove any `refetchData()` calls after mutations
3. Ensure rollback on error

**Estimated Effort:** 1-2 hours per component
**Priority:** Low-Medium

---

## 📋 Summary Table

| Component              | Status                  | Priority | Effort    | Notes                               |
| ---------------------- | ----------------------- | -------- | --------- | ----------------------------------- |
| RecipeEditDrawer       | ❌ Needs refactoring    | Medium   | 2-3h      | Autosave + manual save coordination |
| buildOptimisticUpdates | ⚠️ Works but suboptimal | Low      | 1-2h      | Rollback pattern improvement        |
| Dish Builder           | ⚠️ Complex multi-step   | Low      | 4-6h      | Multi-API transaction pattern       |
| Menu Builder           | ✅ Already correct      | -        | -         | Good reference pattern              |
| Settings/Admin         | ⚠️ Low frequency        | Low      | 8-12h     | Incremental improvement             |
| Prep Lists/Par Levels  | ⚠️ Needs review         | Low-Med  | 1-2h each | Form submission patterns            |

---

## 🎯 Recommended Priority Order

1. **RecipeEditDrawer** (Medium priority, affects recipe editing UX)
2. **buildOptimisticUpdates rollback** (Low priority, improve pattern)
3. **Prep Lists/Par Levels** (Low-Med priority, if time permits)
4. **Settings/Admin** (Low priority, incremental)
5. **Dish Builder** (Low priority, complex refactor)

---

## 📝 Implementation Guidelines

When refactoring these components:

1. **Always pass optimistic update functions as props** - Don't rely on callbacks that refetch
2. **Store original state before mutations** - Use this for rollback, not refetch
3. **Remove loading states from mutations** - Mutations should feel instant
4. **Coordinate with autosave** - If component uses autosave, ensure optimistic updates don't conflict
5. **Handle multi-step operations** - For complex saves, use transaction-like pattern with intermediate state storage

---

## ✅ Reference Patterns

**Good examples to follow:**

- `app/webapp/ingredients/hooks/useIngredientDelete.ts` - Simple optimistic delete
- `app/webapp/recipes/hooks/useRecipeActions/helpers/handleAddRecipe.ts` - Optimistic create with temp ID
- `app/webapp/menu-builder/components/hooks/helpers/useMenuItemAddition/handleMenuItemAPI.ts` - Optimistic item addition

**Pattern to avoid:**

- ❌ `onRefresh()` after successful mutation
- ❌ `setLoading(true/false)` in mutation functions
- ❌ `fetchData()` after mutation success
- ❌ Rollback via refetch (should restore from stored state)



