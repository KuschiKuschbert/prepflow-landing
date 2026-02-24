# 🐙 Git Workflow & RSI Integration

This document serves as the **Single Source of Truth** for contributing to the PrepFlow/CurbOS codebase. Adherence to this workflow is **mandatory** for both human developers and AI agents.

## 1. 🛑 Golden Rules

1.  **Main is Sacred**: NEVER commit directly to `main`.
2.  **Safe Merge Only**: ALWAYS use `scripts/safe-merge.sh` to merge into `main`.
3.  **Green CI**: Code must pass Lint, Types, Format, and Build checks before merging.
4.  **Auto-Format**: `lint-staged` automatically formats your code on commit. Do not bypass it.

---

## 2. 🔄 Development Cycle

### Step 1: Branching

Create a descriptive branch for your task. Use specific prefixes:

- `feature/` - New capabilities (e.g., `feature/recipe-search`)
- `fix/` - Bug fixes (e.g., `fix/api-types`)
- `refactor/` - Code improvements (e.g., `refactor/auth-hooks`)
- `docs/` - Documentation updates

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Step 2: Coding & RSI

As you code, leverage the **Recursive Self-Improvement (RSI)** system to maintain quality.

- **Check Health**: Before starting complex work, check for active rules.
  ```bash
  npm run rsi:status
  ```
- **Auto-Fix**: If you encounter lint errors or sloppy patterns, let RSI fix them.
  ```bash
  npm run rsi:fix
  ```

### Step 3: Committing (Automation)

When you commit, `husky` and `lint-staged` will automatically run fast checks:

1.  **Merge Conflict Check**: Blocks if unresolved conflict markers are staged.
2.  **Curbos Protection**: Blocks commits that modify `app/curbos/` (use `ALLOW_CURBOS_MODIFY=1` for emergency bypass).
3.  **File Size Check**: Blocks commits if files exceed complexity limits (see `docs/SCRIPTS.md`).
4.  **Prettier** (via lint-staged): Formats all modified files.

Heavy checks (Security, Health, Architecture, ADR) run in CI. Use `--no-verify` only in emergencies.

```bash
git add .
git commit -m "feat: add amazing new feature"
```

> **Note:** If the commit fails due to "File Size Limit", you must refactor the large file or (rarely) add it to `scripts/filesize-ignore.json`.

---

## 3. 🔀 Merging (The Protocol)

We do **NOT** use standard `git merge`. We use a guarded protocol script to ensure stability.

**Safe-merge is manual:** Run it yourself when merging into `main`. Pre-push does **not** invoke it.

### The Command

```bash
./scripts/safe-merge.sh
```

### What It Does

1.  **Verifies**: Delegates to `npm run pre-deploy` (single source of truth: lint, type-check, test, file size, cleanup, build).
2.  **Merges**: Only if ALL checks pass, it merges your branch into `main`.
3.  **Cleans**: Deletes the local feature branch.

**Flags:** `--fast` runs lint + type-check only (quick gate). `--skip-lint` skips verification entirely (emergency use).

> **Failure:** If `safe-merge.sh` fails, READ THE LOGS, fix the errors, and try again. Do not force merge.

---

## 4. 🚀 Deployment

Deployment to Vercel is **automatic** when `main` is updated effectively.

1.  **Push**: After a successful safe-merge, push `main`.
    ```bash
    git push origin main
    ```
2.  **Pre-push**: Runs lightweight checks (lint + type-check only, under 30s). Full verification is in CI and safe-merge.
3.  **CI/CD**: GitHub Actions will run the full suite (Lint, Test, Build).
4.  **Deploy**: If Green, Vercel promotes the build to Production.

---

## 5. 🤖 RSI & Maintenance

The RSI system runs nightly to improve the codebase. Include its recommendations in your workflow.

- **Status**: `npm run rsi:status`
- **Manual Evolution**: If you created a reusable pattern, genericize it and add it to `docs/patterns/`.
