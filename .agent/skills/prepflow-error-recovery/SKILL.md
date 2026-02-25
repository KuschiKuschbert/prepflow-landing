---
name: prepflow-error-recovery
description: When something breaks or fails, finds and applies known fixes first, then documents any new fix. Use when builds fail, tests fail, or the user reports errors.
evolvable: true
---

# PrepFlow Error Recovery Protocol

When something breaks, find known fixes first. If new, fix then document so we never repeat it.

## When to use this skill

- Build fails
- Tests fail
- User reports an error
- Runtime or pre-commit errors

## Decision Tree

1. **Check known fixes**
   - Read [docs/TROUBLESHOOTING_LOG.md](docs/TROUBLESHOOTING_LOG.md) for similar symptoms
   - Check [docs/errors/](docs/errors/) for documented fixes
   - Check [.cursor/rules/error-patterns.mdc](.cursor/rules/error-patterns.mdc) for learned patterns

2. **If match found** -> Apply the documented fix

3. **If no match (new error)**:
   - Fix the issue
   - Document: Add to TROUBLESHOOTING_LOG (Symptom | Root Cause | Fix | Derived Rule)
   - Or run `npm run error:document` for interactive documentation

## Additional Resources

- [docs/ERROR_LEARNING_SYSTEM.md](docs/ERROR_LEARNING_SYSTEM.md) - Full error learning workflow

## Style Guide

- Always check known fixes before inventing a new solution
- Never fix without documenting if the pattern might recur
