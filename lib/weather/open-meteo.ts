/**
 * Open-Meteo weather API integration.
 * Free API, no key required. All values in metric units (Celsius, mm).
 */

import { logger } from '@/lib/logger';
import type {
  CurrentWeather,
  DailyWeatherRecord,
  OpenMeteoCurrentResponse,
  OpenMeteoDailyResponse,
} from './types';
import { mapWeatherCodeToStatus } from './wmo-codes';
import { getVenueCoordinatesFromDb } from './venue-coordinates';

export { getVenueCoordinatesFromDb, mapWeatherCodeToStatus };

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

const FALLBACK_WEATHER: CurrentWeather = {
  temp_celsius: null,
  precipitation_mm: 0,
  weather_code: null,
  weather_status: 'Unavailable',
  isFallback: true,
};

const FALLBACK_DAILY: Omit<DailyWeatherRecord, 'log_date'> = {
  temp_celsius_max: null,
  temp_celsius_min: null,
  precipitation_mm: 0,
  weather_code: null,
  weather_status: 'Unavailable',
};

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  try {
    const url = new URL(OPEN_METEO_BASE);
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('current', 'temperature_2m,precipitation,weather_code');
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      logger.warn('[Open-Meteo] API error:', { status: res.status });
      return FALLBACK_WEATHER;
    }

    const data = (await res.json()) as OpenMeteoCurrentResponse;
    const current = data.current;

    if (!current) {
      return FALLBACK_WEATHER;
    }

    const temp = current.temperature_2m ?? null;
    const precip = current.precipitation ?? 0;
    const code = current.weather_code ?? null;

    return {
      temp_celsius: temp,
      precipitation_mm: precip,
      weather_code: code,
      weather_status: mapWeatherCodeToStatus(code),
      isFallback: false,
    };
  } catch (err) {
    logger.error('[Open-Meteo] Fetch failed:', { error: err });
    return FALLBACK_WEATHER;
  }
}

export async function fetchDailyWeather(
  lat: number,
  lon: number,
  date: string,
): Promise<DailyWeatherRecord> {
  try {
    const url = new URL(OPEN_METEO_BASE);
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set(
      'daily',
      'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
    );
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('start_date', date);
    url.searchParams.set('end_date', date);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      logger.warn('[Open-Meteo] Daily API error:', { status: res.status });
      return { log_date: date, ...FALLBACK_DAILY };
    }

    const data = (await res.json()) as OpenMeteoDailyResponse;
    const daily = data.daily;

    if (!daily?.time?.length) {
      return { log_date: date, ...FALLBACK_DAILY };
    }

    const idx = daily.time.findIndex(t => t.startsWith(date));
    if (idx < 0) {
      return { log_date: date, ...FALLBACK_DAILY };
    }

    const tempMax = daily.temperature_2m_max?.[idx] ?? null;
    const tempMin = daily.temperature_2m_min?.[idx] ?? null;
    const precip = daily.precipitation_sum?.[idx] ?? 0;
    const code = daily.weather_code?.[idx] ?? null;

    return {
      log_date: date,
      temp_celsius_max: tempMax,
      temp_celsius_min: tempMin,
      precipitation_mm: precip ?? 0,
      weather_code: code,
      weather_status: mapWeatherCodeToStatus(code),
    };
  } catch (err) {
    logger.error('[Open-Meteo] Daily fetch failed:', { error: err, date });
    return { log_date: date, ...FALLBACK_DAILY };
  }
}
