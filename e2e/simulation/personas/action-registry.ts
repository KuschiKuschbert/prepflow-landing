/**
 * Action registry - delegates simulation actions to existing E2E helpers.
 * Uses prefixed names for all created entities to avoid collisions between personas.
 */
import type { Page } from '@playwright/test';
import type { Action } from './day-profiles';
import { actionToDomain } from './day-profiles';
import { executeActionHandler } from './action-handlers';
import type { RunActionContext } from './action-registry-types';

export type { RunActionContext } from './action-registry-types';

/**
 * Run a single simulation action.
 * Delegates to existing helpers with prefixed entity names.
 * Re-throws with action context for telemetry.
 */
export async function runAction(
  page: Page,
  action: Action,
  prefix: string,
  context?: RunActionContext,
): Promise<void> {
  const stepIndex = context?.stepIndex ?? 0;
  const steps: string[] = [];
  const recipeName = `${prefix}Recipe_${stepIndex}`;

  try {
    await executeActionHandler(page, action, prefix, context, recipeName, steps);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[${action}] ${msg}`);
  }
}

export { actionToDomain };
