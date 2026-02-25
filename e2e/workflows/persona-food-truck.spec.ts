/**
 * Persona simulation: Food Truck.
 * Runs 1 week of FOOD_TRUCK_DAY_PROFILE with real Auth0, collects telemetry.
 */
import { test } from '@playwright/test';
import {
  setupGlobalErrorListener,
  collectPageErrors,
  getCollectedErrors,
  clearCollectedErrors,
} from '../fixtures/global-error-listener';
import { resetSelfData } from '../fixtures/simulation-auth-helper';
import { FOOD_TRUCK_PERSONA } from '../simulation/personas/config';
import { runSimulation } from '../simulation/timeline';
import { enrichError } from '../simulation/telemetry/collector';
import { generateSimulationReport } from '../simulation/telemetry/report-generator';
import type { SimulationErrorRecord } from '../simulation/telemetry/types';

test.describe('Persona Simulation: Food Truck', () => {
  test.skip(!process.env.SIM_AUTH_EMAIL, 'SIM_AUTH_EMAIL and SIM_AUTH_PASSWORD required');

  test.beforeEach(async ({ page }) => {
    clearCollectedErrors();
    await setupGlobalErrorListener(page);

    if (process.env.SIM_AUTH_EMAIL) {
      await resetSelfData(page);
    }
  });

  test('Run 1 week food truck simulation', async ({ page }) => {
    await runSimulation(page, FOOD_TRUCK_PERSONA);
    await collectPageErrors(page);
  });

  test.afterAll(async () => {
    const errors = getCollectedErrors();
    const enriched: SimulationErrorRecord[] = errors.map(e =>
      enrichError(e, FOOD_TRUCK_PERSONA.id, undefined, undefined),
    );
    generateSimulationReport(
      enriched,
      {
        personaCount: 1,
        totalErrors: enriched.length,
        totalBottlenecks: 0,
        totalFaultyPaths: 0,
      },
      FOOD_TRUCK_PERSONA.id,
    );

    // No browser cleanup - each persona's beforeEach already does resetSelfData.
  });
});
