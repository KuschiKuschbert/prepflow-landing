'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { CloudRain, X } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';

const CACHE_KEY = 'weather_function_alerts';
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 min
const DISMISS_KEY_PREFIX = 'weather_function_alerts_dismissed_';

function getDismissKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `${DISMISS_KEY_PREFIX}${today}`;
}

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(getDismissKey()) === 'true';
}

interface AlertItem {
  functionId: string;
  functionName: string;
  startDate: string;
  tip: string;
}

interface AlertsData {
  alerts: AlertItem[];
}

function FunctionsWeatherAlertsBase() {
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const cached = getCachedData<AlertsData>(CACHE_KEY);
    return cached?.alerts ?? [];
  });
  const [dismissed, setDismissed] = useState(() => isDismissed());

  const fetchAlerts = useCallback(async () => {
    const cached = getCachedData<AlertsData>(CACHE_KEY);
    if (cached?.alerts?.length) {
      setAlerts(cached.alerts);
      return;
    }

    try {
      const res = await fetch('/api/weather/function-alerts');
      const data = (await res.json()) as AlertsData;
      const list = Array.isArray(data.alerts) ? data.alerts : [];
      setAlerts(list);
      cacheData(CACHE_KEY, { alerts: list }, CACHE_EXPIRY_MS);
    } catch {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    fetchAlerts();
  }, [dismissed, fetchAlerts]);

  const handleDismiss = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(getDismissKey(), 'true');
    setDismissed(true);
  }, []);

  if (dismissed || !alerts.length) return null;

  return (
    <div
      role="region"
      aria-label="Weather alerts for upcoming events"
      className="mb-4 flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 via-[var(--accent)]/5 to-[var(--primary)]/10 px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Icon icon={CloudRain} size="sm" className="shrink-0 text-[var(--primary)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--foreground)]">
            Rain expected on upcoming events
          </span>
        </div>
        <ul className="ml-6 list-inside list-disc space-y-0.5 text-sm text-[var(--foreground-secondary)]">
          {alerts.map(a => (
            <li key={a.functionId}>
              <Link
                href={`/webapp/functions/${a.functionId}`}
                className="font-medium text-[var(--primary)] underline decoration-[var(--primary)]/30 underline-offset-2 transition-colors hover:decoration-[var(--primary)]"
              >
                {a.functionName}
              </Link>
              {' on '}
              {new Date(a.startDate + 'T00:00:00').toLocaleDateString('en-AU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
              — {a.tip}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Dismiss weather alerts"
      >
        <Icon icon={X} size="sm" aria-hidden />
      </button>
    </div>
  );
}

export const FunctionsWeatherAlerts = memo(FunctionsWeatherAlertsBase);
