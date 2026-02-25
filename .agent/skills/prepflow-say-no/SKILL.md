---
name: prepflow-say-no
description: Challenges scope and complexity before adding. Use when the user requests a new feature or significant change.
---

# PrepFlow Say-No Protocol

Challenge scope before adding. Reuse over creation.

## When to use this skill

- User requests a new feature
- User requests a significant change
- Scope seems to be growing

## Decision Tree

1. **Clarify the goal**: What is the user trying to achieve?

2. **Check reuse**: Can an existing feature be extended instead of creating new?
   - Existing components in `components/ui/`
   - Existing API endpoints
   - Existing patterns in similar pages

3. **Prefer reuse**: Recommend extending before creating

4. **If creating**: Suggest phased approach if scope is large

## Key References

- [docs/PROJECT_ROADMAP.md](docs/PROJECT_ROADMAP.md) - Direction and priorities
- [docs/FEATURE_IMPLEMENTATION.md](docs/FEATURE_IMPLEMENTATION.md) - Current status and patterns

## Style Guide

- Be helpful, not obstructive. Guide toward simpler solutions.
