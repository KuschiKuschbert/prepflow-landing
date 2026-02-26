# RSI (RECURSIVE SELF-IMPROVEMENT) SKILL

## PURPOSE

Load when working on the RSI system: auto-refactoring, validation suites, fix storage, rule generation, or when `npm run rsi:status` / `npm run rsi:fix` is being used.

## HOW IT WORKS IN THIS CODEBASE

**RSI = Autonomous code repair and improvement system**

```
lib/rsi/
├── auto-fix/
│   ├── providers/        → Fix providers by category (imports, types, patterns)
│   └── index.ts          → Entry point for auto-fix
├── auto-refactoring/
│   └── validation-suite.ts → Validates code patterns
└── rule-enforcement/     → Enforces project rules
```

**RSI commands:**

```bash
npm run rsi:status   # Show current RSI rule violations
npm run rsi:fix      # Auto-fix known patterns
npm run rsi:check    # Check without fixing
```

**Fix storage:**
`lib/error-learning/fix-storage.ts` — stores documented fixes for known error patterns.

**Rule generator:**
`lib/error-learning/rule-generator.ts` — generates rule files from learned fixes.

**Auto-fix providers:**
`lib/rsi/auto-fix/providers/index.ts` — each provider handles a category of fixes (e.g., missing imports, console.log → logger, breakpoint migration).

## STEP-BY-STEP: Add a new auto-fix rule

1. Create a fix provider in `lib/rsi/auto-fix/providers/my-fix.ts`
2. Register in `lib/rsi/auto-fix/providers/index.ts`
3. Add test in `lib/rsi/auto-fix/providers/__tests__/my-fix.test.ts`
4. Document in `docs/TROUBLESHOOTING_LOG.md`
5. Run `npm run rsi:fix` to verify the new provider works

## GOTCHAS

- **RSI providers contain many `console.log` calls** — some are intentional debug output for the autonomous system, not production code violations. Don't blindly migrate these to `logger`.
- **RSI validation suite** may be slow on large codebases — runs file-by-file
- **Fix storage** uses JSON in `docs/errors/fixes/` — don't manually edit these files
- **RSI is a dev-time tool** — it only runs in development, never in production

## REFERENCE FILES

- `lib/rsi/auto-fix/providers/index.ts` — all fix providers
- `lib/error-learning/fix-storage.ts` — fix storage
- `lib/error-learning/rule-generator.ts` — rule generation
- `lib/rsi/auto-refactoring/validation-suite.ts` — validation

## RETROFIT LOG

### 2025-02-26 — Batch 7 (testing & tooling)

- `console.*` calls in all `lib/rsi/` files are intentional — RSI is a Node.js CLI agent tool, not browser code. These are exempt from the console migration rule per the SKILL.md gotchas.
- No native dialogs, rogue breakpoints, or missing 'use client' violations found.

## LAST UPDATED

2025-02-26
