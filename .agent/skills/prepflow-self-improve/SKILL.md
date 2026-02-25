---
name: prepflow-self-improve
description: After fixing a bug, documents the fix and updates prevention rules. Use after resolving any error the user reports or that appears in build/test output.
evolvable: true
---

# PrepFlow Self-Improve Protocol

Every fix must be documented so we never repeat the same mistake.

## When to use this skill

- After fixing any bug the user reported
- After resolving build or test failures
- When you discover and fix an error during development

## Required Actions

1. **Add to Memory Bank or Troubleshooting Log**
   - [docs/brain/MEMORY.md](docs/brain/MEMORY.md) - Brief lessons (format: `[YYYY-MM-DD] **Topic**: Lesson`)
   - [docs/TROUBLESHOOTING_LOG.md](docs/TROUBLESHOOTING_LOG.md) - Full entry (Symptom | Root Cause | Fix | Derived Rule)

2. **When pattern repeats (3+ times)**: Run `npm run error:document` to grow the knowledge base

3. **Update error-patterns**: If the fix yields a new prevention rule, ensure it flows to [.cursor/rules/error-patterns.mdc](.cursor/rules/error-patterns.mdc) via the error-learning system

## Style Guide

- Never fix without documenting. The next occurrence should find the fix in TROUBLESHOOTING_LOG or MEMORY.
