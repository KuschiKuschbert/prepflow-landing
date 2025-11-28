# ID Usage Audit Report

**Date:** 2025-11-27
**Files Analyzed:** 928
**Script:** `scripts/audit-ids.js`

## Summary

| Category                   | Count | Severity  | Status                                 |
| -------------------------- | ----- | --------- | -------------------------------------- |
| Index-based keys           | 48    | ⚠️ Low    | Acceptable (fallbacks)                 |
| Missing keys               | 37    | ⚠️ Low    | False positives (data transformations) |
| Inconsistent ID patterns   | 58    | ⚠️ Medium | Expected (DB vs TS naming)             |
| Potential duplicate keys   | 13    | 🔴 High   | **Needs Fix**                          |
| Null/undefined ID handling | 2     | ✅ Good   | Proper error handling                  |

## Critical Issues: Potential Duplicate Keys

### 1. ChefPerformanceInsights.tsx

**Issue:** Uses `item.id` for three different lists (topSellers, bottomSellers, hiddenGems)
**Risk:** If same item appears in multiple lists, duplicate keys
**Fix:** Add prefix: `key={`top-${item.id}`}`, `key={`bottom-${item.id}`}`, `key={`gem-${item.id}`}`

### 2. RecipeCardsView.tsx

**Issue:** Uses `card.id` in multiple sections (main, sauces, marinades, etc.)
**Risk:** If same recipe appears in multiple sections, duplicate keys
**Fix:** Add section prefix: `key={`main-${card.id}`}`, `key={`sauce-${card.id}`}`, etc.

### 3. LoadingSkeleton.tsx

**Issue:** Uses `i` (index) as key
**Status:** ✅ **Acceptable** - Static arrays that don't reorder

### 4. AllergenMatrixTable.tsx

**Issue:** Uses `allergen.code` in multiple places
**Risk:** If same allergen appears multiple times
**Fix:** Add context prefix

### 5. MenuUnlockChangesDialog

**Issue:** Uses `change.id` in multiple lists
**Risk:** If same change appears in multiple lists
**Fix:** Add list prefix

## Recommendations

### ✅ Best Practices

1. **Use Composite Keys** for items that may appear multiple times:

   ```tsx
   // ✅ Good
   key={`${recipeId}-${ingredientId}`}
   key={`${sectionId}-${itemId}`}

   // ❌ Bad
   key={ingredientId}  // Can duplicate if same ingredient in multiple recipes
   ```

2. **Add Context Prefixes** when rendering same entity in different contexts:

   ```tsx
   // ✅ Good
   key={`top-seller-${item.id}`}
   key={`bottom-seller-${item.id}`}

   // ❌ Bad
   key={item.id}  // Same ID in different lists
   ```

3. **Handle Null/Undefined IDs** with fallbacks:

   ```tsx
   // ✅ Good
   key={item.id || `temp-${index}`}
   key={`${recipeId || 'dish'}-${ingredientId || index}`}
   ```

4. **Index as Last Resort** - Only use index when:
   - Array is static (doesn't reorder)
   - Items don't have unique IDs
   - Items are truly temporary

### ⚠️ Acceptable Patterns

1. **Index-based keys with fallback** - OK when used as fallback:

   ```tsx
   key={item.id || `fallback-${index}`}  // ✅ OK
   key={index}  // ⚠️ Only if array is static
   ```

2. **Inconsistent naming** - Expected due to:
   - Database: `snake_case` (`ingredient_id`, `recipe_id`)
   - TypeScript: `camelCase` (`ingredientId`, `recipeId`)
   - Solution: Use consistent mapping in data layer

## Files Requiring Attention

### ✅ Fixed (Duplicate Keys)

- ✅ `app/webapp/components/ChefPerformanceInsights.tsx` - Added prefixes (`top-seller-`, `bottom-seller-`, `hidden-gem-`)
- ✅ `app/webapp/menu-builder/components/MenuLockedView/components/RecipeCardsView.tsx` - Added section prefixes (`main-`, `sauce-`, `marinade-`, `brine-`, `slow-cooked-`, `other-`)
- ✅ `app/webapp/menu-builder/components/MenuUnlockChangesDialog/components/ChangesList.tsx` - Added type prefixes (`dish-change-`, `recipe-change-`, `ingredient-change-`)
- ✅ `app/webapp/recipes/components/DishesListView.tsx` - Added type prefixes (`dish-`, `recipe-`)

### ⚠️ False Positives (Not Actual Issues)

- `app/webapp/menu-builder/components/MenuLockedView/components/AllergenMatrixTable.tsx` - Keys are in different contexts (header vs body rows)
- `app/webapp/performance/components/PerformanceTable.tsx` - Same items in mobile/desktop (never rendered together)
- `app/webapp/sections/page.tsx` - Different scopes (sections vs dishes within sections)

### Medium Priority (Inconsistent Patterns)

- Files mixing `ingredientId` and `ingredient_id` (58 files)
- Consider creating mapping utilities for consistent conversion

## Next Steps

1. ✅ Fix duplicate key issues in critical files
2. ⚠️ Review inconsistent ID patterns (low priority - expected)
3. ✅ Document ID usage patterns in codebase
4. ⚠️ Consider creating ID utility functions for consistent handling

## Running the Audit

```bash
node scripts/audit-ids.js
```

The script will:

- Scan all `.tsx`, `.ts`, `.jsx`, `.js` files in `app/webapp` and `components`
- Report issues with file paths and line numbers
- Provide recommendations for fixes
