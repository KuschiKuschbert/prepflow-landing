# 🐙 Git Workflow

1.  **Branch**: `feature/`, `fix/`, `refactor/`. Always create a branch before writing code.
2.  **Format**: `lint-staged` runs automatically on commit. Code MUST be formatted with Prettier.
3.  **Check**: Run `npm run rsi:status` before starting.
4.  **Merge**: MUST use `scripts/safe-merge.sh`. It delegates to `npm run pre-deploy` (single source of truth). Use `--fast` for lint + type-check only; `--skip-lint` for merge-only (emergency).
5.  **Main Protection**: Committing directly to `main` is FORBIDDEN.
