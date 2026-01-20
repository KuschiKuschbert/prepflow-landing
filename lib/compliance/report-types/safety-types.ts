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
