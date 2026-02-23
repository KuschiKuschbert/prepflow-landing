'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { buildGuideUrl } from '@/lib/page-help/page-help-config';
import { X } from 'lucide-react';

const RESCUE_DISMISSED_PREFIX = 'prepflow_rescue_dismissed_';
const IDLE_MS = 25000; // 25 seconds - trigger when idle on empty page

function getDismissedKey(pageKey: string): string {
  return `${RESCUE_DISMISSED_PREFIX}${pageKey}`;
}

function isDismissed(pageKey: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getDismissedKey(pageKey)) === 'true';
}

export interface RescueNudgeProps {
  /** Page key for localStorage (e.g. 'ingredients', 'recipes') */
  pageKey: string;
  /** Guide ID for "Show me how" link */
  guideId: string;
  /** Optional step index for guide deep-link */
  guideStepIndex?: number;
  /** Only show when true (e.g. when empty state is displayed) */
  enabled?: boolean;
  /** Custom idle timeout in ms (default: 25000) */
  idleMs?: number;
  className?: string;
}

/**
 * Rescue-based nudge: appears when user has been idle on empty page ~25s.
 * "Need a hand? [Show me how]" - dismissible, never repeated once dismissed.
 * Pilot on 1-2 pages. Respects user control—triggered by friction, not proactively.
 */
export function RescueNudge({
  pageKey,
  guideId,
  guideStepIndex,
  enabled = true,
  idleMs = IDLE_MS,
  className = '',
}: RescueNudgeProps) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!enabled || isDismissed(pageKey)) return;
    timerRef.current = setTimeout(() => {
      setShow(true);
      timerRef.current = null;
    }, idleMs);
  }, [enabled, pageKey, idleMs]);

  useEffect(() => {
    if (!enabled || isDismissed(pageKey)) return;
    resetTimer();

    const handleActivity = () => {
      if (show) return; // Already showing, don't reset
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        setShow(true);
        timerRef.current = null;
      }, idleMs);
    };

    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [enabled, pageKey, idleMs, show, resetTimer]);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getDismissedKey(pageKey), 'true');
    }
    setShow(false);
  };

  if (!show || !enabled) return null;

  const guideUrl = buildGuideUrl(guideId, guideStepIndex);

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-lg ${className}`}
      role="region"
      aria-label="Need help?"
    >
      <p className="text-sm text-[var(--foreground-secondary)]">
        Need a hand?{' '}
        <Link
          href={guideUrl}
          className="font-medium text-[var(--primary)] underline-offset-2 transition-colors hover:underline"
        >
          Show me how
        </Link>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Dismiss"
      >
        <Icon icon={X} size="sm" aria-hidden />
      </button>
    </div>
  );
}
