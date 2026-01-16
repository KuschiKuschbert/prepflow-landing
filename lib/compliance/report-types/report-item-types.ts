/**
 * Type definitions for Health Inspector Report items.
 * These types replace `any[]` in ReportData.ts for strict type safety.
 * Property names match actual data structures used in report-sections/*.ts.
 */

// ============================================================================
// Licenses & Business Info
// ============================================================================

export interface ReportLicense {
  id: string;
  license_type: string;
  license_number: string | null;
  issued_date: string | null;
  expiry_date: string | null;
  status: string;
  issuing_authority: string | null;
  notes: string | null;
}

// ============================================================================
// Employees & Qualifications
// ============================================================================

export interface ReportEmployee {
  id: string;
  employee_id: string | null;
  full_name: string;
  role: string | null;
  employment_start_date: string;
  employment_end_date: string | null;
  status: string;
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Qualifications when joined
  employee_qualifications?: Array<{
    id?: string;
    qualification_name?: string;
    expiry_date?: string;
    [key: string]: unknown;
  }>;
}

export interface ReportQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  expiry_date: string | null;
  status: string;
  document_url: string | null;
  employee_name?: string;
  qualification_types?: {
    id: string;
    name: string;
    type_name?: string;
  };
  employees?: {
    id: string;
    full_name: string;
  };
}

// ============================================================================
// Compliance Records
// ============================================================================

export interface ReportComplianceRecord {
  id: string;
  document_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
  document_url: string | null;
  notes: string | null;
  compliance_types?: {
    id: string;
    name?: string;
    type_name?: string;
  };
  created_at: string;
  updated_at: string;
}

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
// Cleaning Records
// ============================================================================

export interface ReportCleaningTask {
  id: string;
  task_name: string;
  frequency_type: string;
  area_id: string | null;
  assigned_date: string | null;
  equipment_id: string | null;
  section_id: string | null;
  status: string;
  completed_date: string | null;
  completed_by: string | null;
  notes: string | null;
  photo_url: string | null;
  cleaning_areas?: {
    id: string;
    area_name: string;
    name?: string;
  };
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
// Staff Health
// ============================================================================

export interface ReportStaffHealthDeclaration {
  id: string;
  employee_id: string;
  declaration_date: string;
  is_healthy: boolean;
  has_symptoms: boolean;
  symptoms_description: string | null;
  excluded_from_work: boolean;
  exclusion_end_date: string | null;
  declared_by: string | null;
  notes: string | null;
  employees?: {
    id: string;
    full_name: string;
  };
  created_at: string;
}

// ============================================================================
// Incidents
// ============================================================================

export interface ReportIncident {
  id: string;
  incident_date: string;
  incident_time: string | null;
  incident_type: string;
  description: string;
  severity: string;
  status: string;
  location: string | null;
  reported_by: string | null;
  corrective_action: string | null;
  resolution_date: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// HACCP Records
// ============================================================================

export interface ReportHACCPRecord {
  id: string;
  record_date: string;
  haccp_step: string | null;
  critical_control_point: string | null;
  hazard_type: string | null;
  target_value: string | null;
  actual_value: string | null;
  is_within_limit: boolean;
  corrective_action: string | null;
  monitored_by: string | null;
  notes: string | null;
  created_at: string;
}

// ============================================================================
// Allergens
// ============================================================================

export interface ReportAllergenRecord {
  id: string;
  record_date: string;
  record_type: string | null;
  item_name: string | null;
  allergens_present: string[] | null;
  allergens_declared: string[] | null;
  is_accurate: boolean;
  cross_contamination_risk: string | null;
  notes: string | null;
}

// ============================================================================
// Equipment Maintenance
// ============================================================================

export interface ReportEquipmentMaintenance {
  id: string;
  equipment_id: string;
  maintenance_type: string;
  maintenance_date: string;
  scheduled_date: string;
  completed_date: string | null;
  status: string;
  performed_by: string | null;
  service_provider: string | null;
  cost: number | null;
  notes: string | null;
  is_critical: boolean;
  next_maintenance_date: string | null;
  equipment_name?: string;
  equipment_type?: string;
  temperature_equipment?: {
    id: string;
    name: string;
    equipment_type: string;
  };
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

// ============================================================================
// Procedures
// ============================================================================

export interface ReportProcedure {
  id: string;
  procedure_name: string | null;
  procedure_type: string | null;
  description: string | null;
  version: string | null;
  effective_date: string | null;
  last_reviewed_date: string | null;
  next_review_date: string | null;
  is_active: boolean;
  reviewed_by: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Supplier Verification
// ============================================================================

export interface ReportSupplierVerification {
  id: string;
  supplier_id: string;
  verification_date: string;
  verification_type: string | null;
  certificate_type: string | null;
  certificate_number: string | null;
  expiry_date: string | null;
  is_valid: boolean;
  verification_result: string | null;
  verified_by: string | null;
  document_url: string | null;
  notes: string | null;
  suppliers?: {
    id: string;
    supplier_name: string;
  };
  created_at: string;
}

// ============================================================================
// Compliance Gaps
// ============================================================================

export interface ReportComplianceGap {
  id: string;
  gap_type: string;
  type?: string;
  description: string;
  severity: string;
  identified_date: string;
  due_date: string | null;
  status: string;
  assigned_to: string | null;
  employee_name?: string;
  employee_role?: string;
  missing_item?: string;
  corrective_action: string | null;
  resolution_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
