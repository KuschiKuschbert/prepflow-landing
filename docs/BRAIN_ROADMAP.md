# The Brain Roadmap: Evolving to Senior Autonomous Developer

This document outlines the features required to elevate our autonomous scripts from a "Junior Fixer" to a "Senior Architect".

## Phase 1: The Fixer (Completed ✅)

- [x] **Memory**: `TROUBLESHOOTING_LOG.md` (Solution Bank)
- [x] **Rules**: `LIVING_RULES.md` (Best Practices)
- [x] **Reflex**: `scripts/auto-fix.sh` (Auto-apply fixes)

## Phase 2: The Architect (Structural Integrity) 🏗️

**Goal**: Enforce strict architectural boundaries to prevent spaghetti code.

- [ ] **Dependency Guard**: Block illegal imports (e.g., Client components importing Server secrets).
- [ ] **Circular Dependency Detection**: Prevent module cycles before they build.
- [ ] **Feature Isolation**: Ensure features (e.g., `auth`, `billing`) remain loosely coupled.

## Phase 3: The Sentinel (Proactive Health) 🛡️

**Goal**: Monitor code health metrics to prevent technical debt accumulation.

- [ ] **Code Smell Detector**: Warn on functions > 50 lines or high complexity.
- [ ] **Tech Debt Tracker**: Count and date-stamp `TODO` comments. Fail build if > 30 days old.
- [ ] **Type Guard**: Strict "No Consensus" on `any` types.

## Phase 4: The Test Generator (Coverage Guardian) 🧪

**Goal**: Ensure no critical path is left untested.

- [ ] **Zero-Coverage Scanner**: Identify critical files with 0% coverage.
- [ ] **Skeleton Generator**: Auto-generate test files (`.test.tsx`) for uncovered components.

## Phase 5: The Auditor (Security & Performance) 👮

**Goal**: Block security risks and bloat.

- [ ] **Secret Scanner**: Pre-commit check for API keys/tokens.
- [ ] **Bundle Budget**: Fail build if a PR increases bundle size by > 10KB.
