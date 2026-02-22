/**
 * Network Status Banner
 *
 * Shows a banner when network is offline or was recently offline
 */

'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { WifiOff, Wifi } from 'lucide-react';

export function NetworkStatusBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 right-0 left-0 z-[80] bg-[var(--color-error)]/90 px-4 py-3 text-center text-sm font-medium text-[var(--button-active-text)] shadow-lg backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <Icon icon={WifiOff} size="sm" aria-hidden={true} />
            <span>You&apos;re offline. Some features may not work until you reconnect.</span>
          </div>
        </motion.div>
      )}

      {showReconnected && isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 right-0 left-0 z-[80] bg-[var(--color-success)]/90 px-4 py-3 text-center text-sm font-medium text-[var(--button-active-text)] shadow-lg backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <Icon icon={Wifi} size="sm" aria-hidden={true} />
            <span>Connection restored. You&apos;re back online.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
