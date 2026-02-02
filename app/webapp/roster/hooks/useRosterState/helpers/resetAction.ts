/**
 * Reset action helper for roster state.
 */
import type { RosterState, RosterStoreSet } from '@/lib/types/roster';

export function createResetAction(initialState: Partial<RosterState>, set: RosterStoreSet) {
  return () => set(initialState as RosterState);
}
