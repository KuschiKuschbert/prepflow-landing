---
name: prepflow-standards
description: Ensures changes follow PrepFlow standards and design. Use when adding pages, forms, buttons, lists, or changing how the app looks or behaves.
---

# PrepFlow Standards Protocol

Apply PrepFlow standards to all UI and behavior changes.

## When to use this skill

- Adding new pages, forms, buttons, lists
- Changing how the app looks or behaves
- Creating or modifying components

## Standards Checklist

- **Cyber Carrot Design System** (design.mdc): Colors, typography, borders, z-index
- **Breakpoints**: Use `desktop:`, `tablet:`, NOT `sm:`, `md:`, `lg:`
- **Optimistic updates**: MANDATORY for add/edit/delete - instant UI, revert on error
- **File sizes**: Pages 500, Components 300, API 200, Utils 150, Hooks 120 lines max
- **PrepFlow voice** (dialogs.mdc): Friendly, kitchen metaphors, clear consequences

## Key References

- [.cursor/rules/design.mdc](.cursor/rules/design.mdc) - Cyber Carrot design system
- [.cursor/rules/development.mdc](.cursor/rules/development.mdc) - Optimistic updates, file sizes
- [.cursor/rules/dialogs.mdc](.cursor/rules/dialogs.mdc) - PrepFlow voice
- [docs/brain/LAWS.md](docs/brain/LAWS.md) - No secrets, no bloat, no debt, etc.

## Style Guide

- Reference the rules; don't duplicate. Follow the patterns exactly.
