/**
 * Types for temperature log generation.
 */

export interface TemperatureLogOptions {
  equipment: Array<{
    id: string;
    name: string;
    equipment_type: string;
    min_temp_celsius: number | null;
    max_temp_celsius: number | null;
    is_active: boolean;
  }>;
  countryCode?: string;
  days?: number;
  logsPerDay?: number;
  includeOutOfRange?: boolean;
  outOfRangePercentage?: number;
}

export interface GeneratedTemperatureLog {
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string;
  notes: string | null;
  logged_by: string;
  equipment_id?: string;
}
