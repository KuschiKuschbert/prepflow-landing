/**
 * Cleanup function for logo interactions.
 */
export function createCleanupHandler(
  clickTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  logoHoldTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
): () => void {
  return () => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (logoHoldTimerRef.current) clearTimeout(logoHoldTimerRef.current);
  };
}
