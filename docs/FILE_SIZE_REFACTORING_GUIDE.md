# File Size Refactoring Guide

**Purpose:** This guide documents proven patterns and techniques for refactoring files that exceed size limits, based on the comprehensive refactoring completed in January 2025.

**See Also:**

- `.cursor/rules/development.mdc` (File Refactoring Standards) - Size limits and mandatory refactoring triggers
- `.cursor/rules/cleanup.mdc` (File Size Limits) - Automated enforcement details
- `docs/SCRIPTS.md` - File size checking script documentation

## 📏 Size Limits Reference

**MANDATORY Limits:**

- **Pages:** 500 lines maximum
- **Components:** 300 lines maximum
- **API Routes:** 200 lines maximum
- **Utilities:** 150 lines maximum
- **Hooks:** 120 lines maximum

**Enforcement:**

- Pre-commit hook: `npm run lint:filesize`
- CI/CD pipeline: Automatic checks on PRs
- Manual check: `npm run lint:filesize`

## 🔧 Refactoring Patterns

### Pattern 1: Extract Helper Functions (Utilities & API Routes)

**When to Use:** Large utility files or API routes with multiple helper functions.

**Example:**

```typescript
// Before: lib/ai/groq-client-helpers.ts (244 lines)
export function generateTextWithGroq(...) { /* 150+ lines */ }
export function buildGroqRequest(...) { /* 50 lines */ }
export function parseGroqResponse(...) { /* 30 lines */ }

// After: Split into focused modules
// lib/ai/groq-client-helpers.ts (120 lines) - Main exports
// lib/ai/groq-client-helpers/request-builder.ts (60 lines)
// lib/ai/groq-client-helpers/response-parser.ts (50 lines)
// lib/ai/groq-client-helpers/error-handling.ts (40 lines)
```

**Steps:**

1. Identify logical groupings of functions
2. Create new helper files in a subdirectory (e.g., `helpers/`, `utils/`)
3. Move related functions to new files
4. Update main file to import and re-export
5. Ensure all imports are updated

**Real Examples:**

- `lib/ai/groq-client-helpers.ts` → Split into 3 helper modules
- `lib/ai/recipe-database-helpers.ts` → Extracted format helpers
- `lib/curbos/public-token.ts` → Extracted token generation helpers
- `lib/large-screen-utils.ts` → Extracted utility functions

### Pattern 2: Extract Custom Hooks (React Components)

**When to Use:** Large React components with complex state management or multiple effects.

**Example:**

```typescript
// Before: RecipeScraper.tsx (568 lines)
export function RecipeScraper() {
  const [state1, setState1] = useState(...);
  const [state2, setState2] = useState(...);
  // ... 10+ useState hooks
  useEffect(() => { /* complex logic */ }, []);
  // ... 500+ lines of component logic
}

// After: Extract hooks
// RecipeScraper.tsx (198 lines) - Main component
// hooks/useRecipeScraperState.ts - All state management
// hooks/useRecipeFetching.ts - Data fetching logic
// hooks/useStatusPolling.ts - Polling logic
// hooks/useComprehensiveScrapingHandlers.ts - Event handlers
```

**Steps:**

1. Identify state management groups (related useState hooks)
2. Identify data fetching logic (useEffect with API calls)
3. Identify event handlers (useCallback functions)
4. Create focused hooks for each group
5. Update component to use extracted hooks

**Real Examples:**

- `RecipeScraper.tsx` (568 → 198 lines) - Extracted 7 custom hooks
- `ProcessingStatus.tsx` (420 → 132 lines) - Extracted 4 sub-components
- `RecipeListSection.tsx` (492 → 162 lines) - Extracted utilities and components

### Pattern 3: Extract Sub-Components (Large Components)

**When to Use:** Components with distinct UI sections that can be separated.

**Example:**

```typescript
// Before: ProcessingStatus.tsx (420 lines)
export function ProcessingStatus() {
  return (
    <div>
      {/* Status Card - 100 lines */}
      {/* Stats Grid - 80 lines */}
      {/* Diagnostics Panel - 120 lines */}
      {/* Quota Warning - 60 lines */}
    </div>
  );
}

// After: Extract sub-components
// ProcessingStatus.tsx (132 lines) - Main orchestrator
// components/StatusCard.tsx - Status display
// components/StatsGrid.tsx - Statistics grid
// components/DiagnosticsPanel.tsx - Diagnostics
// components/QuotaWarning.tsx - Quota warnings
// utils.ts - Format helpers
```

**Steps:**

1. Identify distinct UI sections (cards, grids, panels)
2. Extract each section to a separate component file
3. Extract shared utilities (formatters, validators) to `utils.ts`
4. Update main component to compose sub-components
5. Ensure props are properly typed and passed

**Real Examples:**

- `ProcessingStatus.tsx` - Extracted 4 sub-components + utils
- `RecipeListSection.tsx` - Extracted RecipeCard, SearchFilters, utils

### Pattern 4: Extract API Route Helpers

**When to Use:** API routes with complex business logic or multiple operations.

**Example:**

```typescript
// Before: app/api/prep-lists/route.ts (202 lines)
export async function POST(request: NextRequest) {
  // Authentication - 20 lines
  // Validation - 30 lines
  // Business logic - 100 lines
  // Error handling - 20 lines
}

// After: Extract helpers
// route.ts (150 lines) - Main route handlers
// helpers/createPrepList.ts - Creation logic
// helpers/updatePrepList.ts - Update logic
// helpers/fetchPrepLists.ts - Fetching logic
// helpers/auth-helpers.ts - Authentication
```

**Steps:**

1. Identify distinct operations (CRUD, auth, validation)
2. Extract each operation to a helper file
3. Extract shared utilities (schemas, error handlers)
4. Update route handlers to use helpers
5. Ensure proper error handling and type safety

**Real Examples:**

- `app/api/prep-lists/route.ts` - Extracted 8 helper functions
- `app/api/square/sync/route.ts` - Extracted sync operation handler
- `app/api/recipe-scraper/scrape/route.ts` - Extracted scrape helpers

### Pattern 5: Consolidate Code (Minor Overages)

**When to Use:** Files that are only 1-5 lines over the limit.

**Example:**

```typescript
// Before: Component (302 lines, limit 300)
return (
  <>
    <Component1 />
    <Component2 />
  </>
);

// After: Consolidate return statement
return <>
  <Component1 />
  <Component2 />
</>;
```

**Techniques:**

- Consolidate multi-line return statements to single line
- Remove unnecessary blank lines
- Combine closely related statements
- Simplify arrow functions
- Remove redundant comments

**Real Examples:**

- `DishesListView.tsx` (302 → 300 lines) - Consolidated return
- `IngredientsClient.tsx` (306 → 300 lines) - Consolidated returns
- `nav-items.tsx` (319 → 300 lines) - Removed comments, consolidated code

## 🎯 Refactoring Decision Tree

**Is the file over the limit?**

1. **1-5 lines over?** → Use Pattern 5 (Consolidate Code)
2. **6-50 lines over?** → Use Pattern 1 or 2 (Extract Helpers/Hooks)
3. **50+ lines over?** → Use Pattern 2, 3, or 4 (Extract Hooks/Components/Helpers)

**What type of file?**

- **Utility file?** → Pattern 1 (Extract Helper Functions)
- **React Component?** → Pattern 2 (Extract Hooks) or Pattern 3 (Extract Sub-Components)
- **API Route?** → Pattern 4 (Extract API Route Helpers)
- **Hook?** → Pattern 1 (Extract Helper Functions from hook logic)

## 📋 Refactoring Checklist

Before refactoring:

- [ ] Run `npm run lint:filesize` to identify violations
- [ ] Understand the file's purpose and structure
- [ ] Identify logical separation points
- [ ] Plan the extraction strategy

During refactoring:

- [ ] Create new files with descriptive names
- [ ] Move related code together
- [ ] Update imports in original file
- [ ] Ensure TypeScript types are correct
- [ ] Test that functionality still works

After refactoring:

- [ ] Run `npm run lint:filesize` to verify compliance
- [ ] Run `npm run type-check` to verify types
- [ ] Run `npm run lint` to check for issues
- [ ] Test affected functionality
- [ ] Update documentation if needed

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Breaking TypeScript Types

**Problem:** Extracted functions lose type information or cause type errors.

**Solution:**

- Always import types from original file or create shared type files
- Use explicit return types for extracted functions
- Test with `npm run type-check` after extraction

**Example Fix:**

```typescript
// ✅ GOOD: Explicit types
export function buildGroqRequest(
  prompt: string,
  apiKey: string,
  options: GroqRequestOptions,
): { url: string; init: RequestInit; timeoutId: NodeJS.Timeout } {
  // ...
}
```

### Pitfall 2: React Hook Violations

**Problem:** Using React hooks in non-React functions.

**Solution:**

- Pass hook results as parameters to extracted functions
- Keep hooks in React components or custom hooks only

**Example Fix:**

```typescript
// ❌ BAD: Hook in regular function
export function createStopHandler(...) {
  const { showSuccess } = useNotification(); // Error!
}

// ✅ GOOD: Pass as parameter
export function createStopHandler({ showSuccess, showError }: StopHandlerParams) {
  // Use showSuccess/showError as parameters
}
```

### Pitfall 3: Circular Dependencies

**Problem:** Extracted files create circular import dependencies.

**Solution:**

- Plan extraction to avoid circular dependencies
- Use shared type files for common types
- Re-export from main file when needed

### Pitfall 4: Supabase Query Builder Types

**Problem:** TypeScript errors with Supabase query builders after extraction.

**Solution:**

- Call `.select()` before `.eq()` and `.order()` (Supabase pattern)
- Inline query building instead of using helper functions that return partial queries
- Use explicit type assertions if needed

**Example Fix:**

```typescript
// ❌ BAD: Helper returns partial query
function buildBaseQuery(menuId: string) {
  return supabaseAdmin!.from('menu_items').eq('menu_id', menuId);
}
export function buildFullQuery(menuId: string) {
  return buildBaseQuery(menuId).select(...); // Type error!
}

// ✅ GOOD: Inline query building
export function buildFullQuery(menuId: string) {
  return supabaseAdmin!
    .from('menu_items')
    .select(...)
    .eq('menu_id', menuId)
    .order('category')
    .order('position');
}
```

## 📊 Refactoring Statistics (January 2025)

**Files Refactored:** 25 files (Batches 1-6)
**Total Lines Reduced:** ~2,500+ lines moved to focused modules
**New Files Created:** 60+ helper/hook/component files
**Patterns Used:**

- Pattern 1 (Extract Helpers): 12 files
- Pattern 2 (Extract Hooks): 6 files
- Pattern 3 (Extract Components): 6 files
- Pattern 4 (Extract API Helpers): 8 files
- Pattern 5 (Consolidate): 5 files

**Success Rate:** 100% - All files now comply with size limits

## 🔗 Related Documentation

- **Development Standards:** `.cursor/rules/development.mdc` (File Refactoring Standards)
- **Cleanup Standards:** `.cursor/rules/cleanup.mdc` (File Size Limits)
- **Scripts Reference:** `docs/SCRIPTS.md` (File Size Checking)
- **Component Patterns:** `.cursor/rules/development.mdc` (Component Refactoring Patterns)
- **API Patterns:** `.cursor/rules/implementation.mdc` (API Route Refactoring Patterns)

## 💡 Best Practices

1. **Start Small:** Extract the easiest, most obvious separations first
2. **Test Incrementally:** Test after each extraction to catch issues early
3. **Maintain Cohesion:** Keep related functionality together
4. **Document Extractions:** Add JSDoc comments explaining the separation
5. **Follow Naming:** Use descriptive names for extracted files
6. **Type Safety:** Always maintain TypeScript type safety
7. **Reusability:** Extract code that can be reused elsewhere

## 🎓 Learning from This Refactoring

**Key Insights:**

- Most files can be reduced by 30-60% through strategic extraction
- Hooks are excellent for extracting state management and side effects
- Sub-components improve both size and maintainability
- Helper functions make API routes much more testable
- Minor consolidations can fix small overages without major restructuring

**Future Improvements:**

- Consider extracting hooks earlier in development
- Create helper modules proactively for complex utilities
- Use sub-components for UI sections from the start
- Regular file size checks prevent large refactorings

---

**Last Updated:** January 2025
**Maintained By:** Development Team
**Status:** ✅ Complete - All file size violations resolved
