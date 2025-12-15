/**
 * Week navigation action helpers for roster state.
 */
export function createWeekActions(set: any) {
  return {
    setCurrentWeekStart: (date: Date) => set({ currentWeekStart: date }),
  };
}
