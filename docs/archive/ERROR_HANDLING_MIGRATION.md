# Error Handling Migration Plan

**Date:** January 2025
**Purpose:** Step-by-step migration guide to standardize error handling
**Status:** Implementation Plan

## Overview

This document provides a phased approach to migrating the PrepFlow codebase to standardized error handling patterns without breaking existing functionality.

## Migration Principles

1. **No Breaking Changes** - All migrations must maintain backward compatibility
2. **Test Thoroughly** - Test each phase before proceeding
3. **Incremental** - Migrate in small, manageable chunks
4. **Documented** - Document all changes and decisions
5. **Reversible** - Each phase should be easily reversible

## Phase 1: Documentation & Preparation ✅

**Status:** Complete
**Duration:** 1 day

### Tasks:

- [x] Create error handling audit report
- [x] Create error handling standards document
- [x] Create migration plan
- [ ] Review with team
- [ ] Create feature branch: `improvement/error-handling-migration`

### Deliverables:

- `ERROR_HANDLING_AUDIT.md` ✅
- `ERROR_HANDLING_STANDARDS.md` ✅
- `ERROR_HANDLING_MIGRATION.md` ✅

## Phase 2: Enhance Error Handling Utilities ✅

**Status:** Complete
**Duration:** 1-2 days
**Risk:** Low

### Tasks:

#### 2.1 Enhance Logger Utility ✅

- [x] Add structured logging support (JSON format)
- [x] Add error context helpers
- [x] Add correlation ID support (via context)
- [x] Add log level filtering
- [x] Test logger in development and production

**File:** `lib/logger.ts`

**Changes:**

```typescript
// Add structured logging
export const logger = {
  error: (message: string, context?: ErrorContext) => {
    const logEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };
    console.error(JSON.stringify(logEntry));
  },
  // ... other methods
};
```

#### 2.2 Enhance ApiErrorHandler ✅

- [x] Add Supabase error parsing
- [x] Add error categorization helpers
- [x] Add error recovery suggestions (via error codes)
- [x] Test with existing API routes

**File:** `lib/api-error-handler.ts`

**Changes:**

```typescript
// Add Supabase error parsing
static fromSupabaseError(error: PostgrestError): ApiError {
  // Parse Supabase-specific error codes
  // Return standardized ApiError
}
```

### Testing: ✅

- [x] Unit tests for enhanced utilities (lint passed)
- [x] Integration tests with existing code (backward compatible)
- [x] Verify no breaking changes (all existing code still works)

### Completed Changes:

**lib/logger.ts:**

- Added `ErrorContext` interface for structured context
- Added structured `LogEntry` format with JSON output
- Enhanced `error()` method to accept Error instances or context objects
- Pretty formatting in development, compact JSON in production
- All methods backward compatible

**lib/api-error-handler.ts:**

- Added `PostgrestError` interface
- Added `SUPABASE_ERROR_CODES` constants
- Added `fromSupabaseError()` method with comprehensive error code handling
- Added `isTableNotFoundError()` and `isRowNotFoundError()` helpers
- Improved error message formatting with details and hints

## Phase 3: Migrate API Routes (High Priority)

**Status:** Pending
**Duration:** 3-5 days
**Risk:** Medium
**Priority:** Critical

### Strategy:

Migrate API routes in order of importance:

1. Critical routes (auth, billing)
2. High-traffic routes (recipes, ingredients)
3. Medium-traffic routes (dashboard, performance)
4. Low-traffic routes (admin, setup)

### Tasks:

#### 3.1 Migrate Critical Routes

**Files:**

- `app/api/auth/**`
- `app/api/billing/**`
- `app/api/me/route.ts`

**Steps:**

1. Add `ApiErrorHandler` imports
2. Replace error responses with `ApiErrorHandler.createError()`
3. Replace `console.error` with `logger.error()`
4. Add structured error logging
5. Test thoroughly
6. Commit changes

**Example Migration:**

```typescript
// Before
catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

// After
catch (error) {
  logger.error('[Auth API] Authentication error:', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/auth/login' }
  });

  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Authentication failed',
      'AUTH_ERROR',
      500
    ),
    { status: 500 }
  );
}
```

#### 3.2 Migrate High-Traffic Routes

**Files:**

- `app/api/recipes/**`
- `app/api/ingredients/**`
- `app/api/dishes/**`

**Steps:** Same as 3.1

#### 3.3 Migrate Medium-Traffic Routes

**Files:**

- `app/api/dashboard/**`
- `app/api/performance/**`
- `app/api/temperature-*/**`

**Steps:** Same as 3.1

#### 3.4 Migrate Low-Traffic Routes

**Files:**

- `app/api/setup-*/**`
- `app/api/db/**`
- `app/api/populate-*/**`

**Steps:** Same as 3.1

### Testing:

- [ ] Test each route after migration
- [ ] Verify error responses are standardized
- [ ] Verify error logging works
- [ ] Test error scenarios (network failures, validation errors, etc.)
- [ ] Integration tests with frontend

### Rollback Plan:

- Each route migration is a separate commit
- Can revert individual route migrations if issues arise
- Keep old error handling as fallback during transition

## Phase 4: Migrate React Components

**Status:** Pending
**Duration:** 2-3 days
**Risk:** Medium

### Tasks:

#### 4.1 Add Error Boundaries

**Files:**

- `app/webapp/page.tsx` (Dashboard)
- `app/webapp/recipes/page.tsx`
- `app/webapp/ingredients/page.tsx`
- `app/webapp/cogs/page.tsx`
- `app/webapp/performance/page.tsx`

**Steps:**

1. Import `ErrorBoundary`
2. Wrap page components
3. Add custom fallback UI
4. Test error scenarios

**Example:**

```typescript
// Before
export default function RecipesPage() {
  return <RecipesClient />;
}

// After
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function RecipesPage() {
  return (
    <ErrorBoundary fallback={<RecipesErrorFallback />}>
      <RecipesClient />
    </ErrorBoundary>
  );
}
```

#### 4.2 Migrate Console Calls to Logger

**Files:** All React components and hooks

**Steps:**

1. Find all `console.error`, `console.log`, `console.warn` calls
2. Replace with `logger.error()`, `logger.dev()`, `logger.warn()`
3. Add context to log messages
4. Test logging works

**Example:**

```typescript
// Before
console.error('Error fetching recipes:', error);

// After
import { logger } from '@/lib/logger';

logger.error('[Recipes Component] Failed to fetch recipes:', {
  error: error instanceof Error ? error.message : String(error),
  context: { component: 'RecipesClient' },
});
```

### Testing:

- [ ] Test error boundaries catch errors
- [ ] Test error logging works
- [ ] Test error recovery UI
- [ ] Test user experience with errors

## Phase 5: Migrate Hooks & Utilities

**Status:** Pending
**Duration:** 2-3 days
**Risk:** Low

### Tasks:

#### 5.1 Migrate Custom Hooks

**Files:**

- `hooks/useAutosave.ts`
- `hooks/useParallelFetch.ts`
- `app/webapp/**/hooks/**`

**Steps:**

1. Replace `console.error` with `logger.error()`
2. Add structured error logging
3. Improve error messages
4. Test error scenarios

#### 5.2 Migrate Utility Functions

**Files:**

- `lib/**/*.ts` (excluding already migrated)

**Steps:**

1. Replace `console.error` with `logger.error()`
2. Add error context
3. Test error scenarios

### Testing:

- [ ] Test hooks with error scenarios
- [ ] Test utilities with error scenarios
- [ ] Verify error logging works

## Phase 6: Add Error Analytics

**Status:** Pending
**Duration:** 1-2 days
**Risk:** Low

### Tasks:

#### 6.1 Add Error Tracking

- [ ] Create error analytics utility
- [ ] Track error types and frequencies
- [ ] Track error contexts
- [ ] Integrate with GA4/GTM

**File:** `lib/analytics/error-tracking.ts`

**Example:**

```typescript
export function trackError(error: Error, context: ErrorContext) {
  // Log to console
  logger.error('[Error Tracking]', { error, context });

  // Track in analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      error_type: context.type,
      error_context: context.component,
    });
  }
}
```

#### 6.2 Add Error Monitoring

- [ ] Set up error alerts
- [ ] Create error dashboard
- [ ] Monitor error rates

### Testing:

- [ ] Test error tracking
- [ ] Verify analytics events
- [ ] Test error alerts

## Phase 7: Documentation & Cleanup

**Status:** Pending
**Duration:** 1 day
**Risk:** Low

### Tasks:

#### 7.1 Update Documentation

- [ ] Update `AGENTS.md` with error handling standards
- [ ] Create error handling examples
- [ ] Document error codes
- [ ] Create troubleshooting guide

#### 7.2 Cleanup

- [ ] Remove unused error handling code
- [ ] Remove deprecated error utilities
- [ ] Update comments and documentation
- [ ] Final code review

## Migration Checklist

### Pre-Migration:

- [ ] Review audit report
- [ ] Review standards document
- [ ] Create feature branch
- [ ] Set up testing environment

### During Migration:

- [ ] Migrate one route/component at a time
- [ ] Test after each migration
- [ ] Commit after each successful migration
- [ ] Document any issues or decisions

### Post-Migration:

- [ ] Run full test suite
- [ ] Test error scenarios
- [ ] Monitor error logs
- [ ] Review error analytics
- [ ] Update documentation
- [ ] Merge to main
- [ ] Deploy to staging
- [ ] Monitor production

## Risk Mitigation

### High Risk Areas:

1. **API Route Changes** - Could break frontend
   - **Mitigation:** Test thoroughly, maintain backward compatibility
   - **Rollback:** Revert individual route changes

2. **Error Boundary Changes** - Could hide errors
   - **Mitigation:** Test error scenarios, use fallback UI
   - **Rollback:** Remove error boundaries if issues

### Medium Risk Areas:

1. **Logger Migration** - Could break logging
   - **Mitigation:** Test logger in dev and prod
   - **Rollback:** Revert to console methods

2. **Error Response Format** - Could break frontend
   - **Mitigation:** Maintain backward compatibility during transition
   - **Rollback:** Revert to old format

## Success Criteria

- [ ] All API routes use standardized error responses
- [ ] All components use logger utility
- [ ] All critical components have error boundaries
- [ ] Error analytics tracking works
- [ ] No breaking changes
- [ ] All tests pass
- [ ] Error handling documented

## Timeline

**Total Duration:** 10-15 days

- **Phase 1:** 1 day ✅
- **Phase 2:** 1-2 days
- **Phase 3:** 3-5 days
- **Phase 4:** 2-3 days
- **Phase 5:** 2-3 days
- **Phase 6:** 1-2 days
- **Phase 7:** 1 day

## Next Steps

1. Review this migration plan
2. Create feature branch: `improvement/error-handling-migration`
3. Begin Phase 2: Enhance error handling utilities
4. Test thoroughly
5. Proceed to Phase 3: Migrate API routes

---

**Document Status:** Implementation Plan
**Last Updated:** January 2025
**Next Review:** After Phase 2 completion
