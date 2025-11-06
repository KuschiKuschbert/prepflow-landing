'use client';

import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { subscribeLoadingGate } from '@/lib/loading-gate';
import { prefersReducedMotion, isArcadeDisabled, isTouchDevice } from '@/lib/arcadeGuards';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';

const routePath = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

const isAuthRoute = (path: string) => {
  return path.startsWith('/api/auth') || path.startsWith('/login') || path.startsWith('/auth');
};

const CatchTheDocketOverlay: React.FC = () => {
  const [active, setActive] = useState(false);
  const disabled = useMemo(() => {
    const path = routePath();
    const d = prefersReducedMotion() || isArcadeDisabled() || isTouchDevice() || isAuthRoute(path);
    if (d && typeof window !== 'undefined') {
      const payload = {
        event: 'arcade_disabled_mobile',
        event_category: 'arcade',
        page_path: path,
        reason: isAuthRoute(path)
          ? 'auth_route'
          : prefersReducedMotion()
            ? 'reduced_motion'
            : isArcadeDisabled()
              ? 'flag'
              : 'touch_device',
      } as const;
      (window as any).dataLayer?.push(payload);
      window.dispatchEvent(new CustomEvent('gtm:event', { detail: payload }));
    }
    return d;
  }, []);

  useEffect(() => {
    // Double-check disabled state on every render to prevent race conditions
    if (disabled || isTouchDevice() || isArcadeDisabled() || prefersReducedMotion()) return;
    return subscribeLoadingGate(isVisible => {
      // Additional safety check before showing overlay
      if (isVisible && (isTouchDevice() || isArcadeDisabled() || prefersReducedMotion())) {
        return;
      }

      // analytics hooks
      if (isVisible && !active) {
        const startPayload = {
          event: 'arcade_loading_start',
          event_category: 'arcade',
          page_path: routePath(),
          threshold_ms: 300,
        } as const;
        (window as any).dataLayer?.push(startPayload);
        window.dispatchEvent(new CustomEvent('gtm:event', { detail: startPayload }));
      }

      if (!isVisible && active) {
        const endPayload = {
          event: 'arcade_loading_end',
          event_category: 'arcade',
          page_path: routePath(),
        } as const;
        (window as any).dataLayer?.push(endPayload);
        window.dispatchEvent(new CustomEvent('gtm:event', { detail: endPayload }));
      }

      setActive(isVisible);
    });
  }, [disabled, active]);

  // Multiple safety checks to prevent rendering on mobile
  if (disabled || isTouchDevice() || isArcadeDisabled() || prefersReducedMotion()) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="catch-docket-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60]"
        >
          <CatchTheDocket isLoading={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatchTheDocketOverlay;
