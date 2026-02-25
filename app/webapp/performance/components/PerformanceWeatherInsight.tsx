'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { TrendingUp, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

const CACHE_KEY = 'weather_performance_insight';
const CACHE_EXPIRY_MS = 15 * 60 * 1000;
const DISMISS_KEY = 'weather_performance_insight_dismissed';

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const today = new Date().toISOString().split('T')[0];
  return sessionStorage.getItem(`${DISMISS_KEY}_${today}`) === 'true';
}

function PerformanceWeatherInsightBase() {
  const [insight, setInsight] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = getCachedData<{ insight: string | null }>(CACHE_KEY);
    return cached?.insight ?? null;
  });
  const [dismissed, setDismissed] = useState(() => isDismissed());

  const fetchInsight = useCallback(async () => {
    const cached = getCachedData<{ insight: string | null }>(CACHE_KEY);
    if (cached?.insight) {
      setInsight(cached.insight);
      return;
    }
    try {
      const res = await fetch('/api/weather/performance-insight');
      const data = (await res.json()) as { insight: string | null };
      const tip = data.insight ?? null;
      setInsight(tip);
      cacheData(CACHE_KEY, { insight: tip }, CACHE_EXPIRY_MS);
    } catch {
      setInsight(null);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    fetchInsight();
  }, [dismissed, fetchInsight]);

  const handleDismiss = useCallback(() => {
    if (typeof window === 'undefined') return;
    const today = new Date().toISOString().split('T')[0];
    sessionStorage.setItem(`${DISMISS_KEY}_${today}`, 'true');
    setDismissed(true);
  }, []);

  if (dismissed || !insight) return null;

  return (
    <div
      role="region"
      aria-label="Performance weather insight"
      className="mb-4 flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 via-[var(--accent)]/5 to-[var(--primary)]/10 px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon icon={TrendingUp} size="sm" className="shrink-0 text-[var(--primary)]" aria-hidden />
        <p className="text-sm font-medium text-[var(--foreground)]">{insight}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Dismiss weather insight"
      >
        <Icon icon={X} size="sm" aria-hidden />
      </button>
    </div>
  );
}

export const PerformanceWeatherInsight = memo(PerformanceWeatherInsightBase);
