/**
 * Telemetry types for persona simulation.
 */
import type { ErrorRecord } from '../../fixtures/global-error-listener';

export interface SimulationErrorRecord extends ErrorRecord {
  personaId?: string;
  prefix?: string;
  action?: string;
  stepIndex?: number;
}

export interface BottleneckRecord {
  type: 'bottleneck';
  personaId: string;
  action: string;
  durationMs: number;
  thresholdMs: number;
  url: string;
  timestamp: string;
}

export interface FaultyPathRecord {
  type: 'faulty-path';
  personaId: string;
  action: string;
  url: string;
  expected?: string;
  actual?: string;
  errorMessage?: string;
  timestamp: string;
}
