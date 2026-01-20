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
