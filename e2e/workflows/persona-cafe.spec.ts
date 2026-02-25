/**
 * Persona simulation: Cafe.
 * Runs 1 week of CAFE_DAY_PROFILE with real Auth0, collects telemetry.
 */
import { test } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getCollectedErrors,
  clearCollectedErrors,
} from '../fixtures/global-error-listener';
import { resetSelfData } from '../fixtures/simulation-auth-helper';
import { CAFE_PERSONA } from '../simulation/personas/config';
import { runSimulation } from '../simulation/timeline';
import { enrichError } from '../simulation/telemetry/collector';
import { generateSimulationReport } from '../simulation/telemetry/report-generator';
import type { SimulationErrorRecord } from '../simulation/telemetry/types';

test.describe('Persona Simulation: Cafe', () => {
  test.skip(!process.env.SIM_AUTH_EMAIL, 'SIM_AUTH_EMAIL and SIM_AUTH_PASSWORD required');

  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);

    if (process.env.SIM_AUTH_EMAIL) {
      await resetSelfData(page);
    }
  });

  test('Run 1 week cafe simulation', async ({ page }) => {
    await runSimulation(page, CAFE_PERSONA);
    await collectPageErrors(page);
  });

  test.afterAll(async () => {
    const errors = getCollectedErrors();
    const enriched: SimulationErrorRecord[] = errors.map(e =>
      enrichError(e, CAFE_PERSONA.id, undefined, undefined),
    );
    generateSimulationReport(
      enriched,
      {
        personaCount: 1,
        totalErrors: enriched.length,
        totalBottlenecks: 0,
        totalFaultyPaths: 0,
      },
      CAFE_PERSONA.id,
    );
    // No browser cleanup here - each persona's beforeEach already does resetSelfData.
    // Opening a new context in afterAll can cause "page closed" for the next persona.
  });
});
