'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

const CACHE_KEY = 'weather_current';
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

interface WeatherData {
  temp_celsius: number | null;
  precipitation_mm: number;
  weather_status: string;
  isFallback?: boolean;
}

function getWeatherIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes('rain') || s.includes('drizzle') || s.includes('shower')) return CloudRain;
  if (s.includes('clear') || s.includes('mainly clear')) return Sun;
  return Cloud;
}

function WeatherWidgetBase() {
  const { coords } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCachedData<WeatherData>(CACHE_KEY);
  });
  const [loading, setLoading] = useState(!weather);

  useEffect(() => {
    const cached = getCachedData<WeatherData>(CACHE_KEY);
    if (cached) {
      setWeather(cached);
      setLoading(false);
    }

    const url = new URL('/api/weather/current', window.location.origin);
    if (coords) {
      url.searchParams.set('lat', String(coords.lat));
      url.searchParams.set('lon', String(coords.lon));
    }

    const controller = new AbortController();
    fetch(url.toString(), { signal: controller.signal })
      .then(res => res.json())
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
        cacheData(CACHE_KEY, data, CACHE_EXPIRY_MS);
      })
      .catch(() => {
        setWeather(
          prev =>
            prev ?? {
              temp_celsius: null,
              precipitation_mm: 0,
              weather_status: 'Unavailable',
              isFallback: true,
            },
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [coords?.lat, coords?.lon]);

  if (loading && !weather) {
    return (
      <div
        className="flex h-10 w-16 animate-pulse items-center justify-center rounded-xl bg-[var(--surface-variant)]/50"
        aria-hidden
      >
        <span className="text-xs text-gray-500">—</span>
      </div>
    );
  }

  const temp = weather?.temp_celsius;
  const precip = weather?.precipitation_mm ?? 0;
  const status = weather?.weather_status ?? 'Unavailable';
  const IconComponent = getWeatherIcon(status);

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--surface-variant)]/50"
      title={`${status}${precip > 0 ? ` · ${precip} mm` : ''}`}
      aria-label={`Weather: ${status}, ${temp != null ? `${temp}°C` : 'temperature unavailable'}`}
    >
      <Icon icon={IconComponent} size="sm" className="text-gray-400" aria-hidden />
      <span className="text-sm text-white tabular-nums">
        {temp != null ? `${Math.round(temp)}°` : '—'}
      </span>
    </div>
  );
}

export const WeatherWidget = memo(WeatherWidgetBase);
