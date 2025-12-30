# Optimistic Updates Review & Fix Plan

## Status: In Progress

**Date:** Current Session
**Total Violations:** 284
**Review Status:** Pattern analysis complete - ready to fix

## ✅ Good Patterns Found

### Ingredients (Correctly Implemented)

- `useIngredientDelete.ts` - ✅ Stores original state, optimistically updates, reverts on error
- `handleBulkUpdate.ts` - ✅ Stores original state, optimistically updates, reverts on error

### Recipes Delete/Bulk (Correctly Implemented)

- `useRecipeDeleteOperations.ts` - ✅ Uses `optimisticallyUpdateRecipes` and `rollbackRecipes`
- `useRecipeBulkOperations.ts` - ✅ Uses optimistic updates with rollback

### Dishes Delete (Correctly Implemented)

- `useDishesClientDelete.ts` - ✅ Stores original state, optimistically updates, reverts on error

### Menu Items (Correctly Implemented)

- Menu item addition uses optimistic items and replaces with server response

## ❌ Issues Found (Need to Fix)

### 1. Recipe Create Operations (Missing Optimistic Updates)

**File:** `app/webapp/recipes/hooks/useRecipeActions/helpers/handleAddRecipe.ts`

- **Issue:** Calls `fetchRecipes()` after create (line 18) - anti-pattern
- **Fix:** Implement optimistic update - add recipe to list immediately, revert on error

**File:** `app/webapp/recipes/hooks/useRecipeActions/helpers/handleDuplicateRecipe.ts`

- **Issue:** Calls `fetchRecipes()` after create (line 50) - anti-pattern
- **Fix:** Implement optimistic update - add duplicated recipe to list immediately, revert on error

### 2. Loading States in Mutations (Anti-Pattern)

**File:** `app/webapp/recipes/components/DishEditDrawer.tsx`

- **Issue:** Uses `setLoading(true)` and `setLoading(false)` in `handleSave` (lines 155, 189, 198)
- **Fix:** Remove loading states - mutations should feel instant

**File:** `app/webapp/cogs/hooks/useRecipeSaving/saveLogic.ts`

- **Issue:** Uses `setLoading(true)` and `setLoading(false)` in `saveRecipeWithIngredients` (lines 52, 94)
- **Fix:** Remove loading states - use optimistic updates instead

### 3. Rollback Pattern (Minor Issue)

**File:** `app/webapp/recipes/hooks/utils/buildOptimisticUpdates.ts`

- **Issue:** `rollbackRecipes()` calls `fetchRecipes()` instead of restoring original state (line 22)
- **Note:** This is acceptable for recipes due to complexity, but not ideal pattern
- **Fix:** Consider storing original state in closure for true rollback (optional improvement)

## Fix Priority

1. **HIGH:** Remove `fetchRecipes()` calls after CREATE operations (handleAddRecipe, handleDuplicateRecipe)
2. **HIGH:** Remove loading states from mutations (DishEditDrawer, saveRecipeWithIngredients)
3. **MEDIUM:** Improve rollback pattern in buildOptimisticUpdates (optional - current pattern works)

## Implementation Plan

### Phase 1: Fix Recipe Create Operations

1. Refactor `handleAddRecipe` to use optimistic updates
2. Refactor `handleDuplicateRecipe` to use optimistic updates

### Phase 2: Remove Loading States

1. Remove loading states from `DishEditDrawer.handleSave`
2. Remove loading states from `saveRecipeWithIngredients`

### Phase 3: Verify Other Operations

1. Review other CRUD operations for missing optimistic updates
2. Verify no fetchData() calls after mutations
3. Verify no loading states in mutations



