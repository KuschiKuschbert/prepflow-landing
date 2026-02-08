# Systematic Optimistic Updates Fix Plan

## Current Status

- **Total Violations:** 232 (down from 284)
- **Files Fixed:** 31
- **Remaining:** ~201 violations across ~60 files

## Violation Categories

Based on the cleanup script analysis, violations fall into these categories:

### Category 1: Missing Original State Storage (Most Common)

**Pattern:** Mutations that update state but don't store original state for rollback
**Detection:** No `originalItems` or `originalState` variable before mutation
**Fix:** Add `const originalItems = [...currentItems];` before optimistic update

### Category 2: Update Timing (State After API Call)

**Pattern:** `setState` or `setItems` called AFTER `await fetch()` instead of before
**Detection:** State update happens after `response.ok` check
**Fix:** Move state update before API call, add rollback logic

### Category 3: Missing Rollback Logic

**Pattern:** Optimistic update exists but no rollback in catch/error block
**Detection:** Has optimistic update but no `setState(originalState)` in catch
**Fix:** Add rollback in both error response and catch block

### Category 4: Loading States in Mutations

**Pattern:** `setLoading(true/false)` in mutation handlers
**Detection:** `setLoading` in functions with POST/PUT/DELETE operations
**Fix:** Remove loading states, rely on optimistic updates for instant feedback

### Category 5: Refetch After Success

**Pattern:** `fetchData()` or `refetch()` called after successful mutation
**Detection:** `fetchData()` or similar called after `response.ok`
**Fix:** Remove refetch calls, rely on optimistic updates + optional server response replacement

### Category 6: Missing Notifications

**Pattern:** No success/error notifications for user feedback
**Detection:** No `showSuccess` or `showError` calls
**Fix:** Add `useNotification` hook and callbacks

## Systematic Fix Strategy

### Phase 1: Auto-Detection & Categorization Script

Create a script to:

1. Parse cleanup check output to get file list
2. Categorize each violation by type
3. Generate fix suggestions per file
4. Create a prioritized list

### Phase 2: Pattern-Based Batch Fixes

#### Batch 1: Simple Loading State Removals

**Files:** Components with `setLoading(true)` in mutation handlers
**Action:** Remove loading states (10-15 files)
**Time:** 15-20 minutes

#### Batch 2: Add Original State Storage

**Files:** Mutations missing `const originalItems = [...currentItems]`
**Action:** Add original state storage + rollback (30-40 files)
**Time:** 45-60 minutes

#### Batch 3: Fix Update Timing

**Files:** State updates after API calls
**Action:** Move state updates before API calls (20-30 files)
**Time:** 60-90 minutes

#### Batch 4: Remove Refetch Calls

**Files:** Post-mutation refetch calls
**Action:** Remove refetch, use optimistic updates (10-15 files)
**Time:** 20-30 minutes

#### Batch 5: Add Missing Rollback

**Files:** Has optimistic update but missing rollback
**Action:** Add rollback in catch blocks (15-20 files)
**Time:** 30-45 minutes

### Phase 3: Leverage Existing Utilities

Many fixes can use existing utilities:

1. **`createOptimisticUpdate`** - For UPDATE operations
2. **`createOptimisticCreate`** - For CREATE operations
3. **`createOptimisticDelete`** - For DELETE operations
4. **`createOptimisticReorder`** - For reorder operations

**Action:** Refactor mutations to use these utilities where possible (20-30 files)
**Time:** 60-90 minutes

## Implementation Plan

### Step 1: Generate Violation Report

```bash
npm run cleanup:check > violations-report.txt 2>&1
# Parse and categorize violations
```

### Step 2: Create Fix Templates

**Template for UPDATE operations:**

```typescript
// BEFORE:
const response = await fetch(...);
const result = await response.json();
if (result.success) {
  setItems(prev => prev.map(...)); // ❌ After API call
}

// AFTER:
const originalItems = [...items]; // ✅ Store original
setItems(prev => prev.map(...)); // ✅ Before API call
try {
  const response = await fetch(...);
  const result = await response.json();
  if (result.success) {
    setItems(prev => prev.map(...)); // Replace with server response
    showSuccess('Updated');
  } else {
    setItems(originalItems); // ✅ Rollback
    showError(result.error);
  }
} catch (err) {
  setItems(originalItems); // ✅ Rollback
  showError('Failed');
}
```

**Template for CREATE operations:**

```typescript
// BEFORE:
const response = await fetch(...);
const result = await response.json();
if (result.success) {
  setItems(prev => [...prev, result.item]); // ❌ After API call
}

// AFTER:
const originalItems = [...items]; // ✅ Store original
const tempId = `temp-${Date.now()}`;
const tempItem = { ...newItem, id: tempId };
setItems(prev => [...prev, tempItem]); // ✅ Before API call
try {
  const response = await fetch(...);
  const result = await response.json();
  if (result.success && result.item) {
    setItems(prev => prev.map(item => item.id === tempId ? result.item : item));
    showSuccess('Created');
  } else {
    setItems(originalItems); // ✅ Rollback
    showError(result.error);
  }
} catch (err) {
  setItems(originalItems); // ✅ Rollback
  showError('Failed');
}
```

### Step 3: Execute Batch Fixes

1. **Start with Category 4 (Loading States)** - Easiest, immediate impact
2. **Then Category 1 (Original State)** - Foundation for other fixes
3. **Then Category 2 (Update Timing)** - Core optimistic update pattern
4. **Then Category 5 (Refetch)** - Cleanup
5. **Then Category 3 (Rollback)** - Safety net
6. **Finally Category 6 (Notifications)** - Polish

## Automation Opportunities

### Option A: Codemod for Simple Cases

Create a jscodeshift codemod to:

- Remove `setLoading(true/false)` pairs in mutation handlers
- Add `const originalItems = [...items];` before mutations
- Move simple state updates before API calls

### Option B: Helper Function Generator

Create a script that:

- Analyzes mutation functions
- Generates optimistic update wrappers
- Suggests utility function usage

### Option C: Manual Batch Processing

Process files in batches of 5-10:

- Fix similar patterns together
- Test after each batch
- Document patterns found

## Estimated Time

- **Batch 1 (Loading States):** 15-20 minutes → ~15 files
- **Batch 2 (Original State):** 45-60 minutes → ~35 files
- **Batch 3 (Update Timing):** 60-90 minutes → ~25 files
- **Batch 4 (Refetch):** 20-30 minutes → ~10 files
- **Batch 5 (Rollback):** 30-45 minutes → ~15 files
- **Batch 6 (Utilities Refactor):** 60-90 minutes → ~25 files

**Total:** ~4-6 hours to fix all remaining violations systematically

## Priority Order

1. **High Impact, Low Effort:** Loading state removals (Category 4)
2. **High Impact, Medium Effort:** Update timing fixes (Category 2)
3. **Medium Impact, Low Effort:** Original state storage (Category 1)
4. **Medium Impact, Medium Effort:** Rollback logic (Category 3)
5. **Low Impact, Low Effort:** Refetch removal (Category 5)
6. **Low Impact, Medium Effort:** Utility refactoring (Category 6)

## Next Steps

1. Generate detailed violation report with file paths
2. Categorize violations by type
3. Start with Category 4 (loading states) - quick wins
4. Progress through categories systematically
5. Test after each batch
