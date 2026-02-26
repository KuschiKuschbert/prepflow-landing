/**
 * Simulation timeline - runs persona actions across days/weeks.
 * Uses SIM_WEEKS env (default 1) for fast iteration.
 */
import type { Page } from '@playwright/test';
import type { PersonaConfig } from './personas/config';
import { getActionsForDay } from './personas/day-profiles';
import { runAction, type RunActionContext } from './personas/action-registry';
import { collectPageErrors } from '../fixtures/global-error-listener';
import { runWithHarness, recordActionFaultyPath } from './telemetry/performance-harness';

const SIM_WEEKS = parseInt(process.env.SIM_WEEKS ?? '1', 10);
/** Override total days for quick runs (e.g. SIM_DAYS=2). If set, caps days across all weeks. */
const SIM_DAYS = process.env.SIM_DAYS ? parseInt(process.env.SIM_DAYS, 10) : null;
/** When true, log step failures but continue simulation (full discovery run). Default: false (fail fast). */
const SIM_RESILIENT = process.env.SIM_RESILIENT === 'true';
/**
 * When true, run every action every day (no stochastic filtering).
 * Use for comprehensive testing to surface all potential real-world issues.
 * Default: false (weights still apply for variety).
 */
const SIM_FULL_SCOPE = process.env.SIM_FULL_SCOPE === 'true';

const CONNECTION_REFUSED_RETRY_WAIT_MS = 40000;
const CONNECTION_REFUSED_MAX_RETRIES = 3;

function isConnectionRefused(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('ERR_CONNECTION_REFUSED') ||
    msg.includes('net::ERR_CONNECTION_REFUSED') ||
    // ERR_ABORTED can also happen during dev server hot-reloads/restarts
    msg.includes('net::ERR_ABORTED') ||
    // Connection reset also indicates server-side restart
    msg.includes('net::ERR_CONNECTION_RESET')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Run one week of simulation for a persona.
 * For each day, fetches actions from getActionsForDay, runs each via runAction with performance harness, collects telemetry.
 */
export async function runSimulationWeek(
  page: Page,
  persona: PersonaConfig,
  weekIndex: number,
): Promise<void> {
  const daysInWeek = 7;
  const prefix = persona.prefix;
  const personaId = persona.id;

  for (let dayIndex = 0; dayIndex < daysInWeek; dayIndex++) {
    const absoluteDayIndex = weekIndex * daysInWeek + dayIndex;
    if (SIM_DAYS != null && absoluteDayIndex >= SIM_DAYS) return;
    const actions = getActionsForDay(dayIndex, persona, SIM_FULL_SCOPE);

    const recipeNames: string[] = [];
    const ingredientNames: string[] = [];

    for (let stepIndex = 0; stepIndex < actions.length; stepIndex++) {
      const action = actions[stepIndex];
      const context: RunActionContext = {
        stepIndex: absoluteDayIndex * 10 + stepIndex,
        recipeNames: [...recipeNames],
        ingredientNames: [...ingredientNames],
      };

      let result = await runWithHarness(page, personaId, action, context.stepIndex ?? 0, () =>
        runAction(page, action, prefix, context),
      );
      for (
        let retry = 0;
        retry < CONNECTION_REFUSED_MAX_RETRIES &&
        !result.ok &&
        result.error &&
        isConnectionRefused(result.error);
        retry++
      ) {
        console.warn(
          `[SIM] Server down, waiting ${CONNECTION_REFUSED_RETRY_WAIT_MS}ms for restart (retry ${retry + 1}/${CONNECTION_REFUSED_MAX_RETRIES})...`,
        );
        await sleep(CONNECTION_REFUSED_RETRY_WAIT_MS);
        result = await runWithHarness(page, personaId, action, context.stepIndex ?? 0, () =>
          runAction(page, action, prefix, context),
        );
      }

      await collectPageErrors(page);

      if (!result.ok && result.error) {
        // Record faulty path here (after retries exhausted), not inside runWithHarness,
        // so connection-refused retries don't prematurely mark an action as faulty.
        recordActionFaultyPath(page, personaId, action, result.error);
        if (SIM_RESILIENT) {
          console.warn(
            `[SIM_RESILIENT] ${action} failed (day ${absoluteDayIndex}):`,
            result.error.message,
          );
        } else {
          throw result.error;
        }
      }

      if (action === 'createRecipe') {
        recipeNames.push(`${prefix}Recipe_${context.stepIndex ?? 0}`);
      }
      if (action === 'createIngredient') {
        ingredientNames.push(`${prefix}_Flour`);
      }
    }
  }
}

/**
 * Run the full simulation (SIM_WEEKS weeks) for a persona.
 */
export async function runSimulation(page: Page, persona: PersonaConfig): Promise<void> {
  for (let w = 0; w < SIM_WEEKS; w++) {
    await runSimulationWeek(page, persona, w);
  }
}

export { SIM_WEEKS, SIM_DAYS, SIM_RESILIENT, SIM_FULL_SCOPE };
