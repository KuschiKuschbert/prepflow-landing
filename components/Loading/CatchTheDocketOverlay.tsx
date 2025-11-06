'use client';

import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { subscribeLoadingGate } from '@/lib/loading-gate';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isArcadeDisabled = () => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('PF_DISABLE_ARCADE_LOADING') === '1';
  } catch (_) {
    return false;
  }
};

const isTouchDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  try {
    const hasTouch = navigator.maxTouchPoints > 0 || (window as any).ontouchstart !== undefined;
    const forceEnable = localStorage.getItem('PF_ENABLE_ARCADE_MOBILE') === '1';
    return hasTouch && !forceEnable;
  } catch (_) {
    return false;
  }
};

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
    if (disabled) return;
    return subscribeLoadingGate(isVisible => {
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

  if (disabled) return null;

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
