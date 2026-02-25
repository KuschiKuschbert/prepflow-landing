/**
 * Weather types for Open-Meteo integration.
 * All values use metric units: Celsius, millimeters.
 */

/** Current weather for header widget */
export interface CurrentWeather {
  temp_celsius: number | null;
  precipitation_mm: number;
  weather_code: number | null;
  weather_status: string;
  isFallback?: boolean;
}

/** Daily weather record for correlation with operational data */
export interface DailyWeatherRecord {
  log_date: string;
  temp_celsius_max: number | null;
  temp_celsius_min: number | null;
  precipitation_mm: number;
  weather_code: number | null;
  weather_status: string;
}

/** Open-Meteo forecast API response (current) */
export interface OpenMeteoCurrentResponse {
  current?: {
    temperature_2m?: number;
    precipitation?: number;
    weather_code?: number;
  };
}

/** Open-Meteo forecast API response (daily) */
export interface OpenMeteoDailyResponse {
  daily?: {
    time?: string[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_sum?: (number | null)[];
    weather_code?: (number | null)[];
  };
}
