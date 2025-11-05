/**
 * Global Loading Gate
 *
 * Simple client-side event bus to coordinate showing a loading overlay
 * only when long operations exceed a threshold. Pages start/stop the gate
 * with keys; overlay subscribes to active state.
 */

'use client';

type Subscriber = (active: boolean) => void;

const ACTIVE_KEYS: Set<string> = new Set();
const SUBSCRIBERS: Set<Subscriber> = new Set();

const THRESHOLD_MS = 800; // show overlay if loading lasts longer than this
let showTimer: number | null = null;
let visible = false;

const notify = () => {
  const isActive = ACTIVE_KEYS.size > 0;
  SUBSCRIBERS.forEach(cb => {
    try {
      cb(isActive && visible);
    } catch (_) {}
  });
};

const ensureShowTimer = () => {
  if (showTimer != null) return;
  // delay showing overlay until threshold elapsed
  showTimer = window.setTimeout(() => {
    showTimer = null;
    const isActive = ACTIVE_KEYS.size > 0;
    visible = isActive;
    notify();
  }, THRESHOLD_MS) as unknown as number;
};

const clearShowTimer = () => {
  if (showTimer != null) {
    clearTimeout(showTimer as unknown as number);
    showTimer = null;
  }
};

export const startLoadingGate = (key: string) => {
  if (typeof window === 'undefined') return;
  ACTIVE_KEYS.add(key);
  // Start threshold timer; if already visible, notify immediately
  if (!visible) ensureShowTimer();
  else notify();
};

export const stopLoadingGate = (key: string) => {
  if (typeof window === 'undefined') return;
  ACTIVE_KEYS.delete(key);
  if (ACTIVE_KEYS.size === 0) {
    clearShowTimer();
    if (visible) {
      visible = false;
      notify();
    }
  } else if (visible) {
    // still active by other keys
    notify();
  }
};

export const subscribeLoadingGate = (cb: Subscriber) => {
  SUBSCRIBERS.add(cb);
  // immediate sync
  cb(ACTIVE_KEYS.size > 0 && visible);
  return () => {
    SUBSCRIBERS.delete(cb);
  };
};

export const getLoadingGateVisible = () => visible && ACTIVE_KEYS.size > 0;
