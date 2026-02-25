'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { CloudRain, Snowflake, Sun, Thermometer, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

const CACHE_KEY = 'weather_operational_tip';
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 min
const DISMISS_KEY_PREFIX = 'weather_tip_dismissed_';

function getDismissKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `${DISMISS_KEY_PREFIX}${today}`;
}

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(getDismissKey()) === 'true';
}

interface TipData {
  tip: string;
  tipType?: string;
}

function getIconForTipType(tipType?: string) {
  switch (tipType) {
    case 'rain':
      return CloudRain;
    case 'hot':
      return Sun;
    case 'cold':
      return Snowflake;
    case 'cool-overcast':
      return Thermometer;
    default:
      return Thermometer;
  }
}

function WeatherOperationalTipBase() {
  const [tipData, setTipData] = useState<TipData | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCachedData<TipData>(CACHE_KEY);
  });
  const [dismissed, setDismissed] = useState(() => isDismissed());

  const fetchTip = useCallback(async () => {
    const cached = getCachedData<TipData>(CACHE_KEY);
    if (cached?.tip) {
      setTipData(cached);
      return;
    }

    try {
      const res = await fetch('/api/weather/operational-tip');
      const data = (await res.json()) as { tip: string | null; tipType?: string };
      if (data.tip) {
        const result = { tip: data.tip, tipType: data.tipType };
        setTipData(result);
        cacheData(CACHE_KEY, result, CACHE_EXPIRY_MS);
      } else {
        setTipData(null);
      }
    } catch {
      setTipData(null);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    fetchTip();
  }, [dismissed, fetchTip]);

  const handleDismiss = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(getDismissKey(), 'true');
    setDismissed(true);
  }, []);

  if (dismissed || !tipData?.tip) return null;

  const IconComponent = getIconForTipType(tipData.tipType);

  return (
    <div
      role="region"
      aria-label="Weather tip"
      className="mb-4 flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 via-[var(--accent)]/5 to-[var(--primary)]/10 px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          icon={IconComponent}
          size="sm"
          className="shrink-0 text-[var(--primary)]"
          aria-hidden
        />
        <p className="text-sm font-medium text-[var(--foreground)]">{tipData.tip}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Dismiss weather tip"
      >
        <Icon icon={X} size="sm" aria-hidden />
      </button>
    </div>
  );
}

export const WeatherOperationalTip = memo(WeatherOperationalTipBase);
