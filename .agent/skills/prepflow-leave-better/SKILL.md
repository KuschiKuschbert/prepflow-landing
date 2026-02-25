---
name: prepflow-leave-better
description: Ensures each change slightly improves the codebase. Use for every edit, refactor, or fix.
---

# PrepFlow Leave-Better Protocol

Every touch should leave the codebase slightly better than before.

## When to use this skill

- Every edit
- Every refactor
- Every fix

## Habits

- **Clean up while changing**: Remove unused imports, fix nearby minor issues in touched files
- **Improve names**: If you touch code with unclear variable/function names, clarify them
- **Document**: Add JSDoc to public functions you modify if missing
- **Extract over inline**: Prefer extracting a small helper over leaving complex inline logic

## Style Guide

- Low-effort improvements in the same file are expected
- Don't scope creep; stay within the changed area
