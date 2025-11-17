# Error Handling Standards

**Date:** January 2025
**Purpose:** Define standardized error handling patterns for PrepFlow codebase
**Status:** Active Standards

## Table of Contents

1. [Error Handling Decision Tree](#error-handling-decision-tree)
2. [Console Logging Standards](#console-logging-standards)
3. [API Error Response Standards](#api-error-response-standards)
4. [React Component Error Handling](#react-component-error-handling)
5. [Error Message Format Guidelines](#error-message-format-guidelines)
6. [Code Examples](#code-examples)

## Error Handling Decision Tree

### When to Use Each Pattern

```
Is this an API route?
├─ YES → Use ApiErrorHandler + logger.error()
│   ├─ Database error? → Parse Supabase error, use ApiErrorHandler
│   ├─ Validation error? → Return 400 with user-friendly message
│   ├─ Server error? → Return 500, log full error, hide details from user
│   └─ Network error? → Return 503, log error, suggest retry
│
└─ NO → Is this a React component?
    ├─ YES → Use ErrorBoundary + logger.error()
    │   ├─ Component error? → Wrap in ErrorBoundary
    │   ├─ Hook error? → Use try-catch, set error state
    │   └─ Async operation? → Use try-catch, show user-friendly message
    │
    └─ NO → Is this a utility function?
        ├─ YES → Use logger.error() + throw Error
        └─ NO → Use logger.error() + return error object
```

## Console Logging Standards

### Log Levels

**Always use `logger` utility from `@/lib/logger`:**

```typescript
import { logger } from '@/lib/logger';
```

#### `logger.error()` - Always Log (Production-Safe)

**When to use:**

- Actual errors that need investigation
- Exceptions caught in try-catch blocks
- API failures
- Database errors

**Format:**

```typescript
logger.error('[Context] Error message:', {
  error: error.message,
  stack: error.stack,
  context: { userId, entityId, endpoint },
  timestamp: new Date().toISOString(),
});
```

**Example:**

```typescript
try {
  const result = await fetch('/api/recipes');
} catch (error) {
  logger.error('[Recipes API] Failed to fetch recipes:', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/recipes', userId },
    timestamp: new Date().toISOString(),
  });
}
```

#### `logger.warn()` - Always Log (Production-Safe)

**When to use:**

- Non-critical warnings
- Deprecated feature usage
- Performance warnings
- Missing optional data

**Format:**

```typescript
logger.warn('[Context] Warning message:', {
  warning: 'Description',
  context: { userId, entityId },
  timestamp: new Date().toISOString(),
});
```

**Example:**

```typescript
if (!recipe.instructions) {
  logger.warn('[Recipe] Missing instructions:', {
    warning: 'Recipe has no instructions',
    context: { recipeId: recipe.id },
    timestamp: new Date().toISOString(),
  });
}
```

#### `logger.info()` - Dev Only

**When to use:**

- General information
- Operation start/end
- Non-critical status updates

**Format:**

```typescript
logger.info('[Context] Info message:', {
  info: 'Description',
  context: { userId, entityId },
  timestamp: new Date().toISOString(),
});
```

#### `logger.debug()` - Dev Only

**When to use:**

- Detailed debugging information
- Variable values
- Function parameters

**Format:**

```typescript
logger.debug('[Context] Debug message:', {
  debug: 'Description',
  data: { variable1, variable2 },
  context: { userId, entityId },
  timestamp: new Date().toISOString(),
});
```

#### `logger.dev()` - Dev Only

**When to use:**

- Temporary debugging
- Development-only logs
- Quick debugging statements

**Format:**

```typescript
logger.dev('[Context] Dev message:', data);
```

### ❌ DO NOT Use Direct Console Methods

**Never use:**

- `console.error()` → Use `logger.error()`
- `console.log()` → Use `logger.dev()` or `logger.info()`
- `console.warn()` → Use `logger.warn()`
- `console.info()` → Use `logger.info()`
- `console.debug()` → Use `logger.debug()`

**Why:** Direct console methods appear in production, pollute logs, and don't respect environment settings.

## API Error Response Standards

### Standard Error Response Format

**Always use `ApiErrorHandler` from `@/lib/api-error-handler`:**

```typescript
import { ApiErrorHandler } from '@/lib/api-error-handler';
```

### Standard Response Structure

```typescript
{
  success: false,
  error: 'Error type',
  message: 'User-friendly error message',
  code?: 'ERROR_CODE',
  details?: any,
  timestamp: '2025-01-01T00:00:00.000Z'
}
```

### Error Response Examples

#### 400 - Validation Error

```typescript
return NextResponse.json(
  ApiErrorHandler.createError('Invalid input provided', 'VALIDATION_ERROR', 400, {
    field: 'name',
    reason: 'Name is required',
  }),
  { status: 400 },
);
```

#### 401 - Unauthorized

```typescript
return NextResponse.json(
  ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
  { status: 401 },
);
```

#### 403 - Forbidden

```typescript
return NextResponse.json(ApiErrorHandler.createError('Access denied', 'FORBIDDEN', 403), {
  status: 403,
});
```

#### 404 - Not Found

```typescript
return NextResponse.json(
  ApiErrorHandler.createError('Resource not found', 'NOT_FOUND', 404, {
    resource: 'recipe',
    id: recipeId,
  }),
  { status: 404 },
);
```

#### 500 - Server Error

```typescript
logger.error('[API] Server error:', {
  error: error.message,
  stack: error.stack,
  context: { endpoint: '/api/recipes', userId },
});

return NextResponse.json(
  ApiErrorHandler.createError(
    process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    'SERVER_ERROR',
    500,
    process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined,
  ),
  { status: 500 },
);
```

#### 503 - Service Unavailable

```typescript
return NextResponse.json(
  ApiErrorHandler.createError('Service temporarily unavailable', 'SERVICE_UNAVAILABLE', 503),
  { status: 503 },
);
```

### Supabase Error Handling

```typescript
const { data, error } = await supabaseAdmin.from('recipes').select('*');

if (error) {
  logger.error('[Database] Supabase error:', {
    error: error.message,
    code: (error as any).code,
    hint: (error as any).hint,
    details: (error as any).details,
    context: { table: 'recipes', operation: 'select' },
  });

  // Parse Supabase error
  const errorCode = (error as any).code;
  const isTableNotFound = errorCode === '42P01' || error.message.includes('does not exist');

  if (isTableNotFound) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Database table not found',
        'TABLE_NOT_FOUND',
        500,
        process.env.NODE_ENV === 'development' ? { hint: error.message } : undefined,
      ),
      { status: 500 },
    );
  }

  return NextResponse.json(
    ApiErrorHandler.createError(
      'Database error occurred',
      'DATABASE_ERROR',
      500,
      process.env.NODE_ENV === 'development' ? { details: error.message } : undefined,
    ),
    { status: 500 },
  );
}
```

## React Component Error Handling

### Error Boundaries

**Always wrap critical components in ErrorBoundary:**

```typescript
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <CriticalComponent />
</ErrorBoundary>
```

### Hook Error Handling

```typescript
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/recipes');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch recipes');
    }
    const data = await response.json();
    setRecipes(data.recipes);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    logger.error('[Recipes Hook] Failed to fetch:', {
      error: errorMessage,
      context: { hook: 'useRecipes' },
    });
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
```

### Component Error Display

```typescript
if (error) {
  return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  );
}
```

## Error Message Format Guidelines

### User-Friendly Messages

**✅ Good:**

- "Failed to save recipe. Please try again."
- "Recipe not found. It may have been deleted."
- "Network connection failed. Please check your internet."

**❌ Bad:**

- "Error: 500 Internal Server Error"
- "TypeError: Cannot read property 'name' of undefined"
- "PostgrestError: relation 'recipes' does not exist"

### Error Message Structure

```
[Context] [Action] [Reason] [Suggestion]
```

**Example:**

- Context: "Recipe"
- Action: "Failed to save"
- Reason: "Network connection lost"
- Suggestion: "Please check your internet and try again"

**Result:** "Recipe failed to save: Network connection lost. Please check your internet and try again."

## Code Examples

### Complete API Route Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (error) {
      logger.error('[Recipes API] Database error:', {
        error: error.message,
        code: (error as any).code,
        context: { recipeId, operation: 'GET' },
      });

      if ((error as any).code === 'PGRST116') {
        return NextResponse.json(
          ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404, { recipeId }),
          { status: 404 },
        );
      }

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipe', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    logger.error('[Recipes API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
        process.env.NODE_ENV === 'development'
          ? { stack: error instanceof Error ? error.stack : undefined }
          : undefined,
      ),
      { status: 500 },
    );
  }
}
```

### Complete React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';

      logger.error('[useRecipes] Failed to fetch recipes:', {
        error: errorMessage,
        context: { hook: 'useRecipes' },
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, error, isLoading, refetch: fetchRecipes };
}
```

### Complete Component Example

```typescript
'use client';

import { useState } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { logger } from '@/lib/logger';
import { useRecipes } from './hooks/useRecipes';

function RecipesList() {
  const { recipes, error, isLoading, refetch } = useRecipes();

  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.id}>{recipe.name}</div>
      ))}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <RecipesList />
    </ErrorBoundary>
  );
}
```

## Summary Checklist

### For API Routes:

- [ ] Use `ApiErrorHandler` for all error responses
- [ ] Use `logger.error()` for all error logging
- [ ] Include try-catch blocks
- [ ] Return standardized error format
- [ ] Hide sensitive details in production
- [ ] Log full error details for debugging

### For React Components:

- [ ] Wrap critical components in `ErrorBoundary`
- [ ] Use `logger.error()` for error logging
- [ ] Show user-friendly error messages
- [ ] Provide error recovery options (retry, refresh)
- [ ] Handle loading and error states

### For Hooks:

- [ ] Use try-catch for async operations
- [ ] Use `logger.error()` for error logging
- [ ] Return error state to components
- [ ] Provide retry mechanisms

### For Utilities:

- [ ] Use `logger.error()` for error logging
- [ ] Throw errors or return error objects
- [ ] Include context in error messages

---

**Document Status:** Active Standards
**Last Updated:** January 2025
**Next Review:** After Phase 1 migration

