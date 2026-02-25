/**
 * Telemetry collector - records bottlenecks, faulty paths, and enriches errors.
 */
import type { ErrorRecord } from '../../fixtures/global-error-listener';
import type { SimulationErrorRecord, BottleneckRecord, FaultyPathRecord } from './types';

const bottlenecks: BottleneckRecord[] = [];
const faultyPaths: FaultyPathRecord[] = [];

export function recordBottleneck(
  personaId: string,
  action: string,
  durationMs: number,
  thresholdMs: number,
  url: string,
): void {
  bottlenecks.push({
    type: 'bottleneck',
    personaId,
    action,
    durationMs,
    thresholdMs,
    url,
    timestamp: new Date().toISOString(),
  });
}

export function recordFaultyPath(
  personaId: string,
  action: string,
  url: string,
  opts?: { expected?: string; actual?: string; errorMessage?: string },
): void {
  faultyPaths.push({
    type: 'faulty-path',
    personaId,
    action,
    url,
    expected: opts?.expected,
    actual: opts?.actual,
    errorMessage: opts?.errorMessage,
    timestamp: new Date().toISOString(),
  });
}

export function enrichError(
  error: ErrorRecord,
  personaId: string,
  action?: string,
  stepIndex?: number,
): SimulationErrorRecord {
  return {
    ...error,
    personaId,
    action,
    stepIndex,
  };
}

export function getBottlenecks(): BottleneckRecord[] {
  return [...bottlenecks];
}

export function getFaultyPaths(): FaultyPathRecord[] {
  return [...faultyPaths];
}

export function clearTelemetry(): void {
  bottlenecks.length = 0;
  faultyPaths.length = 0;
}
