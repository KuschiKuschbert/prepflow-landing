# Comprehensive Fix Plan: Remaining ESLint Warnings

## Overview
- **Total Warnings:** 14
- **Categories:** React Hooks (12), Import/Export (1), Accessibility (1)
- **Priority:** Medium (non-blocking, but best practice compliance)

---

## Phase 1: React Hooks exhaustive-deps Warnings (12 fixes)

### Strategy
Each warning indicates a missing dependency in `useCallback` or `useEffect` hooks. We need to:
1. **Identify** if the missing dependency is safe to add
2. **Wrap functions** in `useCallback` if they're used as dependencies
3. **Use `useRef`** for stable function references if wrapping causes infinite loops
4. **Add `eslint-disable` comments** only as last resort with justification

---

### Fix 1: `useCOGSCalculations.ts` (Line 73)
**Issue:** `useCallback` missing `calculateCOGS` dependency
**Current:** Line 73 has `useCallback` with empty deps `[]`, but uses `calculateCOGS` defined at line 75
**Solution:**
- Move `calculateCOGS` definition BEFORE the `useCallback` that uses it
- OR: Wrap `calculateCOGS` in its own `useCallback` first, then add to dependency array
- **File:** `app/webapp/cogs/hooks/useCOGSCalculations.ts`

---

### Fix 2: `useIngredientAddition.ts` (Line 173)
**Issue:** `useCallback` missing `volumeUnits` and `weightUnits` dependencies
**Current:** `handleAddIngredient` callback uses these constants but they're not in deps
**Solution:**
- If constants are defined outside component: safe to add to deps (they're stable)
- If constants are props: add to dependency array
- **File:** `app/webapp/cogs/hooks/useIngredientAddition.ts`

---

### Fix 3: `compliance/page.tsx` (Line 48)
**Issue:** `useEffect` missing `fetchRecords` dependency
**Current:** `useEffect` calls `fetchRecords()` but it's not in dependency array
**Solution:**
- Wrap `fetchRecords` in `useCallback` with proper dependencies
- Add `fetchRecords` to `useEffect` dependency array
- **File:** `app/webapp/compliance/page.tsx`

---

### Fix 4: `RecentActivity.tsx` (Line 110)
**Issue:** `useEffect` missing `refetch` dependency
**Current:** `useEffect` calls `refetch()` on mount, but `refetch` likely comes from a query hook
**Solution:**
- `refetch` from React Query/tanstack-query is stable - safe to add
- Add `refetch` to dependency array: `}, [refetch]);`
- **File:** `app/webapp/components/RecentActivity.tsx`

---

### Fix 5: `useRecipeManagement.ts` (Line 87)
**Issue:** `useCallback` missing `calculateAllRecipePrices` dependency
**Current:** `refreshRecipePrices` callback uses `calculateAllRecipePrices` but it's not in deps
**Solution:**
- `calculateAllRecipePrices` is already a `useCallback` (line 90)
- Add it to `refreshRecipePrices` dependency array: `}, [recipes, calculateAllRecipePrices]);`
- **File:** `app/webapp/recipes/hooks/useRecipeManagement.ts`

---

### Fix 6: `suppliers/page.tsx` (Line 46)
**Issue:** `useEffect` missing `fetchPriceLists` dependency
**Current:** `useEffect` calls `fetchPriceLists()` but it's not in dependency array
**Solution:**
- Wrap `fetchPriceLists` in `useCallback` with `selectedSupplier` as dependency
- Add `fetchPriceLists` to `useEffect` dependency array
- **File:** `app/webapp/suppliers/page.tsx`

---

### Fix 7: `temperature/page.tsx` (Line 186)
**Issue:** `useEffect` missing `fetchLogs` dependency
**Current:** `useEffect` calls `fetchLogs()` inside `loadData()` but it's not in dependency array
**Solution:**
- Wrap `fetchLogs` in `useCallback` or move it outside `loadData`
- Add `fetchLogs` to dependency array if stable, or refactor structure
- **File:** `app/webapp/temperature/page.tsx`

---

### Fix 8: `AdvancedPerformanceTracker.tsx` (Line 153)
**Issue:** `useEffect` missing `trackInitialPerformance` dependency
**Current:** `useEffect` calls `trackInitialPerformance()` but it's defined as regular function
**Solution:**
- Wrap `trackInitialPerformance` in `useCallback` (likely no dependencies needed)
- Add to `useEffect` dependency array
- **File:** `components/AdvancedPerformanceTracker.tsx`

---

### Fix 9: `ExitIntentTracker.tsx` (Line 143)
**Issue:** `useEffect` missing `showPopup` dependency
**Current:** `useEffect` references `showPopup` but it's not in dependency array
**Analysis:** `showPopup` is a state setter or callback - may need careful handling
**Solution:**
- If `showPopup` is `setShowExitPopup`: state setters are stable, safe to add
- If `showPopup` is a prop callback: wrap in `useCallback` in parent or add to deps
- **File:** `components/ExitIntentTracker.tsx`

---

### Fix 10: `GoogleAnalytics.tsx` (Line 73)
**Issue:** `useEffect` missing `initializeGtag` dependency
**Current:** `useEffect` calls `initializeGtag()` but it's not in dependency array
**Solution:**
- Wrap `initializeGtag` in `useCallback` with `measurementId` as dependency
- Add `initializeGtag` to `useEffect` dependency array
- **File:** `components/GoogleAnalytics.tsx`

---

### Fix 11: `GoogleTagManager.tsx` (Line 43)
**Issue:** `useEffect` missing `pathname` dependency
**Current:** `useEffect` at line 43 doesn't include `pathname`, but line 60 has separate effect with `pathname`
**Analysis:** Line 43 effect is for initialization, line 60 tracks page views
**Solution:**
- If line 43 effect intentionally doesn't need pathname: add eslint-disable comment with justification
- OR: Verify if pathname should trigger re-initialization (likely not)
- **File:** `components/GoogleTagManager.tsx`

---

## Phase 2: Import/Export Warning (1 fix)

### Fix 12: `AnimatedComponents.tsx` (Line 305)
**Issue:** Anonymous default export
**Current:** `export default { ... }` exports anonymous object
**Solution:**
- Create named constant: `const AnimatedComponents = { ... }`
- Export: `export default AnimatedComponents;`
- **File:** `components/ui/AnimatedComponents.tsx`

---

## Phase 3: Accessibility Warning (1 fix)

### Fix 13: `jest.setup.js` (Line 33)
**Issue:** `img` element missing `alt` prop
**Current:** `<img {...props} />` without alt attribute
**Solution:**
- Add `alt=""` for decorative images: `<img {...props} alt="" />`
- OR: Ensure props include alt when passed
- **File:** `jest.setup.js`

---

## Implementation Order

1. **Start with simple fixes** (safe dependencies):
   - Fix 4: RecentActivity.tsx (`refetch` - always stable)
   - Fix 5: useRecipeManagement.ts (`calculateAllRecipePrices` - already wrapped)
   - Fix 13: jest.setup.js (simple alt prop)

2. **Medium complexity** (need wrapping):
   - Fix 2: useIngredientAddition.ts (constants)
   - Fix 12: AnimatedComponents.tsx (export refactor)

3. **Complex fixes** (need careful analysis):
   - Fix 1: useCOGSCalculations.ts (ordering issue)
   - Fix 3, 6, 7: Page components (function wrapping)
   - Fix 8, 9, 10, 11: Component hooks (callback wrapping)

---

## Testing Strategy

After each fix:
1. Run `npm run lint` to verify warning is resolved
2. Check for new warnings introduced
3. Test affected functionality manually if possible
4. Run `npm run type-check` to ensure no TypeScript errors

---

## Success Criteria

✅ All 14 warnings resolved
✅ No new warnings introduced
✅ TypeScript compilation passes
✅ No runtime errors introduced
✅ Build succeeds
