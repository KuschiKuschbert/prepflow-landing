import { useRef, useEffect } from 'react';
import { logger } from '@/lib/logger';

const USER_MODIFIED_KEY = 'profile_panel_user_modified';

/**
 * Hook for tracking component mount/unmount and user modification state
 */
export function useProfileMountTracking() {
  const mountIdRef = useRef<string | null>(null);
  const mountCountRef = useRef(0);
  const userHasModifiedRef = useRef(
    typeof window !== 'undefined' ? sessionStorage.getItem(USER_MODIFIED_KEY) === 'true' : false,
  );

  useEffect(() => {
    mountCountRef.current += 1;
    mountIdRef.current = `mount-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const mountId = mountIdRef.current;
    const mountCount = mountCountRef.current;
    const userHasModified = userHasModifiedRef.current;
    logger.dev('[ProfileInformationPanel] Component mounted', {
      mountId,
      mountCount,
    });

    return () => {
      logger.dev('[ProfileInformationPanel] Component unmounting', {
        mountId,
        mountCount,
        userHasModified,
      });
    };
  }, []);

  return {
    mountIdRef,
    userHasModifiedRef,
    USER_MODIFIED_KEY,
  };
}
