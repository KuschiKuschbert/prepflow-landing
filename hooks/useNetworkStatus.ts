/**
 * Hook to detect network status and handle offline scenarios
 */

import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

/**
 * Hook to monitor network status
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      // Reset wasOffline after a delay to allow UI to show reconnection message
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}



