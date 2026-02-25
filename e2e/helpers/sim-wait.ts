/**
 * Simulation wait utilities.
 * When SIM_FAST=true, reduces wait times for faster simulation runs.
 */
export const SIM_FAST = process.env.SIM_FAST === 'true';

/**
 * Returns wait duration in ms. When SIM_FAST, returns ~1/3 of input (min 100ms).
 */
export function getSimWait(ms: number): number {
  return SIM_FAST ? Math.max(100, Math.floor(ms / 3)) : ms;
}
