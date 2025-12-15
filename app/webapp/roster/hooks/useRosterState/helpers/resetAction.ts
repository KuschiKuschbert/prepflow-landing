/**
 * Reset action helper for roster state.
 */
export function createResetAction(initialState: any, set: any) {
  return () => set(initialState);
}
