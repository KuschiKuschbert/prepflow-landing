/**
 * Maps today's forecast to actionable operational tips.
 * Only returns a tip when weather implies a clear decision—no generic filler.
 */

import type { DailyWeatherRecord } from './types';

const RAINY_CODES = new Set([
  51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);
const OVERCAST_FOG_CODES = new Set([3, 45, 48]);

export type TipType = 'rain' | 'hot' | 'cold' | 'cool-overcast';

export interface OperationalTipResult {
  tip: string;
  tipType: TipType;
  weather_status: string;
}

/**
 * Derive an actionable operational tip from today's forecast.
 * Returns null when conditions don't warrant a specific recommendation.
 */
export function getOperationalTip(record: DailyWeatherRecord): OperationalTipResult | null {
  const { temp_celsius_max, precipitation_mm, weather_code, weather_status } = record;

  const precip = Number(precipitation_mm) || 0;
  const tempMax = temp_celsius_max != null ? Number(temp_celsius_max) : null;
  const isRainy = precip >= 2 || (weather_code != null && RAINY_CODES.has(weather_code));
  const isOvercastFog = weather_code != null && OVERCAST_FOG_CODES.has(weather_code);

  // Rain expected – reduce prep / lighter orders
  if (isRainy) {
    return {
      tip: 'Rain expected today – consider reducing dine-in prep.',
      tipType: 'rain',
      weather_status: weather_status || 'Rainy',
    };
  }

  // Hot day – more cold drinks and salads
  if (tempMax != null && tempMax >= 30) {
    return {
      tip: 'Hot day ahead – plan for more cold drinks and salads.',
      tipType: 'hot',
      weather_status: weather_status || 'Hot',
    };
  }

  // Cold day – hot drinks and comfort food
  if (tempMax != null && tempMax <= 12) {
    return {
      tip: 'Cold day – hot drinks and comfort food may sell well.',
      tipType: 'cold',
      weather_status: weather_status || 'Cold',
    };
  }

  // Cool and overcast – comfort food tends to do well
  if (tempMax != null && tempMax >= 13 && tempMax <= 22 && isOvercastFog) {
    return {
      tip: 'Cool and overcast – comfort food tends to do well.',
      tipType: 'cool-overcast',
      weather_status: weather_status || 'Overcast',
    };
  }

  return null;
}
