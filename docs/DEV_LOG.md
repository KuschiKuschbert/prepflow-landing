# Dev Log

## 2026-01-16

- Merged PR #30 to restore build reliability and typing.
- Started follow-up fixes to pin Node to 22.x and narrow TypeScript includes to reduce Turbopack scanning warnings.
- Added guards to performance testing workflow when artifacts are missing.
- Added regression-step artifact existence check to prevent download failures.
- Added a guard in performance testing workflow for missing Lighthouse results.
- Ran Prettier across the repository to clear formatting gates in CI.
