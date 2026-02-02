/**
 * Week navigation action helpers for roster state.
 */
import type { RosterStoreSet } from '@/lib/types/roster';

export function createWeekActions(set: RosterStoreSet) {
  return {
    setCurrentWeekStart: (date: Date) => set({ currentWeekStart: date }),
  };
}
