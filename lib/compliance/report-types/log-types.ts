// ============================================================================
// Temperature Logs & Violations
// ============================================================================

export interface ReportTemperatureLog {
  id: string;
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string | null;
  equipment_id: string | null;
  notes: string | null;
  photo_url: string | null;
  logged_by: string | null;
  is_out_of_range?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportTemperatureViolation {
  id: string;
  log_date: string;
  log_time: string | null;
  temperature_celsius: number;
  temperature_type: string | null;
  location: string | null;
  violation_type: string;
  threshold: number | null;
  deviation: number;
  logged_by: string | null;
  notes: string | null;
}

// ============================================================================
// Sanitizer Logs
// ============================================================================

export interface ReportSanitizerLog {
  id: string;
  log_date: string;
  log_time: string | null;
  sanitizer_type: string | null;
  concentration_ppm: number | null;
  location: string | null;
  tested_by: string | null;
  is_within_range: boolean;
  notes: string | null;
  created_at: string;
}

// ============================================================================
// Waste Management
// ============================================================================

export interface ReportWasteLog {
  id: string;
  log_date: string;
  waste_type: string;
  quantity: number;
  unit: string;
  disposal_method: string | null;
  cost: number | null;
  logged_by: string | null;
  contractor_name: string | null;
  notes: string | null;
  created_at: string;
}
