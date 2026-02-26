/**
 * Performance harness - wraps actions with timing and records bottlenecks/faulty paths on failure.
 */
import type { Page } from '@playwright/test';
import { recordBottleneck, recordFaultyPath } from './collector';

const BOTTLENECK_THRESHOLD_MS = 5000;

export interface HarnessResult {
  ok: boolean;
  durationMs: number;
  error?: Error;
}

/**
 * Run an action with timing. Records bottleneck if duration exceeds threshold.
 * On thrown error, returns the error WITHOUT recording a faulty path immediately.
 * The caller (timeline.ts) is responsible for recording faulty paths after retries are exhausted.
 */
export async function runWithHarness<T>(
  page: Page,
  personaId: string,
  action: string,
  stepIndex: number,
  fn: () => Promise<T>,
): Promise<HarnessResult> {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    if (durationMs > BOTTLENECK_THRESHOLD_MS) {
      recordBottleneck(personaId, action, durationMs, BOTTLENECK_THRESHOLD_MS, page.url());
    }
    return { ok: true, durationMs };
  } catch (err) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err : new Error(String(err));
    // NOTE: Do NOT record faulty path here - the caller (timeline.ts) handles this
    // after all retries are exhausted, so connection-refused retries don't double-count.
    return { ok: false, durationMs, error };
  }
}

/**
 * Record a faulty path for an action that failed after all retries.
 */
export function recordActionFaultyPath(
  page: Page,
  personaId: string,
  action: string,
  error: Error,
): void {
  const message = error.message;
  let faultType = 'unknown';
  if (message.includes('Timeout') || message.includes('selector')) faultType = 'selector-timeout';
  else if (message.includes('form') || message.includes('submit')) faultType = 'form-timeout';
  else if (message.includes('navigation') || message.includes('load'))
    faultType = 'navigation-failed';

  recordFaultyPath(personaId, action, page.url(), {
    errorMessage: message,
    expected: 'Action completes successfully',
    actual: faultType,
  });
}
