# Missing Error Handling

## Overview

Common patterns of missing error handling and how to fix them based on learned patterns from the codebase.

## Common Patterns

### Missing try-catch in async functions

**Root Cause:** Async operations can throw errors, but they're not caught.

**Solution:** Wrap async operations in try-catch blocks.

**Example:**

```typescript
// Before
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}

// After
async function fetchData() {
  try {
    const data = await fetch('/api/data');
    return data.json();
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    throw error;
  }
}
```

**Prevention:** Always wrap async operations in try-catch blocks, use logger for error logging.

### Missing error handling in API routes

**Root Cause:** API routes don't handle errors properly, returning generic 500 errors.

**Solution:** Use ApiErrorHandler for consistent error responses.

**Example:**

```typescript
// Before
export async function GET(request: NextRequest) {
  const data = await fetchData();
  return NextResponse.json({ data });
}

// After
import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    return ApiErrorHandler.createError('FETCH_DATA_ERROR', 'Failed to fetch data', 500);
  }
}
```

**Prevention:** Always use ApiErrorHandler for API route error responses, log errors with logger.

### Silent error handling

**Root Cause:** Errors are caught but not logged or handled, making debugging difficult.

**Solution:** Log errors and either re-throw or return appropriate error responses.

**Example:**

```typescript
// Before
try {
  await someOperation();
} catch (error) {
  // Silent - no logging or handling
}

// After
try {
  await someOperation();
} catch (error) {
  logger.error('Operation failed', { error, operation: 'someOperation' });
  throw error; // Re-throw for caller to handle
  // OR return appropriate error response
}
```

**Prevention:** Always log errors in catch blocks, never silently ignore errors.

## Related Errors

- Missing try-catch blocks
- Missing error logging
- Missing ApiErrorHandler usage
- Silent error handling

## Prevention Rules

1. Always wrap async operations in try-catch blocks
2. Use ApiErrorHandler for API route error responses
3. Log all errors with logger (not console.error)
4. Never silently ignore errors
5. Re-throw or return appropriate error responses
