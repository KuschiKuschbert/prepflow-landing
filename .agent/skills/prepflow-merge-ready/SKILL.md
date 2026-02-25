---
name: prepflow-merge-ready
description: Checks if PrepFlow is safe to merge or deploy. Use when the user asks if they can merge, deploy, or ship.
---

# PrepFlow Merge-Ready Protocol

Verify the codebase is safe to merge or deploy before answering.

## When to use this skill

- "Can I merge?"
- "Is it safe to deploy?"
- "Can I ship?"

## Decision Tree

1. **Run pre-deploy**: `npm run pre-deploy`
   - Runs lint, type-check, format:check, build, and related checks

2. **For merge verification**: Use [scripts/safe-merge.sh](scripts/safe-merge.sh) when merging to main

3. **Analyze output**
   - IF all pass -> "Safe to merge/deploy. Pre-deploy passed."
   - IF failures -> Summarize blockers. List what must be fixed.

## Style Guide

- Never say "yes, you can merge" without running pre-deploy
- Be clear about blockers and next steps when checks fail
