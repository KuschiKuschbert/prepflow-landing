---
name: prepflow-standards-non-negotiable
description: Treats PrepFlow standards as mandatory. Use when reviewing, implementing, or debugging anything.
---

# PrepFlow Standards Non-Negotiable Protocol

Standards are mandatory. No "we'll fix later" for core rules.

## When to use this skill

- Reviewing code
- Implementing features
- Debugging issues

## Non-Negotiable Rules (LAWS)

From [docs/brain/LAWS.md](docs/brain/LAWS.md):

1. No secrets (use .env.local)
2. No bloat (images > 500KB forbidden)
3. No debt (TODOs > 50 block build)
4. No circular deps
5. No magic numbers (use lib/constants.ts)
6. No spaghetti data (static data > 50 lines in lib/data/ or JSON)
7. No hardcoded URLs (use APP_BASE_URL)
8. Component size (max 300 lines - split if over)
9. Business logic in lib/constants.ts

## Also Mandatory

- Breakpoints: desktop:, tablet: (not sm:, md:, lg:)
- Optimistic updates for all add/edit/delete
- File size limits (pages 500, components 300, API 200, utils 150, hooks 120)
- PrepFlow voice for dialogs and user-facing copy

## Style Guide

- Violations must be fixed or explicitly escalated. No silent exceptions.
