# E2E TESTING SKILL

## PURPOSE

Load when working on Playwright E2E tests, simulation tests, workflow helpers, E2E fixtures, or the crawl/smoke test scripts.

## HOW IT WORKS IN THIS CODEBASE

**Two Playwright configs:**

1. `playwright.config.ts` — standard E2E tests (1 worker, Chromium, QA reporter)
2. `playwright.simulation.config.ts` — simulation tests (persona-based user journey simulation)

**E2E structure:**

```
e2e/
├── fixtures/
│   ├── auth-helper.ts          ← Auth0 session management for tests
│   ├── simulation-auth-helper.ts
│   └── global-error-listener.ts
├── helpers/
│   ├── form-helpers.ts         ← Reusable form interaction utilities
│   └── sim-wait.ts             ← Wait utilities for simulation
├── scripts/
│   └── simulation-global-setup.ts
├── simulation/
│   ├── personas/
│   │   ├── action-handlers.ts  ← Persona action dispatch
│   │   ├── action-handlers/detailHandlers.ts
│   │   ├── action-registry-helpers.ts
│   │   ├── day-profiles.ts     ← Daily behavior profiles
│   │   └── day-profiles-data.ts
│   ├── reports/                ← Simulation run reports (auto-generated)
│   ├── telemetry/
│   │   └── performance-harness.ts
│   └── timeline.ts
└── workflows/
    └── helpers/                ← Reusable workflow helpers (one per domain)
        ├── createIngredientFlow.ts
        ├── createRecipeFlow.ts
        ├── addIngredientToRecipeFlow.ts
        └── ...
```

**Test commands:**

```bash
npm run test:e2e      # Full Playwright suite
npm run test:smoke    # Quick key-page check (auth bypassed)
npm run test:crawl    # Full webapp crawl for console errors → CRAWL_REPORT.md
```

**Auth in E2E:**

- `e2e/fixtures/auth-helper.ts` manages Auth0 session creation/storage
- `e2e/simulation-auth.json` stores simulation user session (gitignored-ish)
- Uses `SIM_AUTH_EMAIL` + `SIM_AUTH_PASSWORD` env vars for simulation user

## STEP-BY-STEP: Add a new workflow helper

1. Create `e2e/workflows/helpers/myFeatureFlow.ts`
2. Follow the pattern: function takes `(page: Page, options: {...}) => Promise<{ ... }>`
3. Use helpers from `e2e/helpers/form-helpers.ts` for common interactions
4. Add to the simulation action registry if it should be part of persona simulations
5. No TypeScript path aliases in E2E files (excluded from tsconfig)

## STEP-BY-STEP: Debug a failing E2E test

1. Run `npm run test:e2e -- --debug` for step-through mode
2. Check `test-results/` for screenshots and traces
3. Look at `e2e/simulation/reports/SIMULATION_REPORT_*.md` for simulation failures
4. Check `docs/E2E_TESTING_GUIDE.md` for known patterns

## GOTCHAS

- **E2E files are excluded from TypeScript compilation** (`tsconfig.json`) — no `@/` aliases, use relative imports
- **`form-helpers.ts` is 304 lines** — over the 300-line component limit (in filesize-ignore.json temporarily)
- **`action-handlers.ts` is 314 lines** — same situation
- **Simulation reports** in `e2e/simulation/reports/` are auto-generated — don't edit manually
- **`playwright.simulation.config.ts`** uses a separate dev server — see `scripts/simulation-dev-server.js`
- **Auth state is shared** across test files in the simulation suite — be careful with state mutations

## REFERENCE FILES

- `e2e/fixtures/auth-helper.ts` — auth session management
- `e2e/helpers/form-helpers.ts` — reusable form utilities
- `e2e/workflows/helpers/createIngredientFlow.ts` — example workflow
- `playwright.config.ts` — test configuration
- `docs/E2E_TESTING_GUIDE.md` — comprehensive testing guide

## RETROFIT LOG

## LAST UPDATED

2025-02-26
