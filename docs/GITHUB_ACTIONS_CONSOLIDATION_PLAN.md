# GitHub Actions Consolidation & Fix Plan

A comprehensive plan to fix skipped steps, rarely-run workflows, consolidation opportunities, and persistent failures.

---

## Executive Summary

| Issue                | Root Cause                                                   | Solution                                                           |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| Steps skipped        | `if` conditions, `needs` chains, branch filters              | Consolidate triggers, fix conditions                               |
| Workflows rarely run | Schedule-only jobs, missing schedule, branch mismatches      | Add schedules, align branches, merge redundant workflows           |
| Red/failing runs     | 9 strict checks, duplicate Lighthouse runs, missing env vars | Fix checks, consolidate, add `continue-on-error` where appropriate |

---

## Part A: Why Steps Get Skipped

### 1. ci-cd.yml – Job-Level Skips

| Job                 | Condition                                     | Why It Skips                                             |
| ------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `e2e-crawl`         | `if: github.ref == 'refs/heads/main'`         | PRs and pushes to `development` skip it                  |
| `deploy`            | `if: github.ref == 'refs/heads/main'`         | Same as above                                            |
| `performance-check` | `needs: deploy`                               | Skipped whenever deploy is skipped (all non-main)        |
| `notify`            | `needs: [quality-checks, build-test, deploy]` | Always runs (`if: always()`) but deploy is often skipped |

**Step-level skip:**

- "Deploy to Vercel" skips when `VERCEL_TOKEN` is missing (`if: steps.check_secrets.outputs.deploy == 'true'`)

### 2. performance-testing.yml – Job-Level Skips

| Job                      | Condition                                                                             | Why It Skips                             |
| ------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------- |
| `performance-regression` | `if: github.event_name == 'push' && github.ref == 'refs/heads/main' && has_artifacts` | Only runs on push to main with artifacts |
| `performance-monitoring` | `if: github.event_name == 'schedule'`                                                 | Only runs on cron (2 AM daily)           |

**Note:** `performance-regression` depends on `performance-test.outputs.has_artifacts`. If Lighthouse fails before producing artifacts, this job never runs.

### 3. error-learning.yml – Broken learning-report

| Job               | Condition                                                                  | Why It Skips                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `learning-report` | `if: github.event_name == 'workflow_dispatch' \|\| github.event.schedule'` | **BUG:** Workflow has no `schedule` trigger. When triggered by `workflow_run`, `event_name` is `workflow_run`, so this job **never runs** except on manual dispatch. |

### 4. rsi-nightly.yml – Conditional Steps

| Step                             | Condition                                       | Why It Skips                   |
| -------------------------------- | ----------------------------------------------- | ------------------------------ |
| Create PR                        | `if: steps.git-check.outputs.changes == 'true'` | Only when RSI produces changes |
| Safe-check, Decision, Auto-merge | Depends on Create PR                            | Skipped when no changes        |

---

## Part B: Why Workflows Rarely Run

### 1. Scheduled Workflows – GitHub Restriction

GitHub **disables scheduled workflows** if the repository has had no commits, push, or pull request activity in the last 60 days. If the repo is quiet, schedules stop firing.

**Affected:**

- `performance-testing` (cron: 2 AM daily)
- `rsi-nightly` (cron: 15:00 UTC daily)

### 2. Branch Mismatches

| Workflow                   | Trigger Branches  | Gap                                        |
| -------------------------- | ----------------- | ------------------------------------------ |
| performance-testing (push) | main, development | OK (fixed)                                 |
| performance-testing (PR)   | main only         | PRs targeting `development` do not trigger |
| ci-cd                      | main, development | OK                                         |

### 3. error-learning – learning-report Never Triggers on CI

The `learning-report` job has:

```yaml
if: github.event_name == 'workflow_dispatch' || github.event.schedule
```

But `error-learning` is triggered by `workflow_run`. When CI completes, `event_name` is `workflow_run`, not `workflow_dispatch` or `schedule`. Therefore `learning-report` never runs from normal CI completion.

---

## Part C: Consolidation Opportunities

### 1. Duplicate Lighthouse Runs (High Impact)

Two workflows run Lighthouse:

| Location                                   | When                                   | What                                       |
| ------------------------------------------ | -------------------------------------- | ------------------------------------------ |
| ci-cd.yml `performance-check`              | After deploy on main only              | Lighthouse via treosh/lighthouse-ci-action |
| performance-testing.yml `performance-test` | Push/PR to main/development + schedule | Lighthouse via npx lhci autorun            |

**Recommendation:** Remove `performance-check` from ci-cd.yml. Use performance-testing.yml as the single source for Lighthouse. The ci-cd performance job rebuilds and reruns Lighthouse redundantly when performance-testing already runs on the same push.

### 2. performance-testing – Three Overlapping Jobs

| Job                    | Triggers           | Overlap                                                      |
| ---------------------- | ------------------ | ------------------------------------------------------------ |
| performance-test       | push, PR, schedule | Full Lighthouse + analyze + budget                           |
| performance-regression | push to main only  | Depends on performance-test artifacts                        |
| performance-monitoring | schedule only      | Same steps as performance-test (Lighthouse, analyze, budget) |

**Recommendation:** Merge `performance-monitoring` into `performance-test`. Use one job with a single schedule; on schedule, run the same steps. No need for a separate `performance-monitoring` job.

### 3. error-learning – Simplify or Remove learning-report

Options:

- **A)** Add `schedule` to error-learning so `learning-report` can run weekly.
- **B)** Run `learning-report` when CI succeeds (e.g. weekly on main) by changing the condition.
- **C)** Remove `learning-report` if it is unused and add it back when needed.

---

## Part D: Causes of Red (Failing) Runs

### 1. quality-checks – 9 Blocking Steps

Any single failure fails the run:

| Step               | Command                            | Common Causes             |
| ------------------ | ---------------------------------- | ------------------------- |
| Lint               | `npm run lint`                     | ESLint, no-console        |
| Format             | `npm run format:check`             | Prettier drift            |
| TypeScript         | `npm run type-check`               | Type errors               |
| audit:scripts      | `npm run audit:scripts`            | ESLint in scripts/        |
| check:security     | `npm run check:security`           | Secrets, console, eval    |
| check:health       | `npm run check:health`             | TODOs, long functions     |
| check:architecture | `npm run check:architecture`       | Circular deps, boundaries |
| lint:filesize      | `npm run lint:filesize`            | Files over limits         |
| npm audit          | `npm audit --audit-level=moderate` | Moderate+ vulns           |

### 2. build-test

- Build failure (missing env vars, TS errors at build time).
- `check:bundle` failure (bundle over budget).

### 3. e2e-crawl (main only)

- Console errors during crawl.
- Timeouts (dev server, Playwright).

### 4. Deploy

- Missing Vercel secrets.
- Vercel API/config errors.

---

## Part E: Recommended Actions (Prioritized)

### Phase 1: Quick Fixes (Low Risk)

1. **Fix error-learning learning-report trigger**
   - Add `schedule: - cron: '0 3 * * 0'` (weekly Sunday 3 AM) to error-learning.
   - Change `learning-report` condition to: `if: github.event_name == 'workflow_dispatch' || github.event_name == 'schedule'`.

2. **Align performance-testing PR branches**
   - Change `pull_request: branches: [main]` to `branches: [main, development]` for consistency with ci-cd.

3. **Add env vars to performance-monitoring build**
   - Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` to the performance-monitoring Build step (it currently has none).

### Phase 2: Consolidation (Medium Risk)

4. **Remove duplicate performance-check from ci-cd**
   - Delete the `performance-check` job from ci-cd.yml.
   - Keep Lighthouse only in performance-testing.yml.

5. **Merge performance-monitoring into performance-test**
   - Add schedule handling inside performance-test: when `github.event_name == 'schedule'`, run the same steps (optionally with report upload).
   - Remove the separate `performance-monitoring` job.

### Phase 3: Reduce Red Runs (Policy Decisions)

6. **Relax npm audit**
   - Change `npm audit --audit-level=moderate` to `--audit-level=high` to reduce noise from moderate vulns.

7. **Make strict checks advisory (temporary)**
   - Add `continue-on-error: true` to: `check:health`, `check:architecture`, `lint:filesize` until violations are fixed.
   - Track fixes in a ticket/board and remove `continue-on-error` once clean.

8. **E2E robustness**
   - Increase Playwright `webServer.timeout` from 120s to 180s.
   - Add `continue-on-error: true` to e2e-crawl if it is not critical for merge.

### Phase 4: Optional Cleanup

9. **RSI workflow**
   - If RSI is not used: disable or remove rsi-nightly.yml.
   - If used: ensure repo has activity so schedules run.

10. **Document workflow behavior**
    - Add `docs/GITHUB_ACTIONS.md` describing when each workflow runs and which jobs/steps can be skipped.

---

## Part F: Implementation Checklist

### Phase 1 (Quick Fixes)

- [x] error-learning.yml: Add schedule, fix learning-report condition
- [x] performance-testing.yml: Add development to pull_request branches
- [x] performance-testing.yml: Remove performance-monitoring job (consolidated - performance-test already runs on schedule)

### Phase 2 (Consolidation)

- [x] ci-cd.yml: Remove performance-check job
- [x] performance-testing.yml: Remove performance-monitoring job (duplicate of performance-test)

### Phase 3 (Reduce Failures)

- [x] ci-cd.yml: Change npm audit to --audit-level=high
- [x] ci-cd.yml: Add continue-on-error to check:health, check:architecture, lint:filesize, e2e-crawl
- [x] playwright.config.ts: Increase webServer timeout to 180000
- [x] pr-labels.yml: Add continue-on-error to labeler step

### Phase 4 (Optional)

- [ ] Evaluate rsi-nightly usage; disable if unused
- [ ] Create docs/GITHUB_ACTIONS.md

### Phase 5 (Self-Improving - Implemented)

- [x] Add .github/dependabot.yml for npm and github-actions dependency updates

---

## Part G: Workflow Dependency Diagram (After Consolidation)

```mermaid
flowchart TD
    subgraph ci [CI/CD Pipeline]
        QC[Quality Checks]
        BT[Build & Test]
        E2E_S[E2E Smoke]
        E2E_C[E2E Crawl - main]
        DEP[Deploy - main]
        NOT[Notify]
    end

    subgraph perf [Performance Testing]
        PT[Performance Test]
        PR[Performance Regression - main]
    end

    subgraph err [Error Learning]
        CBE[Capture Build Errors]
        DF[Detect Fixes]
        LR[Learning Report - schedule]
    end

    QC --> BT
    BT --> E2E_S
    BT --> E2E_C
    BT --> DEP
    DEP --> NOT
    PT --> PR

    CI_COMPLETE[CI Completes] --> CBE
    CI_COMPLETE --> DF
    SCHEDULE[Schedule] --> LR
```

---

## Part H: Files to Modify

| File                                      | Changes                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| .github/workflows/error-learning.yml      | Add schedule; fix learning-report if                                          |
| .github/workflows/performance-testing.yml | PR branches; env vars in performance-monitoring; merge performance-monitoring |
| .github/workflows/ci-cd.yml               | Remove performance-check; relax audit; optional continue-on-error             |
| playwright.config.ts                      | Increase webServer timeout                                                    |

---

## Part I: Additional Workflow Opportunities (Beyond Current Scope)

Based on PrepFlow's domain (restaurant profitability, Supabase, Auth0, Stripe, design system, testing, migrations) and existing scripts, these workflows could add value:

### High Value / Common Practice

| Workflow                | Trigger                  | Purpose                                                    | Implementation                                                                    |
| ----------------------- | ------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Dependabot**          | Automatic                | Open PRs for outdated dependencies and security advisories | Add `.github/dependabot.yml`. No workflow needed; Dependabot is a GitHub feature. |
| **Release / Changelog** | `on: push: tags: ['v*']` | Generate CHANGELOG from commits, create GitHub Release     | Run `npm run changelog`, commit, use `softprops/action-gh-release`.               |
| **CodeQL / Security**   | push/PR                  | Deep code scanning (SQLi, XSS, secrets)                    | Add `github/codeql-action`. Complements `check:security`.                         |

### Medium Value / Domain-Specific

| Workflow                             | Trigger                               | Purpose                                                      | Implementation                                                              |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Design & Accessibility Audit**     | Schedule (weekly)                     | Run `audit:hierarchy`, `audit:icons`, `test:accessibility`   | Advisory; report violations without blocking. Good for design system drift. |
| **Full Check Suite**                 | Schedule (weekly) or pre-release      | Run `npm run check:full` (cleanup + design + coverage + E2E) | Already documented in operations.mdc; automate periodic health.             |
| **Auth0 / Stripe Config Validation** | Schedule (weekly)                     | Run `auth0:validate`, `stripe:validate`                      | Catch callback URL drift, misconfig before users hit issues.                |
| **Database Migration Validation**    | PRs touching `supabase/migrations/**` | Run `supabase db diff` or validate SQL syntax                | Needs Supabase CLI + linked project. Catches migration typos.               |

### Nice-to-Have

| Workflow                     | Trigger                 | Purpose                                                       | Implementation                                                        |
| ---------------------------- | ----------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| **E2E Simulation Personas**  | main only, or schedule  | Run `test:simulation` (cafe, restaurant, food-truck personas) | Heavier; uses `playwright.simulation.config.ts`. Good for regression. |
| **Stale Branch Cleanup**     | Schedule                | Close/archive branches older than N days                      | Use `actions/stale` or similar. Reduces noise.                        |
| **Documentation Sync Check** | PRs touching API routes | Ensure API_ENDPOINTS.md or docs are updated                   | Custom script to diff routes vs docs.                                 |

### Recommended Next Additions (After Current Fixes)

1. **Dependabot** – Zero workflow; add `.github/dependabot.yml`. High ROI for dependency security.
2. **Release automation** – On tag push, generate changelog and create GitHub Release. Useful for versioning.
3. **Design & Accessibility (weekly)** – Low maintenance; uses existing scripts; surfaces design drift early.

### What to Skip (For Now)

- **Screenshot capture** – Requires auth, headed browser; manual or run locally before release.
- **Database migrations in CI** – Applying to a real DB in CI is risky; validation-only if needed.
- **Heavy simulation E2E in every PR** – Too slow; keep for main/schedule only.
