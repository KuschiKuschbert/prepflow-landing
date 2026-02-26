# SCRIPTS SKILL

## PURPOSE

Load when working with build scripts, cleanup scripts, codemod scripts, deployment scripts, or when adding a new npm script.

## HOW IT WORKS IN THIS CODEBASE

**All scripts live in `scripts/`** and are Node.js scripts (mostly `.js` with some `.ts` run via `tsx`).

**Key script categories:**

### Code Quality

| Script                          | Command                            | Purpose                   |
| ------------------------------- | ---------------------------------- | ------------------------- |
| `scripts/check-file-sizes.js`   | `npm run lint:filesize`            | Enforces file size limits |
| `scripts/cleanup.js`            | `npm run cleanup:check/fix/report` | Runs all cleanup checks   |
| `scripts/detect-breakpoints.js` | `npm run detect-breakpoints`       | Analyzes breakpoint usage |

### Codemods

| Script                                     | Command                       | Purpose                            |
| ------------------------------------------ | ----------------------------- | ---------------------------------- |
| `scripts/codemods/breakpoint-migration.js` | `npm run codemod:breakpoints` | Migrates sm/md/lg → tablet/desktop |
| `scripts/codemods/console-migration.js`    | `npm run codemod:console`     | Migrates console.\* → logger       |

### Pre-Deployment

| Script                            | Command                      | Purpose               |
| --------------------------------- | ---------------------------- | --------------------- |
| `scripts/pre-deploy-check.sh`     | `npm run pre-deploy`         | All deployment checks |
| `scripts/safe-merge.sh`           | `bash scripts/safe-merge.sh` | Safe branch merge     |
| `scripts/check-legal-and-node.js` | Run by pre-deploy            | Node version + legal  |
| `scripts/verify-vercel-setup.sh`  | Run by pre-deploy            | Vercel config check   |

### Performance

| Script                                | Command                           | Purpose             |
| ------------------------------------- | --------------------------------- | ------------------- |
| `scripts/analyze-bundle.js`           | `npm run analyze`                 | Bundle composition  |
| `scripts/check-performance-budget.js` | `npm run check:bundle`            | Bundle size budgets |
| `scripts/optimize-images.js`          | `node scripts/optimize-images.js` | Compress + WebP     |

### Generation

| Script                                   | Command             | Purpose                |
| ---------------------------------------- | ------------------- | ---------------------- |
| `scripts/generate-changelog.js`          | `npm run changelog` | CHANGELOG from commits |
| `scripts/generate-performance-report.js` | Manual              | Performance report     |

### Database (dev only)

| Script                            | Command                                | Purpose          |
| --------------------------------- | -------------------------------------- | ---------------- |
| `scripts/setup-database.js`       | `node scripts/setup-database.js`       | DB setup         |
| `scripts/populate-ingredients.js` | `node scripts/populate-ingredients.js` | Seed ingredients |

### E2E / Testing

| Script                                         | Command                   | Purpose                          |
| ---------------------------------------------- | ------------------------- | -------------------------------- |
| `scripts/simulation-dev-server.js`             | Used by simulation config | Dev server for E2E sim           |
| `scripts/cleanup/checks/dead-code.js`          | Part of cleanup           | Detect unused exports            |
| `scripts/cleanup/checks/optimistic-updates.js` | Part of cleanup           | Check optimistic update patterns |
| `scripts/cleanup/fixes/dead-code.js`           | Part of cleanup           | Auto-remove unused exports       |

## STEP-BY-STEP: Add a new npm script

1. Create `scripts/my-script.js`
2. Add shebang: `#!/usr/bin/env node` (for executable scripts)
3. Add to `package.json` scripts: `"my-task": "node scripts/my-script.js"`
4. Document in `docs/SCRIPTS.md`
5. If it's a pre-deploy check: add to `scripts/pre-deploy-check.sh`

## STEP-BY-STEP: Run a codemod

```bash
# Preview (dry run)
npm run codemod:console

# Apply changes
npm run codemod:console:write
npm run codemod:breakpoints:write

# Verify
npm run lint
npm run type-check
npm run format
```

## GOTCHAS

- **`filesize-ignore.json`** — temporary ignore list for files over size limit. Don't add items without a plan to fix them.
- **Codemods may fail on edge cases** — always run in dry mode first, review diff, then apply
- **`safe-merge.sh`** requires a clean working tree — stash changes first
- **`simulation-dev-server.js`** keeps a long-running process — may need manual kill if tests abort

## REFERENCE FILES

- `scripts/cleanup.js` — main cleanup orchestrator
- `scripts/cleanup/checks/` — individual check modules
- `scripts/cleanup/fixes/` — individual fix modules
- `scripts/codemods/breakpoint-migration.js` — breakpoint codemod
- `docs/SCRIPTS.md` — complete script reference

## RETROFIT LOG

### 2025-02-26 — Batch 7 (testing & tooling)

- `console.*` calls throughout `scripts/` are intentional — all scripts run in Node.js CLI context, not the browser. They are exempt from the console migration rule.
- No native dialogs or rogue breakpoints found.

## LAST UPDATED

2025-02-26
