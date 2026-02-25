export interface QualificationType {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  default_expiry_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  certificate_number: string | null;
  issue_date: string;
  expiry_date: string | null;
  issuing_authority: string | null;
  document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  qualification_types?: QualificationType;
}
