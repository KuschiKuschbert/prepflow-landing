/**
 * Determine if API call should be skipped.
 */
export function shouldSkipApiCall(
  userHasModifiedRef: React.MutableRefObject<boolean>,
  USER_MODIFIED_KEY: string,
  isLoadingRef: React.MutableRefObject<boolean>,
  cachedProfile: any,
  initialDataLoadedRef: React.MutableRefObject<boolean>,
  setLoading: (loading: boolean) => void,
): { skip: boolean; reason?: string } {
  const userHasModified = userHasModifiedRef.current || (typeof window !== 'undefined' && sessionStorage.getItem(USER_MODIFIED_KEY) === 'true');
  if (userHasModified) return { skip: true, reason: 'user has modified form' };
  if (isLoadingRef.current) return { skip: true, reason: 'already loading' };
  if (cachedProfile) {
    initialDataLoadedRef.current = true;
    setLoading(false);
    return { skip: true, reason: 'using cached profile' };
  }
  return { skip: false };
}
