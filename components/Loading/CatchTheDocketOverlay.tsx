'use client';

import dynamic from 'next/dynamic';
import CatchTheDocket from '@/components/Loading/CatchTheDocket';
import { subscribeLoadingGate } from '@/lib/loading-gate';
import { prefersReducedMotion, isArcadeDisabled, isTouchDevice } from '@/lib/arcadeGuards';
import React, { useEffect, useMemo, useState } from 'react';

const routePath = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

const isAuthRoute = (path: string) => {
  return path.startsWith('/api/auth') || path.startsWith('/login') || path.startsWith('/auth');
};

// Lazy load framer-motion to reduce initial bundle size
const CatchTheDocketOverlayContent = dynamic(
  () =>
    import('framer-motion').then(mod => {
      const { AnimatePresence, motion } = mod;

      return {
        default: function CatchTheDocketOverlayContent({ active }: { active: boolean }) {
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
        },
      };
    }),
  {
    ssr: false,
    loading: () => null,
  },
);

const CatchTheDocketOverlay: React.FC = () => {
  const [active, setActive] = useState(false);
  const disabled = useMemo(() => {
    const path = routePath();
    // Enable on touch devices, only disable for reduced motion, arcade disabled flag, or auth routes
    const d = prefersReducedMotion() || isArcadeDisabled() || isAuthRoute(path);
    if (d && typeof window !== 'undefined') {
      const payload = {
        event: 'arcade_disabled',
        event_category: 'arcade',
        page_path: path,
        reason: isAuthRoute(path)
          ? 'auth_route'
          : prefersReducedMotion()
            ? 'reduced_motion'
            : 'flag',
      } as const;
      (window as any) /* justified: global object access */.dataLayer
        ?.push(payload);
      window.dispatchEvent(new CustomEvent('gtm:event', { detail: payload }));
    }
    return d;
  }, []);

  useEffect(() => {
    // Double-check disabled state on every render to prevent race conditions
    if (disabled || isArcadeDisabled() || prefersReducedMotion()) return;
    return subscribeLoadingGate(isVisible => {
      // Additional safety check before showing overlay
      if (isVisible && (isArcadeDisabled() || prefersReducedMotion())) {
        return;
      }

      // analytics hooks
      if (isVisible && !active) {
        const startPayload = {
          event: 'arcade_loading_start',
          event_category: 'arcade',
          page_path: routePath(),
          threshold_ms: 800,
          is_touch_device: isTouchDevice(),
        } as const;
        (window as any) /* justified: global object access */.dataLayer
          ?.push(startPayload);
        window.dispatchEvent(new CustomEvent('gtm:event', { detail: startPayload }));
      }

      if (!isVisible && active) {
        const endPayload = {
          event: 'arcade_loading_end',
          event_category: 'arcade',
          page_path: routePath(),
          is_touch_device: isTouchDevice(),
        } as const;
        (window as any) /* justified: global object access */.dataLayer
          ?.push(endPayload);
        window.dispatchEvent(new CustomEvent('gtm:event', { detail: endPayload }));
      }

      setActive(isVisible);
    });
  }, [disabled, active]);

  // Safety checks - only disable for reduced motion, arcade disabled flag, or auth routes
  if (disabled || isArcadeDisabled() || prefersReducedMotion()) return null;

  return <CatchTheDocketOverlayContent active={active} />;
};

export default CatchTheDocketOverlay;
