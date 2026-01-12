# TypeScript Type Errors

## Overview

Common TypeScript type errors and their fixes based on learned patterns from the codebase.

## Common Patterns

### Type 'X' is not assignable to type 'Y'

**Root Cause:** Type mismatch between expected and actual types.

**Solution:** Add proper type annotations or type assertions.

**Example:**
```typescript
// Before
const value: string = someFunction(); // Error if someFunction returns number

// After
const value: number = someFunction(); // Correct type
// OR
const value: string = someFunction() as string; // Type assertion (use carefully)
```

**Prevention:** Use strict TypeScript types, avoid `any` types without justification.

### Property 'X' does not exist on type 'Y'

**Root Cause:** Accessing a property that doesn't exist on the type.

**Solution:** Add property to type definition or use optional chaining.

**Example:**
```typescript
// Before
interface User {
  name: string;
}
const user: User = { name: 'John' };
console.log(user.email); // Error: Property 'email' does not exist

// After
interface User {
  name: string;
  email?: string; // Optional property
}
// OR
console.log(user.email?.toLowerCase()); // Optional chaining
```

**Prevention:** Define complete type interfaces, use optional properties where appropriate.

### Cannot find name 'X'

**Root Cause:** Variable or function not defined or imported.

**Solution:** Import the missing dependency or define the variable.

**Example:**
```typescript
// Before
const result = someFunction(); // Error: Cannot find name 'someFunction'

// After
import { someFunction } from './utils';
const result = someFunction(); // Correct
```

**Prevention:** Use proper imports, enable TypeScript strict mode.

## Related Errors

- Missing type annotations
- Incorrect type imports
- Type inference failures

## Prevention Rules

1. Always use strict TypeScript types
2. Avoid `any` types without justification
3. Define complete type interfaces
4. Use optional chaining for optional properties
5. Import all dependencies properly
