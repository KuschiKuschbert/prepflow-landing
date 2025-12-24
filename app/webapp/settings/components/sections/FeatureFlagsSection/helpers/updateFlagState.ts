/**
 * Helper function to update flag state in the updating set.
 */
export function updateUpdatingState(
  setUpdating: React.Dispatch<React.SetStateAction<Set<string>>>,
  flagKey: string,
  isUpdating: boolean,
) {
  setUpdating(prev => {
    const next = new Set(prev);
    if (isUpdating) {
      next.add(flagKey);
    } else {
      next.delete(flagKey);
    }
    return next;
  });
}
